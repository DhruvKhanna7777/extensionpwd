// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import { PageEngine } from "../src/engine";
import { defaults } from "../src/settings";
const line = () =>
  `<svg data-av-chart="line" data-av-unit="units" aria-label="Two series"><metadata data-av-source>${JSON.stringify(
    {
      series: [
        {
          label: "A",
          points: [
            { label: "Jan", value: "10" },
            { label: "Feb", value: "20" },
          ],
        },
        {
          label: "B",
          points: [
            { label: "Jan", value: "8" },
            { label: "Feb", value: "12" },
          ],
        },
      ],
    },
  )}</metadata><polyline data-av-series="A" points="10,40 60,20" fill="none" stroke="red"/><polyline data-av-series="B" points="10,45 60,35" fill="none" stroke="red"/></svg>`;
const pie = (a = "25", b = "75", unit = "%") =>
  `<svg data-av-chart="pie" data-av-unit="${unit}" aria-label="Budget"><metadata data-av-source>${JSON.stringify(
    {
      slices: [
        { label: "Books", value: a },
        { label: "Travel", value: b },
      ],
    },
  )}</metadata><path data-av-slice="Books" d="M50 50L50 10A40 40 0 0 1 90 50Z" fill="red"/><path data-av-slice="Travel" d="M50 50L90 50A40 40 0 1 1 50 10Z" fill="green"/></svg>`;
beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});
it("keeps line markers optional and retains an exact table when visual encodings are disabled", () => {
  document.body.innerHTML = line();
  const engine = new PageEngine(document);
  engine.apply({
    ...defaults,
    chroma: true,
    chartMarkers: false,
    chartPatterns: false,
    chartLabels: false,
  });
  expect(document.querySelector("[data-ableverse-owned] circle")).toBeNull();
  expect(document.querySelector("polyline")?.getAttribute("style")).toBeNull();
  expect(document.querySelectorAll("tbody tr").length).toBe(4);
});
it("adds differentiated line dashes/markers, exact series data and restores original markup", () => {
  document.body.innerHTML = line();
  const before = document.body.innerHTML;
  const engine = new PageEngine(document);
  const result = engine.apply({ ...defaults, chroma: true });
  expect(result.charts).toBe(1);
  expect(
    [...document.querySelectorAll("tbody tr")].map((e) => e.textContent),
  ).toEqual(["AJan10units", "AFeb20units", "BJan8units", "BFeb12units"]);
  const lines = document.querySelectorAll<SVGPolylineElement>("polyline");
  expect(lines[0].style.strokeDasharray).not.toBe(
    lines[1].style.strokeDasharray,
  );
  expect(
    document.querySelectorAll(
      "[data-ableverse-owned] circle,[data-ableverse-owned] rect",
    ).length,
  ).toBe(4);
  expect(document.querySelector("th[scope=col]")?.textContent).toBe("Series");
  expect(document.body.textContent).toContain("A: Jan 10 → Feb 20 units");
  engine.apply({ ...defaults, chroma: true });
  expect(document.querySelectorAll("table").length).toBe(1);
  engine.restore();
  expect(document.body.innerHTML).toBe(before);
});
it("provides pie category/percentage labels and a table using declared values", () => {
  document.body.innerHTML = pie();
  const engine = new PageEngine(document);
  expect(engine.apply({ ...defaults, chroma: true }).charts).toBe(1);
  expect(
    [...document.querySelectorAll("tbody tr")].map((e) => e.textContent),
  ).toEqual(["Books25%25%", "Travel75%75%"]);
  expect(document.body.textContent).toContain("Books: 25%");
  const slice = document.querySelector<SVGPathElement>("path")!;
  slice.style.fill = "purple";
  engine.restore();
  expect(slice.style.fill).toBe("purple");
});
it.each([
  () => pie().replace('d="M50 50L50 10A40 40 0 0 1 90 50Z"', 'd="garbage"'),
  () => pie().replace('d="M50 50L50 10A40 40 0 0 1 90 50Z"', 'd="M1 2L3"'),
  () => pie("20", "30"),
  () => pie("-2", "102"),
  () => pie("0", "0", "units"),
  () => line().replace('points="10,40 60,20"', 'points="10,40"'),
  () => line().replace('data-av-series="B"', 'data-av-series="A"'),
  () => line().replace("<polyline", '<polyline transform="translate(1,1)"'),
  () => line().replace('"10"', '"NaN"'),
])(
  "rejects inconsistent, incomplete and transformed charts atomically",
  (make) => {
    document.body.innerHTML = make();
    const before = document.body.innerHTML;
    const result = new PageEngine(document).apply({
      ...defaults,
      chroma: true,
    });
    expect(result.charts).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(document.body.innerHTML).toBe(before);
  },
);
