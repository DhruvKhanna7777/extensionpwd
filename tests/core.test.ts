// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { defaults, validateSettings } from "../src/settings";
import { PageEngine } from "../src/engine";

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML =
    '<main><article><h1>Reading</h1><p id="prose">Original paragraph with <a href="#">a link</a>.</p><pre>code sample</pre><p><input value="private" /></p><p role="alert">Important warning</p><p contenteditable="true">Draft</p></article><form><label>Password<input type="password" value="secret" /></label><button>Submit</button></form></main>';
});

describe("safe settings", () => {
  it("clamps untrusted saved values and defaults invalid types", () => {
    const s = validateSettings({
      fontScale: 999,
      lineHeight: 0,
      reading: "yes",
      letterSpacing: NaN,
      fontFamily: "url(evil)",
      calm: "bogus",
    });
    expect(s.fontScale).toBe(180);
    expect(s.lineHeight).toBe(1.35);
    expect(s.reading).toBe(false);
    expect(s.letterSpacing).toBe(0);
    expect(s.fontFamily).toBe("system-ui");
    expect(s.calm).toBe("default");
  });
  it("accepts null and unknown stored schema without crashing", () => {
    expect(validateSettings(null)).toEqual(defaults);
  });
});

describe("reversible page adaptation", () => {
  it("does not hide marked custom widgets or keyboard targets", () => {
    document.body.innerHTML =
      '<main><div data-av-distractor role="button" tabindex="0">Custom action</div><div data-av-distractor><div tabindex="0">Keyboard target</div></div></main>';
    expect(
      new PageEngine(document).apply({ ...defaults, distractions: true })
        .hidden,
    ).toBe(0);
  });
  it("hides only marked noninteractive distractions and restores them", () => {
    document.body.innerHTML =
      '<main><div data-av-distractor id="banner">Decorative demo banner</div><div data-av-distractor><a href="#">Navigation</a></div><div data-av-distractor role="alert">Warning</div><div data-av-distractor><form><input value="keep"/></form></div><p>Unmarked prose</p></main>';
    const before = document.body.innerHTML;
    const engine = new PageEngine(document);
    const result = engine.apply({ ...defaults, distractions: true });
    expect(result.hidden).toBe(1);
    expect(
      document.querySelector("#banner")?.hasAttribute("data-ableverse-hidden"),
    ).toBe(true);
    expect(document.querySelectorAll("[data-ableverse-hidden]")).toHaveLength(
      1,
    );
    engine.restore();
    expect(document.body.innerHTML).toBe(before);
  });
  it("preserves original heading hierarchy and scales each rendered size", () => {
    document.head.innerHTML =
      "<style>h1{font-size:36px}p{font-size:18px}</style>";
    document.body.innerHTML = "<main><h1>Heading</h1><p>Paragraph</p></main>";
    const engine = new PageEngine(document);
    engine.apply({ ...defaults, reading: true, fontScale: 100 });
    expect(getComputedStyle(document.querySelector("h1")!).fontSize).toBe(
      "36px",
    );
    expect(getComputedStyle(document.querySelector("p")!).fontSize).toBe(
      "18px",
    );
    engine.apply({ ...defaults, reading: true, fontScale: 150 });
    expect(getComputedStyle(document.querySelector("h1")!).fontSize).toBe(
      "54px",
    );
    expect(getComputedStyle(document.querySelector("p")!).fontSize).toBe(
      "27px",
    );
    engine.restore();
    expect(getComputedStyle(document.querySelector("h1")!).fontSize).toBe(
      "36px",
    );
  });
  it("changes eligible prose while protecting fields, code, alerts and editable content", () => {
    const engine = new PageEngine(document);
    engine.apply({ ...defaults, reading: true, fontScale: 140 });
    expect(
      document.querySelector("#prose")?.hasAttribute("data-ableverse-prose"),
    ).toBe(true);
    expect(
      document.querySelector("pre")?.hasAttribute("data-ableverse-prose"),
    ).toBe(false);
    expect(
      document
        .querySelector("[contenteditable]")
        ?.hasAttribute("data-ableverse-prose"),
    ).toBe(false);
    expect(
      document
        .querySelector("[role=alert]")
        ?.hasAttribute("data-ableverse-prose"),
    ).toBe(false);
    expect(document.querySelector("input")?.value).toBe("private");
    expect(
      document.querySelector("input[type=password]")?.getAttribute("value"),
    ).toBe("secret");
  });
  it("is idempotent and restores only extension changes without overwriting new page content", () => {
    const engine = new PageEngine(document);
    const before = document.body.innerHTML;
    engine.apply({ ...defaults, reading: true, focus: true });
    engine.apply({ ...defaults, reading: true, focus: true });
    expect(
      document.querySelectorAll("style[data-ableverse-owned]").length,
    ).toBe(1);
    engine.restore();
    engine.restore();
    expect(document.body.innerHTML).toBe(before);
    engine.apply({ ...defaults, reading: true });
    document.querySelector("#prose")!.textContent = "Updated by site";
    engine.restore();
    expect(document.querySelector("#prose")?.textContent).toBe(
      "Updated by site",
    );
  });
  it("does not leave typography applied when Reading is disabled", () => {
    const engine = new PageEngine(document);
    engine.apply({ ...defaults, reading: true });
    engine.apply({ ...defaults, reading: false, motion: true });
    expect(document.querySelector("[data-ableverse-prose]")).toBeNull();
  });
  it("scales nested prose once rather than compounding size through list parents", () => {
    document.body.innerHTML =
      "<main><ul><li><p>Nested reading text</p></li></ul></main>";
    new PageEngine(document).apply({
      ...defaults,
      reading: true,
      fontScale: 180,
    });
    expect(
      document.querySelector("p")?.hasAttribute("data-ableverse-prose"),
    ).toBe(true);
    expect(
      document.querySelector("li")?.hasAttribute("data-ableverse-prose"),
    ).toBe(false);
  });
});

