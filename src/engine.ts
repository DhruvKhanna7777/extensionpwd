import { type Settings, validateSettings } from "./settings";
import { enhanceCharts } from "./charts";
const protectedSelector =
  'input,textarea,select,button,code,pre,[contenteditable]:not([contenteditable="false"]),[role="alert"],[role="status"],[aria-hidden="true"],nav,menu,[data-ableverse-owned]';
export class PageEngine {
  private undo: (() => void)[] = [];
  constructor(private doc: Document) {}
  private mark(el: Element, name: string, value = "") {
    const old = el.getAttribute(name);
    el.setAttribute(name, value);
    this.undo.push(() => {
      if (el.getAttribute(name) !== value) return;
      old === null ? el.removeAttribute(name) : el.setAttribute(name, old);
    });
  }
  apply(raw: Settings) {
    this.restore();
    const s = validateSettings(raw);
    const rules: string[] = [];
    if (s.reading || s.calm !== "default") {
      for (const el of this.doc.querySelectorAll(
        "article p,article h1,article h2,article h3,article li,main p,main h1,main h2,main h3,main li",
      )) {
        // Leaf prose prevents relative em sizes compounding through nested lists.
        if (
          !el.closest(protectedSelector) &&
          !el.querySelector(protectedSelector) &&
          !el.querySelector("p,h1,h2,h3,li")
        )
          this.mark(el, "data-ableverse-prose");
      }
      const prose = "[data-ableverse-prose]";
      if (s.reading)
        rules.push(
          `${prose}{font-family:${s.fontFamily}!important;font-size:${s.fontScale / 100}em!important;line-height:${s.lineHeight}!important;letter-spacing:${s.letterSpacing}em!important;word-spacing:${s.wordSpacing}em!important;}`,
        );
      const palettes: Record<string, string> = {
        warm: "color:#302719!important;background:#fff4dd!important",
        dark: "color:#f7f9fc!important;background:#142339!important",
        contrast: "color:#fff!important;background:#000!important",
      };
      if (palettes[s.calm])
        rules.push(
          `${prose}{${palettes[s.calm]}}${prose} a{color:inherit!important;text-decoration:underline!important}`,
        );
    }
    if (s.motion)
      rules.push(
        'body *:not([role="progressbar"]):not([role="status"]):not([role="progressbar"] *):not([role="status"] *){animation:none!important;transition:none!important;scroll-behavior:auto!important;}',
      );
    if (s.emphasis)
      rules.push(
        "a[href],button,input,select,textarea{outline:2px solid #3069cf!important;outline-offset:2px!important;}a[href]{text-decoration:underline!important;}",
      );
    if (s.focus) {
      const root =
        this.doc.querySelector("article") || this.doc.querySelector("main");
      if (root) {
        this.mark(root, "data-ableverse-focus");
        rules.push(
          "[data-ableverse-focus]{outline:3px solid #087b78!important;outline-offset:6px!important;}",
        );
      }
    }
    if (rules.length) {
      const style = this.doc.createElement("style");
      style.setAttribute("data-ableverse-owned", "");
      style.textContent = rules.join("\n");
      this.doc.head.append(style);
      this.undo.push(() => style.remove());
    }
    return s.chroma
      ? enhanceCharts(this.doc, this.undo)
      : { charts: 0, warnings: [] as string[] };
  }
  restore() {
    for (const undo of this.undo.reverse()) undo();
    this.undo = [];
  }
}
