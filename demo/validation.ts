import { PageEngine } from "../src/engine";
import { defaults } from "../src/settings";
import { advancedChecks } from "./advanced-checks";
const fixture = document.querySelector<HTMLDivElement>("#fixture")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;
const results = document.querySelector<HTMLOListElement>("#results")!;
const engine = new PageEngine(document);
const source = `<main><article><h1>Preserve heading hierarchy</h1><p id="prose">A readable paragraph with a <a href="#fixture">working link</a>.</p><h4 id="lower-heading" style="font-size:20px">Lower-level heading</h4><p role="button" tabindex="0" id="custom-control">Custom page control</p><p role="alert">Important warning stays intact.</p><pre><code>Protected code sample</code></pre><p contenteditable="true">Editable draft</p></article><form><label>Name <input name="name" value="Demo reader"></label><label>Password <input type="password" value="demo-only"></label><button type="submit">Submit locally</button><output id="form-result"></output></form><figure><svg data-av-chart="bar" data-av-unit="units" aria-label="Verified months" viewBox="0 0 400 200"><title>Verified months</title><path d="M20 20V170H380" fill="none" stroke="black"/><rect x="50" y="110" width="50" height="60" fill="red" style="fill:purple" data-av-label="March" data-av-value="30"/><rect x="150" y="60" width="50" height="110" fill="green" data-av-label="April" data-av-value="55"/><text x="50" y="190">March</text><text x="150" y="190">April</text></svg><figcaption>Ground truth: March 30, April 55 units.</figcaption></figure><canvas width="200" height="50" aria-label="Unsupported chart without source data"></canvas></main>`;
function reset() {
  engine.restore();
  fixture.innerHTML = source;
  fixture.insertAdjacentHTML(
    "beforeend",
    '<div class="motion-sample" id="motion-sample">Animated fixture</div><div class="motion-sample" role="status" id="progress-sample">Essential progress indicator</div><div data-av-distractor id="marked-banner">Decorative marked banner</div>',
  );
  fixture.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault();
    fixture.querySelector("output")!.textContent = "Submitted locally";
  });
}
function assert(name: string, condition: boolean) {
  const row = document.createElement("li");
  row.textContent = `${condition ? "PASS" : "FAIL"} — ${name}`;
  results.append(row);
  return condition;
}
function contrast(foreground: string, background: string) {
  const luminance = (rgb: string) => {
    const values = (rgb.match(/[\d.]+/g) || [])
      .slice(0, 3)
      .map(Number)
      .map((v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
    return values.length === 3
      ? values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722
      : NaN;
  };
  const a = luminance(foreground),
    b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
reset();
document.querySelector("#restore")!.addEventListener("click", () => {
  reset();
  status.textContent = "Fixture restored. You can run the checks again.";
});
document.querySelector("#run")!.addEventListener("click", async () => {
  const buttons = ["#run", "#restore"].map((selector) =>
    document.querySelector<HTMLButtonElement>(selector)!,
  );
  buttons.forEach((button) => (button.disabled = true));
  reset();
  results.replaceChildren();
  const checks: boolean[] = [];
  const original = fixture.innerHTML;
  const heading = fixture.querySelector("h1")!;
  const prose = fixture.querySelector<HTMLParagraphElement>("#prose")!;
  const input = fixture.querySelector<HTMLInputElement>("input")!;
  const code = fixture.querySelector("code")!;
  const custom = fixture.querySelector("#custom-control")!;
  const beforeCustom = getComputedStyle(custom).fontSize;
  const beforeCode = getComputedStyle(code).fontSize;
  const beforeInput = getComputedStyle(input).fontSize;
  try {
    const profile = {
      ...defaults,
      reading: true,
      fontScale: 150,
      motion: true,
      focus: true,
      emphasis: true,
      calm: "warm",
      chroma: true,
      distractions: true,
    };
    const result = engine.apply(profile);
    checks.push(
      assert(
        "Custom page control keeps its size and receives no prose marker",
        getComputedStyle(custom).fontSize === beforeCustom &&
          !custom.hasAttribute("data-ableverse-prose"),
      ),
    );
    checks.push(
      assert(
        "Lower-level heading scales from 20px to 30px",
        getComputedStyle(fixture.querySelector("#lower-heading")!).fontSize ===
          "30px",
      ),
    );
    checks.push(
      assert(
        "Only the marked distraction is hidden; the form stays visible",
        result.hidden === 1 &&
          getComputedStyle(fixture.querySelector("#marked-banner")!).display ===
            "none" &&
          getComputedStyle(fixture.querySelector("form")!).display !== "none",
      ),
    );
    checks.push(
      assert(
        "Reduced motion stops fixture animation but preserves status animation",
        getComputedStyle(fixture.querySelector("#motion-sample")!)
          .animationName === "none" &&
          getComputedStyle(fixture.querySelector("#progress-sample")!)
            .animationName === "validation-pulse",
      ),
    );
    checks.push(
      assert(
        `Focus and control emphasis are visible outlines (article ${getComputedStyle(fixture.querySelector("article")!).outlineWidth}, input ${getComputedStyle(input).outlineWidth})`,
        getComputedStyle(fixture.querySelector("article")!).outlineStyle ===
          "solid" &&
          getComputedStyle(input).outlineStyle === "solid" &&
          Math.abs(
            Number.parseFloat(
              getComputedStyle(fixture.querySelector("article")!).outlineWidth,
            ) - 3,
          ) <=
            1 / devicePixelRatio &&
          Math.abs(
            Number.parseFloat(getComputedStyle(input).outlineWidth) - 2,
          ) <=
            1 / devicePixelRatio,
      ),
    );
    checks.push(
      assert(
        "Heading remains 54px while paragraph becomes 27px",
        getComputedStyle(heading).fontSize === "54px" &&
          getComputedStyle(prose).fontSize === "27px",
      ),
    );
    checks.push(
      assert(
        "Input values, code size and input size preserved",
        input.value === "Demo reader" &&
          getComputedStyle(input).fontSize === beforeInput &&
          getComputedStyle(code).fontSize === beforeCode,
      ),
    );
    checks.push(
      assert(
        "Warnings and editable content excluded",
        !fixture
          .querySelector('[role="alert"]')!
          .hasAttribute("data-ableverse-prose") &&
          !fixture
            .querySelector("[contenteditable]")!
            .hasAttribute("data-ableverse-prose"),
      ),
    );
    checks.push(
      assert(
        "SVG table contains exact source values and units",
        [...fixture.querySelectorAll("tbody tr")]
          .map((row) => row.textContent)
          .join("|") === "March30units|April55units",
      ),
    );
    checks.push(
      assert(
        "Patterns override inline CSS fill",
        getComputedStyle(
          fixture.querySelector("rect[data-av-value]")!,
        ).fill.startsWith("url("),
      ),
    );
    checks.push(
      assert(
        "Canvas reports unsupported without fabricated data",
        result.charts === 1 &&
          result.warnings.some((w) => w.includes("unsupported")),
      ),
    );
    engine.apply(profile);
    checks.push(
      assert(
        "Repeated Apply does not duplicate table",
        fixture.querySelectorAll("table").length === 1,
      ),
    );
    engine.restore();
    engine.restore();
    checks.push(
      assert(
        "Restore re-enables the original fixture animation",
        getComputedStyle(fixture.querySelector("#motion-sample")!)
          .animationName === "validation-pulse",
      ),
    );
    checks.push(
      assert(
        "Restore twice reproduces the original fixture exactly",
        fixture.innerHTML === original,
      ),
    );
    engine.apply(profile);
    input.value = "Edited by reader";
    fixture.querySelector("form")!.requestSubmit();
    checks.push(
      assert(
        "Adapted form remains editable and submits locally",
        input.value === "Edited by reader" &&
          fixture.querySelector("output")!.textContent === "Submitted locally",
      ),
    );
    const bar = fixture.querySelector<SVGRectElement>("rect[data-av-value]")!;
    bar.style.setProperty("fill", "orange");
    bar.style.setProperty("opacity", "0.8");
    prose.textContent = "Updated by the website";
    engine.restore();
    checks.push(
      assert(
        "Restore preserves newer website text and style changes",
        prose.textContent === "Updated by the website" &&
          bar.style.fill === "orange" &&
          bar.style.opacity === "0.8",
      ),
    );
    for (const palette of ["warm", "dark", "contrast"]) {
      engine.apply({ ...defaults, calm: palette });
      const style = getComputedStyle(prose);
      checks.push(
        assert(
          `${palette} prose colours have at least 4.5:1 contrast`,
          contrast(style.color, style.backgroundColor) >= 4.5,
        ),
      );
    }
    engine.restore();
    const narrowHeading = document.createElement("h2");
    narrowHeading.style.cssText = "width:240px;font-size:36px";
    narrowHeading.textContent = "Small changes, meaningful choices";
    fixture.querySelector("article")!.append(narrowHeading);
    engine.apply({
      ...defaults,
      reading: true,
      fontFamily: "Verdana",
      fontScale: 150,
      letterSpacing: 0.09,
      wordSpacing: 0.21,
    });
    checks.push(
      assert(
        "Enlarged Verdana heading wraps within a 240px column",
        narrowHeading.scrollWidth <= narrowHeading.clientWidth,
      ),
    );
    engine.restore();
    narrowHeading.remove();
    checks.push(...(await advancedChecks(fixture, assert)));
    status.textContent = `${checks.filter(Boolean).length}/${checks.length} browser checks passed. Fixture restored; native extension/audio checks are separate.`;
  } catch (error) {
    engine.restore();
    assert("Unexpected browser error: " + String(error), false);
    status.textContent = "A browser check failed. See results.";
  } finally {
    buttons.forEach((button) => (button.disabled = false));
  }
});
