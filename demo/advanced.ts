import { advancedFixture } from "./advanced-fixture";
const fixture = document.querySelector<HTMLDivElement>("#advanced-fixture")!;
const status = document.querySelector<HTMLParagraphElement>("#fixture-status")!;
fixture.innerHTML = advancedFixture;
document.querySelector("#change-line")!.addEventListener("click", () => {
  const svg = fixture.querySelector("#advanced-line")!;
  const metadata = svg.querySelector("metadata")!;
  const data = JSON.parse(metadata.textContent!);
  data.series[0].points[1].value = "27";
  metadata.textContent = JSON.stringify(data);
  svg
    .querySelector('[data-av-series="A"]')!
    .setAttribute("points", "70,160 310,24");
  svg.parentElement!.querySelector("figcaption")!.textContent =
    "Updated line source: A — Jan 10, Feb 27; B — Jan 8, Feb 12 units.";
  status.textContent =
    "Website changed line A February to 27. Check stale companion invalidation before applying again.";
});
document.querySelector("#remove-contract")!.addEventListener("click", () => {
  fixture.querySelector("#advanced-pie")!.removeAttribute("data-av-chart");
  status.textContent =
    "Website removed the pie contract. Its verified companion must disappear; the source drawing remains.";
});
document.querySelector("#new-prose")!.addEventListener("click", () => {
  const paragraph = document.createElement("p");
  paragraph.textContent =
    "New website prose: this paragraph needs another explicit Apply before it receives Reading changes.";
  fixture.querySelector("article")!.append(paragraph);
  status.textContent =
    "Website inserted new prose. Check that it is unchanged until you apply again.";
});
document.querySelector("#change-route")!.addEventListener("click", () => {
  const url = new URL(location.href);
  url.searchParams.set(
    "demo-route",
    String(Number(url.searchParams.get("demo-route") || 0) + 1),
  );
  history.pushState({}, "", url);
  status.textContent =
    "History-only route changed without a reload. Check extension restoration and speech cancellation.";
});
document
  .querySelector("#reset-fixture")!
  .addEventListener("click", () => location.reload());
