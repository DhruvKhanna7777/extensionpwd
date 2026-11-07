import { PageEngine } from "../src/engine";
import { defaults } from "../src/settings";
import { advancedFixture } from "./advanced-fixture";

export async function advancedChecks(
  fixture: HTMLElement,
  check: (name: string, condition: boolean) => boolean,
) {
  const previous = fixture.innerHTML;
  fixture.innerHTML = advancedFixture;
  let rulerDisabled = 0;
  const engine = new PageEngine(document, () => rulerDisabled++);
  const checks: boolean[] = [];
  const original = fixture.innerHTML;
  const line = fixture.querySelector<SVGSVGElement>("#advanced-line")!;
  const pie = fixture.querySelector<SVGSVGElement>("#advanced-pie")!;
  const rows = (svg: Element) =>
    [...(svg.nextElementSibling?.querySelectorAll("tbody tr") || [])].map(
      (row) => row.textContent,
    );
  try {
    const result = engine.apply({ ...defaults, chroma: true });
    checks.push(
      check(
        "Line and pie contracts enhance; invalid percentage control is rejected",
        result.charts === 2 && result.warnings.length === 1,
      ),
    );
    checks.push(
      check(
        "Line table keeps all four exact series/category/value/unit rows",
        JSON.stringify(rows(line)) ===
          JSON.stringify([
            "AJan10units",
            "AFeb20units",
            "BJan8units",
            "BFeb12units",
          ]),
      ),
    );
    const lines = line.querySelectorAll("polyline");
    checks.push(
      check(
        "Line series have distinct rendered dashes and four owned geometric markers",
        getComputedStyle(lines[0]).strokeDasharray !==
          getComputedStyle(lines[1]).strokeDasharray &&
          line.querySelectorAll(
            "[data-ableverse-owned] circle,[data-ableverse-owned] rect",
          ).length === 4,
      ),
    );
    checks.push(
      check(
        "Pie table preserves 25/75 percent source values and computed shares",
        JSON.stringify(rows(pie)) ===
          JSON.stringify(["Books25%25%", "Travel75%75%"]),
      ),
    );
    checks.push(
      check(
        "Pie slices use distinct rendered pattern fills",
        getComputedStyle(pie.querySelectorAll("path")[0]).fill !==
          getComputedStyle(pie.querySelectorAll("path")[1]).fill &&
          getComputedStyle(pie.querySelector("path")!).fill.includes("url("),
      ),
    );
    engine.apply({ ...defaults, chroma: true });
    checks.push(
      check(
        "Repeated line/pie Apply keeps exactly two companion tables",
        fixture.querySelectorAll("table").length === 2,
      ),
    );
    engine.apply({
      ...defaults,
      chroma: true,
      chartLabels: false,
      chartPatterns: false,
      chartMarkers: false,
    });
    checks.push(
      check(
        "Disabling visual encodings retains exact tables and removes added markers/patterns",
        fixture.querySelectorAll("table").length === 2 &&
          !fixture.querySelector(
            "[data-ableverse-owned] circle,[data-ableverse-owned] pattern",
          ) &&
          !line.querySelector("polyline")!.hasAttribute("style"),
      ),
    );
    engine.restore();
    engine.restore();
    checks.push(
      check(
        "Line/pie double Restore reproduces original fixture markup",
        fixture.innerHTML === original,
      ),
    );
    engine.apply({
      ...defaults,
      reading: true,
      readingWidth: 60,
      paragraphSpacing: 1.5,
      textAlign: "left",
      ruler: true,
    });
    const prose = fixture.querySelector("#advanced-prose")!;
    const css = getComputedStyle(prose);
    checks.push(
      check(
        "Reading applies bounded width, 27px paragraph spacing and left alignment",
        css.maxInlineSize !== "none" &&
          css.marginBlockEnd === "27px" &&
          css.textAlign === "left",
      ),
    );
    const ruler = document.querySelector<HTMLElement>(
      "[data-ableverse-ruler]",
    )!;
    document.dispatchEvent(new PointerEvent("pointermove", { clientY: 120 }));
    checks.push(
      check(
        "Reading ruler follows the pointer without intercepting clicks",
        getComputedStyle(ruler).pointerEvents === "none" &&
          ruler.style.top === "96px",
      ),
    );
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    checks.push(
      check(
        "Escape removes the ruler and reports its disabled state",
        !document.querySelector("[data-ableverse-ruler]") &&
          rulerDisabled === 1,
      ),
    );
    engine.restore();
    for (const family of ["Lexend", "Atkinson Hyperlegible", "OpenDyslexic"]) {
      engine.apply({ ...defaults, reading: true, fontFamily: family });
      const faces = await document.fonts.load(`18px "${family}"`);
      checks.push(
        check(
          `${family} loads from the bundled local font asset`,
          faces.length > 0 &&
            faces.every((face) => face.status === "loaded") &&
            getComputedStyle(prose).fontFamily.includes(family),
        ),
      );
      engine.restore();
    }
    checks.push(
      check(
        "New reading tools restore original markup and remove owned guides",
        fixture.innerHTML === original &&
          !document.querySelector("[data-ableverse-ruler]"),
      ),
    );
    return checks;
  } finally {
    engine.restore();
    fixture.innerHTML = previous;
  }
}
