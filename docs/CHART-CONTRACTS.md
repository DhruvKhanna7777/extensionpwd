# Supported SVG chart contracts

Enable Charts explicitly. Tables and summaries use declared metadata, never chart pixels or colours. These contracts are intentionally narrow; malformed/grouped/transformed data remains unchanged. A site supplying metadata is responsible for its correspondence to the depicted source geometry. This extension validates the contract, not the truth of an external dataset.

## Bars

```html
<svg data-av-chart="bar" data-av-unit="units" aria-label="Monthly results">
  <rect x="30" y="80" width="40" height="60" fill="red"
        data-av-label="March" data-av-value="30" />
</svg>
```

Bars require direct-child rects, explicit labels/finite values and valid geometry. Labels and patterns are independently optional; the accessible exact table remains. Highest/lowest summaries are grounded in those values, without AI interpretation.

## Lines

```html
<svg data-av-chart="line" data-av-unit="units" aria-label="Two series">
  <metadata data-av-source>{"series":[{"label":"A","points":[{"label":"Jan","value":"10"},{"label":"Feb","value":"20"}]},{"label":"B","points":[{"label":"Jan","value":"8"},{"label":"Feb","value":"12"}]}]}</metadata>
  <polyline data-av-series="A" points="10,40 60,20" fill="none" stroke="red" />
  <polyline data-av-series="B" points="10,45 60,35" fill="none" stroke="red" />
</svg>
```

Use one direct `metadata[data-av-source]` JSON source, 1-6 uniquely labelled series and one matching direct polyline per series. Each has 1-200 labelled finite values, a corresponding finite coordinate pair for every point, and at most 500 total points. Metadata is bounded to 64,000 characters. No transforms/grouped geometry. Dashes and geometric markers differentiate series when enabled; optional point labels and a series/category/value/unit table expose exact declared data. The summary reports first/last values, not an inferred universal trend.

## Pies

```html
<svg data-av-chart="pie" data-av-unit="%" aria-label="Budget">
  <metadata data-av-source>{"slices":[{"label":"Books","value":"25"},{"label":"Travel","value":"75"}]}</metadata>
  <path data-av-slice="Books" d="M50 50L50 10A40 40 0 0 1 90 50Z" fill="red" />
  <path data-av-slice="Travel" d="M50 50L90 50A40 40 0 1 1 50 10Z" fill="green" />
</svg>
```

Up to eight nonnegative labelled slices, unique labels, positive finite total and one matching direct path per slice. Path syntax must parse, be bounded, use finite coordinates/nonnegative arc radii, contain drawing commands and end closed. Declared `%`/`percent`/`percentage` values must total 100 within 0.01. Other declared units produce shares calculated from their positive total; shares round to two decimal places and may not sum to exactly 100 after rounding. Slice geometry is never reverse-engineered to invent values.

Patterns and visible category/share legends are optional; the table remains. Missing units are explicitly unspecified. Restore conditionally removes owned changes and preserves newer site styles. Changes to source metadata, contract, geometry/style/class or removal invalidate companions; explicitly Apply again after a supported change. Use **Open verified data table** to focus the current generated table.