function chart(value = "30") {
  return `<svg data-av-chart="bar" data-av-unit="units" aria-label="Monthly results" viewBox="0 0 300 160"><rect data-av-label="March" data-av-value="${value}" x="30" y="80" width="40" height="60" fill="red"/><rect data-av-label="April" data-av-value="55" x="100" y="30" width="40" height="110" fill="green"/></svg>`;
}
describe("verified bar charts", () => {
  it("applies patterns over an inline fill and restores that original style", () => {
    document.body.innerHTML =
      '<svg data-av-chart="bar"><rect x="0" y="20" width="40" height="60" style="fill:purple" data-av-label="A" data-av-value="30"/></svg>';
    const before = document.body.innerHTML;
    const bar = document.querySelector("rect")!;
    const engine = new PageEngine(document);
    engine.apply({ ...defaults, chroma: true });
    expect(getComputedStyle(bar).fill).toMatch(/^url\(#ableverse-pattern-/);
    engine.restore();
    expect(document.body.innerHTML).toBe(before);
  });
  it("leaves transformed bars unchanged rather than misplacing labels", () => {
    document.body.innerHTML = chart().replace(
      "<rect",
      '<rect transform="translate(20 30)"',
    );
    const before = document.querySelector("svg")!.outerHTML;
    const result = new PageEngine(document).apply({
      ...defaults,
      chroma: true,
    });
    expect(result.charts).toBe(0);
    expect(document.querySelector("svg")!.outerHTML).toBe(before);
  });
  it("shows exact values and distinct patterns, then restores original SVG", () => {
    document.body.innerHTML = chart();
    const original = document.body.innerHTML;
    const engine = new PageEngine(document);
    const result = engine.apply({ ...defaults, chroma: true });
    expect(result.charts).toBe(1);
    expect(
      [...document.querySelectorAll("tbody tr")].map((x) => x.textContent),
    ).toEqual(["March30units", "April55units"]);
    const bars = document.querySelectorAll("rect[data-av-value]");
    expect(bars[0].getAttribute("fill")).not.toBe(bars[1].getAttribute("fill"));
    engine.apply({ ...defaults, chroma: true });
    expect(document.querySelectorAll("table").length).toBe(1);
    engine.restore();
    expect(document.body.innerHTML).toBe(original);
  });
  it.each(["NaN", "", "Infinity", "12px"])(
    "rejects invalid value %s atomically",
    (value) => {
      document.body.innerHTML = chart(value);
      const before = document.body.innerHTML;
      const result = new PageEngine(document).apply({
        ...defaults,
        chroma: true,
      });
      expect(result.charts).toBe(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(document.querySelector("svg")?.outerHTML).toBe(before);
    },
  );
  it("reports unsupported canvas without inventing values", () => {
    document.body.innerHTML = '<canvas aria-label="Chart"></canvas>';
    const result = new PageEngine(document).apply({
      ...defaults,
      chroma: true,
    });
    expect(result.charts).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(document.querySelector("table")).toBeNull();
  });
});
