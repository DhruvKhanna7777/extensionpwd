import { type Settings, validateSettings } from "./settings";
import { enhanceCharts } from "./charts";
import { createRuler } from "./ruler";
const protectedSelector =
  'input,textarea,select,button,code,pre,form,[contenteditable]:not([contenteditable="false"]),[role="alert"],[role="status"],[role="button"],[role="textbox"],[role="combobox"],[role="slider"],[role="spinbutton"],[role="switch"],[role="checkbox"],[role="radio"],[role="tab"],[role="menuitem"],[role="treeitem"],[role="option"],[role="dialog"],[role="alertdialog"],[tabindex],[aria-hidden="true"],nav,menu,[data-ableverse-owned]';
export class PageEngine {
  private undo: (() => void)[] = [];
  constructor(
    private doc: Document,
    private rulerDisabled: () => void = () => {},
  ) {}
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
    let hidden = 0;
    if (s.distractions) {
      const essential =
        protectedSelector +
        ',a[href],form,[role="dialog"],[role="alertdialog"],[role="button"],[role="textbox"],[role="combobox"],[role="menu"],[role="navigation"],[tabindex],audio[controls],video[controls]';
      for (const el of this.doc.querySelectorAll("[data-av-distractor]"))
        if (!el.closest(essential) && !el.querySelector(essential)) {
          this.mark(el, "data-ableverse-hidden");
          hidden++;
        }
      if (hidden)
        rules.push("[data-ableverse-hidden]{display:none!important;}");
    }
    if (s.reading || s.calm !== "default") {
      const originalSizes = new Set<number>();
      for (const el of this.doc.querySelectorAll(
        "article :is(p,h1,h2,h3,h4,h5,h6,li),main :is(p,h1,h2,h3,h4,h5,h6,li)",
      )) {
        // Leaf prose prevents relative em sizes compounding through nested lists.
        if (
          !el.closest(protectedSelector) &&
          !el.querySelector(protectedSelector) &&
          !el.querySelector("p,h1,h2,h3,h4,h5,h6,li")
        ) {
          const computed = Number.parseFloat(
            this.doc.defaultView?.getComputedStyle(el).fontSize || "",
          );
          const original =
            Number.isFinite(computed) && computed > 0 ? computed : 16;
          originalSizes.add(original);
          this.mark(el, "data-ableverse-prose", String(original));
        }
      }
      const prose = "[data-ableverse-prose]";
      if (s.reading) {
        rules.push(
          `${prose}{font-family:${s.fontFamily}!important;line-height:${s.lineHeight}!important;letter-spacing:${s.letterSpacing}em!important;word-spacing:${s.wordSpacing}em!important;overflow-wrap:anywhere!important;}`,
        );
        if (s.readingWidth)
          rules.push(
            `${prose}{max-inline-size:${s.readingWidth}ch!important;}`,
          );
        if (s.paragraphSpacing)
          rules.push(
            `p${prose}{margin-block-end:${s.paragraphSpacing}em!important;}`,
          );
        if (s.textAlign !== "original")
          rules.push(`${prose}{text-align:${s.textAlign}!important;}`);
        for (const size of originalSizes)
          rules.push(
            `[data-ableverse-prose="${size}"]{font-size:${(size * s.fontScale) / 100}px!important;}`,
          );
      }
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
    if (s.ruler) this.undo.push(createRuler(this.doc, this.rulerDisabled));
    return {
      hidden,
      ...(s.chroma
        ? enhanceCharts(this.doc, this.undo)
        : { charts: 0, warnings: [] as string[] }),
    };
  }
  restore() {
    for (const undo of this.undo.reverse()) undo();
    this.undo = [];
  }
}
