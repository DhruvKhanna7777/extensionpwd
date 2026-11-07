import { parseSVG } from "svg-path-parser";
const ns = "http://www.w3.org/2000/svg";
let sequence = 0;
type Row = { label: string; raw: string; value: number };
type Series = {
  label: string;
  points: Row[];
  element: SVGPolylineElement;
  coordinates: number[];
};
const dash = ["none", "8 4", "2 4", "10 3 2 3", "12 5", "4 3 1 3"];
const marker = ["circle", "square", "triangle", "circle", "square", "triangle"];
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Missing data object.");
  return value as Record<string, unknown>;
}
function label(value: unknown) {
  if (typeof value !== "string" || !value.trim() || value.length > 256)
    throw new Error("Missing category or series label.");
  return value.trim();
}
function rows(value: unknown): Row[] {
  if (!Array.isArray(value) || !value.length || value.length > 200)
    throw new Error("Expected 1–200 declared values.");
  const result = value.map((item) => {
    const row = record(item);
    if (!["number", "string"].includes(typeof row.value))
      throw new Error("Invalid value.");
    const raw = String(row.value).trim();
    if (
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw) ||
      !Number.isFinite(Number(raw))
    )
      throw new Error("Invalid numeric source value.");
    return { label: label(row.label), raw, value: Number(raw) };
  });
  if (new Set(result.map((r) => r.label)).size !== result.length)
    throw new Error("Duplicate category label.");
  return result;
}
function transformed(el: SVGElement) {
  const transform =
    el.ownerDocument.defaultView?.getComputedStyle(el).transform;
  return el.hasAttribute("transform") || (!!transform && transform !== "none");
}
function ownedStyle(
  el: SVGElement,
  property: string,
  value: string,
  undo: (() => void)[],
) {
  const original = el.getAttribute("style");
  const old = el.style.getPropertyValue(property),
    priority = el.style.getPropertyPriority(property);
  el.style.setProperty(property, value, "important");
  const applied = el.getAttribute("style");
  undo.push(() => {
    if (el.getAttribute("style") === applied) {
      if (original === null) el.removeAttribute("style");
      else el.setAttribute("style", original);
    } else if (
      el.style.getPropertyValue(property) === value &&
      el.style.getPropertyPriority(property) === "important"
    ) {
      if (old) el.style.setProperty(property, old, priority);
      else el.style.removeProperty(property);
    }
  });
}
function svgElement(
  doc: Document,
  tag: string,
  attributes: Record<string, string>,
) {
  const el = doc.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attributes))
    el.setAttribute(key, value);
  return el;
}
function pattern(doc: Document, group: Element, index: number) {
  const id = `ableverse-slice-${++sequence}`;
  const p = svgElement(doc, "pattern", {
    id,
    width: "8",
    height: "8",
    patternUnits: "userSpaceOnUse",
  });
  p.append(svgElement(doc, "rect", { width: "8", height: "8", fill: "#fff" }));
  const shapes = [
    "M0 8L8 0",
    "M0 0L8 8",
    "M0 4H8",
    "M4 0V8",
    "M0 4H8M4 0V8",
    "M0 8L8 0M0 0L8 8",
    "M0 2H8M0 6H8",
    "M2 0V8M6 0V8",
  ];
  p.append(
    svgElement(doc, "path", {
      d: shapes[index],
      stroke: "#142339",
      "stroke-width": "1.5",
    }),
  );
  group.append(p);
  return `url(#${id})`;
}

