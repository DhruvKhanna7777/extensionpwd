// Controlled public demo data shared by the manual fixture and engine harness.
export const advancedFixture = `<main>
  <article><h1>Charts with declared source data</h1>
    <p id="advanced-prose" style="font-size:18px;margin-block-end:4px">This paragraph is safe prose for checking reading width, spacing and restoration. Controls and chart data remain separate.</p>
  </article>
  <figure><svg id="advanced-line" data-av-chart="line" data-av-unit="units" aria-label="Two declared series" viewBox="0 0 400 240">
    <title>Two declared series</title>
    <metadata data-av-source>{"series":[{"label":"A","points":[{"label":"Jan","value":"10"},{"label":"Feb","value":"20"}]},{"label":"B","points":[{"label":"Jan","value":"8"},{"label":"Feb","value":"12"}]}]}</metadata>
    <path d="M40 20V210H365" fill="none" stroke="#142339"/>
    <polyline data-av-series="A" points="70,160 310,80" fill="none" stroke="#c33" stroke-width="3"/>
    <polyline data-av-series="B" points="70,176 310,144" fill="none" stroke="#39814a" stroke-width="3"/>
    <text x="60" y="233">Jan</text><text x="300" y="233">Feb</text>
  </svg><figcaption>Line source: A — Jan 10, Feb 20; B — Jan 8, Feb 12 units.</figcaption></figure>
  <figure><svg id="advanced-pie" data-av-chart="pie" data-av-unit="%" aria-label="Declared budget shares" viewBox="0 0 100 100">
    <title>Declared budget shares</title>
    <metadata data-av-source>{"slices":[{"label":"Books","value":"25"},{"label":"Travel","value":"75"}]}</metadata>
    <path data-av-slice="Books" d="M50 50L50 10A40 40 0 0 1 90 50Z" fill="#c33"/>
    <path data-av-slice="Travel" d="M50 50L90 50A40 40 0 1 1 50 10Z" fill="#39814a"/>
  </svg><figcaption>Pie source: Books 25%, Travel 75%. Total 100%.</figcaption></figure>
  <figure><svg id="advanced-invalid" data-av-chart="pie" data-av-unit="%" aria-label="Invalid percentage control" viewBox="0 0 100 100">
    <title>Invalid percentage control</title>
    <metadata data-av-source>{"slices":[{"label":"Books","value":"20"},{"label":"Travel","value":"30"}]}</metadata>
    <path data-av-slice="Books" d="M50 50L50 10A40 40 0 0 1 90 50Z" fill="#888"/>
    <path data-av-slice="Travel" d="M50 50L90 50A40 40 0 1 1 50 10Z" fill="#bbb"/>
  </svg><figcaption>Invalid negative control: declared percentages total 50. Extension must leave it untouched and explain why.</figcaption></figure>
</main>`;