export function enhanceStructuredCharts(doc: Document, undo: (() => void)[]) {
  let charts = 0;
  const warnings: string[] = [];
  for (const svg of doc.querySelectorAll<SVGSVGElement>(
    'svg[data-av-chart="line"],svg[data-av-chart="pie"]',
  )) {
    const checkpoint = undo.length;
    try {
      if (transformed(svg)) throw new Error("Transformed SVG is unsupported.");
      const source = svg.querySelectorAll("metadata[data-av-source]");
      if (
        source.length !== 1 ||
        source[0].parentNode !== svg ||
        (source[0].textContent?.length || 0) > 64000
      )
        throw new Error("Expected one bounded direct metadata source.");
      const data = record(JSON.parse(source[0].textContent || ""));
      const unit = svg.getAttribute("data-av-unit")?.trim() || "Not specified";
      const type = svg.getAttribute("data-av-chart");
      let series: Series[] = [];
      let slices: Row[] = [],
        sliceElements: SVGPathElement[] = [],
        total = 0;
      if (type === "line") {
        if (
          !Array.isArray(data.series) ||
          data.series.length < 1 ||
          data.series.length > 6
        )
          throw new Error("Expected 1–6 series.");
        const lines = [
          ...svg.querySelectorAll<SVGPolylineElement>(
            "polyline[data-av-series]",
          ),
        ];
        if (lines.length !== data.series.length)
          throw new Error("Series and geometry counts differ.");
        series = data.series.map((item) => {
          const s = record(item),
            name = label(s.label),
            points = rows(s.points);
          const matches = lines.filter(
            (el) => el.getAttribute("data-av-series") === name,
          );
          if (matches.length !== 1)
            throw new Error("Missing or duplicate series geometry.");
          const element = matches[0];
          if (element.parentNode !== svg || transformed(element))
            throw new Error("Grouped/transformed lines are unsupported.");
          const raw = element.getAttribute("points")?.trim() || "";
          if (!raw || /(^,|,$|,\s*,)/.test(raw))
            throw new Error("Invalid point geometry.");
          const coordinates = raw.split(/[\s,]+/).map((token) => {
            if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(token))
              throw new Error("Invalid coordinate.");
            return Number(token);
          });
          if (
            coordinates.length !== points.length * 2 ||
            !coordinates.every(Number.isFinite)
          )
            throw new Error("Points and values differ.");
          return { label: name, points, element, coordinates };
        });
        if (
          new Set(series.map((s) => s.label)).size !== series.length ||
          series.reduce((n, s) => n + s.points.length, 0) > 500
        )
          throw new Error("Duplicate series or too many points.");
      } else {
        slices = rows(data.slices);
        if (slices.length > 8 || slices.some((r) => r.value < 0))
          throw new Error("Expected up to 8 nonnegative slices.");
        total = slices.reduce((n, r) => n + r.value, 0);
        if (!Number.isFinite(total) || total <= 0)
          throw new Error("Pie total must be positive.");
        if (
          ["%", "percent", "percentage"].includes(unit.toLowerCase()) &&
          Math.abs(total - 100) > 0.01
        )
          throw new Error("Declared percentages do not sum to 100.");
        const paths = [
          ...svg.querySelectorAll<SVGPathElement>("path[data-av-slice]"),
        ];
        if (paths.length !== slices.length)
          throw new Error("Slice and geometry counts differ.");
        sliceElements = slices.map((row) => {
          const matches = paths.filter(
            (el) => el.getAttribute("data-av-slice") === row.label,
          );
          if (
            matches.length !== 1 ||
            matches[0].parentNode !== svg ||
            transformed(matches[0]) ||
            !matches[0].getAttribute("d")?.trim()
          )
            throw new Error("Missing, grouped or transformed slice.");
          const geometry = matches[0].getAttribute("d")!;
          if (geometry.length > 16000)
            throw new Error("Slice path is too large.");
          const commands = parseSVG(geometry);
          if (
            commands.length < 3 ||
            commands.length > 2000 ||
            commands.at(-1)?.code.toUpperCase() !== "Z" ||
            !commands.some(
              (command) => !["M", "Z"].includes(command.code.toUpperCase()),
            ) ||
            commands.some((command) =>
              Object.values(command).some(
                (value) => typeof value === "number" && !Number.isFinite(value),
              ),
            ) ||
            commands.some(
              (command) =>
                "rx" in command && (command.rx < 0 || command.ry < 0),
            )
          )
            throw new Error("Slice path must contain finite, closed geometry.");
          return matches[0];
        });
      }
      // Every source row and geometry is validated before the first mutation.
      const group = svgElement(doc, "g", {
        "data-ableverse-owned": "",
        "pointer-events": "none",
      });
      const companion = doc.createElement("section");
      companion.setAttribute("data-ableverse-owned", "");
      companion.style.cssText =
        "max-width:100%;overflow-x:auto;color:#142339;background:white;font:16px/1.6 system-ui;padding:12px;margin:16px 0;";
      const table = doc.createElement("table");
      table.style.cssText = "border-collapse:collapse;width:100%;";
      table.createCaption().textContent =
        (svg.getAttribute("aria-label") || "Chart") + " — verified source data";
      const head = table.createTHead().insertRow();
      for (const text of type === "line"
        ? ["Series", "Category", "Value", "Unit"]
        : ["Category", "Value", "Unit", "Share"]) {
        const cell = doc.createElement("th");
        cell.scope = "col";
        cell.textContent = text;
        head.append(cell);
      }
      const body = table.createTBody();
      const row = (values: string[]) => {
        const tr = body.insertRow();
        values.forEach((value, index) => {
          const cell = doc.createElement(index === 0 ? "th" : "td");
          if (index === 0) (cell as HTMLTableCellElement).scope = "row";
          cell.textContent = value;
          tr.append(cell);
        });
      };
      const legend = doc.createElement("ul"),
        summary = doc.createElement("p");
      const summaries: string[] = [];
      undo.push(() => {
        group.remove();
        companion.remove();
      });
      if (type === "line")
        series.forEach((s, index) => {
          ownedStyle(s.element, "stroke-dasharray", dash[index], undo);
          ownedStyle(s.element, "stroke", "#142339", undo);
          ownedStyle(s.element, "stroke-width", "2.5px", undo);
          s.points.forEach((p, i) => {
            const x = s.coordinates[2 * i],
              y = s.coordinates[2 * i + 1];
            const mark =
              index % 3 === 0
                ? svgElement(doc, "circle", {
                    cx: String(x),
                    cy: String(y),
                    r: "4",
                  })
                : index % 3 === 1
                  ? svgElement(doc, "rect", {
                      x: String(x - 4),
                      y: String(y - 4),
                      width: "8",
                      height: "8",
                    })
                  : svgElement(doc, "path", {
                      d: `M${x} ${y - 5}L${x + 5} ${y + 4}L${x - 5} ${y + 4}Z`,
                    });
            mark.setAttribute("fill", "white");
            mark.setAttribute("stroke", "#142339");
            mark.setAttribute("stroke-width", "2");
            group.append(mark);
            row([s.label, p.label, p.raw, unit]);
          });
          const li = doc.createElement("li");
          li.textContent = `${s.label}: ${index === 0 ? "solid" : `dash ${dash[index]}`} line, ${marker[index]} markers`;
          legend.append(li);
          const first = s.points[0],
            last = s.points[s.points.length - 1];
          summaries.push(
            `${s.label}: ${first.label} ${first.raw} → ${last.label} ${last.raw} ${unit}`,
          );
        });
      else {
        const defs = svgElement(doc, "defs", {});
        group.append(defs);
        slices.forEach((r, index) => {
          ownedStyle(
            sliceElements[index],
            "fill",
            pattern(doc, defs, index),
            undo,
          );
          const share = `${Number(((r.value / total) * 100).toFixed(2))}%`;
          row([r.label, r.raw, unit, share]);
          const li = doc.createElement("li");
          li.textContent = `${r.label}: ${share} (${r.raw} ${unit})`;
          legend.append(li);
        });
        summaries.push(
          `Shares calculated from declared values; total ${total} ${unit}. Percentages rounded to two decimal places.`,
        );
      }
      summary.textContent = summaries.join(". ");
      for (const cell of table.querySelectorAll<HTMLElement>("th,td"))
        cell.style.cssText =
          "border:1px solid #6a7f94;padding:8px;text-align:start;overflow-wrap:anywhere;";
      companion.append(legend, summary, table);
      svg.append(group);
      svg.after(companion);
      charts++;
    } catch (error) {
      const rollback = undo.splice(checkpoint);
      for (const fn of rollback.reverse()) fn();
      warnings.push(
        `Chart cannot be enhanced reliably: ${error instanceof Error ? error.message : "Invalid source data."}`,
      );
    }
  }
  return { charts, warnings };
}
