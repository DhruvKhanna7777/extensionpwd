import { defaults, validateSettings, type Settings } from "./settings";

const protectedContent =
  'input,textarea,select,button,a[href],form,code,pre,[contenteditable]:not([contenteditable="false"]),[aria-hidden="true"],[hidden],[role],[tabindex],nav,menu,audio,video,[data-ableverse-owned]';
const blocks = "p,li,h1,h2,h3,h4,h5,h6,blockquote";

export class HoverReader {
  private settings: Settings = { ...defaults };
  private target?: Element;
  private entryKey = "";
  private wordNode?: Node;
  private oldMarker: string | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  private playing = false;
  private style?: HTMLStyleElement;
  constructor(
    private doc: Document,
    private play: (text: string) => void,
    private stop: () => void,
    private error: (message: string) => void,
  ) {}

  private eligible(el: Element) {
    if (
      !el.isConnected ||
      !el.closest("article,main") ||
      el.closest(protectedContent) ||
      el.querySelector(protectedContent)
    )
      return false;
    const hidden = (node: Element) => {
      const css = this.doc.defaultView!.getComputedStyle(node);
      return (
        css.display === "none" ||
        ["hidden", "collapse"].includes(css.visibility) ||
        css.contentVisibility === "hidden"
      );
    };
    for (
      let ancestor: Element | null = el;
      ancestor;
      ancestor = ancestor.parentElement
    )
      if (hidden(ancestor)) return false;
    // Conservative: do not include hidden descendant text in an otherwise visible block.
    if ([...el.querySelectorAll("*")].some(hidden)) return false;
    return !!el.textContent?.trim();
  }
  private unmark() {
    if (this.target?.getAttribute("data-ableverse-hover") === "active") {
      if (this.oldMarker === null)
        this.target.removeAttribute("data-ableverse-hover");
      else this.target.setAttribute("data-ableverse-hover", this.oldMarker);
    }
  }
  // Cancel keeps the entry consumed: Stop/Escape cannot restart the same target.
  cancel() {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    this.unmark();
    if (this.playing) this.stop();
    this.playing = false;
  }
  private wordAt(el: Element, event: PointerEvent) {
    if (!this.doc.caretRangeFromPoint) return undefined;
    const range = this.doc.caretRangeFromPoint?.(event.clientX, event.clientY);
    if (
      range?.startContainer.nodeType === 3 &&
      el.contains(range.startContainer)
    ) {
      const text = range.startContainer.textContent || "";
      const at = range.startOffset;
      const before = text.slice(0, at).match(/[\p{L}\p{N}'’-]+$/u)?.[0] || "";
      const after = text.slice(at).match(/^[\p{L}\p{N}'’-]+/u)?.[0] || "";
      if (before || after)
        return {
          text: (before + after).slice(0, 500),
          start: at - before.length,
          node: range.startContainer,
        };
    }
    return { text: "", start: -1, node: el };
  }
  private text(el: Element, event: PointerEvent) {
    const full = (el.textContent || "").replace(/\s+/gu, " ").trim();
    if (this.settings.hoverScope === "word") {
      const entry = this.wordAt(el, event);
      if (entry) return entry.text;
    }
    if (this.settings.hoverScope === "sentence") {
      const segments = new Intl.Segmenter(
        this.doc.documentElement.lang || undefined,
        { granularity: "sentence" },
      ).segment(full);
      return (
        segments[Symbol.iterator]().next().value?.segment.trim() || full
      ).slice(0, 500);
    }
    return full.slice(0, 500);
  }
  private over = (event: PointerEvent) => {
    const element = event
      .composedPath()
      .find((node) => node instanceof Element) as Element | undefined;
    const next = element?.closest(blocks) || undefined;
    const word =
      next && this.settings.hoverScope === "word"
        ? this.wordAt(next, event)
        : undefined;
    const key = word ? `${word.start}:${word.text}` : "block";
    if (
      next === this.target &&
      key === this.entryKey &&
      word?.node === this.wordNode
    )
      return;
    this.cancel();
    this.target = next;
    this.entryKey = key;
    this.wordNode = word?.node;
    if (!next || !this.eligible(next)) return;
    if (word && !word.text) return;
    this.oldMarker = next.getAttribute("data-ableverse-hover");
    this.timer = setTimeout(() => {
      this.timer = undefined;
      if (this.doc.hidden || !this.eligible(next)) return;
      const text = this.text(next, event);
      if (!text || (word && word.text !== text)) return;
      next.setAttribute("data-ableverse-hover", "active");
      try {
        this.play(text);
        this.playing = true;
      } catch (error) {
        this.unmark();
        this.error(
          error instanceof Error
            ? error.message
            : "Speech is unavailable. Choose another voice.",
        );
      }
    }, this.settings.hoverDelay);
  };
  private out = (event: PointerEvent) => {
    if (
      this.target &&
      event.relatedTarget instanceof Node &&
      this.target.contains(event.relatedTarget)
    )
      return;
    this.cancel();
    this.target = undefined;
    this.wordNode = undefined;
    this.entryKey = "";
  };
  private key = (event: KeyboardEvent) => {
    if (event.key === "Escape") this.cancel();
  };
  private visibility = () => {
    if (this.doc.hidden) this.cancel();
  };
  configure(raw: Settings) {
    this.destroy();
    this.settings = validateSettings(raw);
    if (!this.settings.hoverSpeech) return;
    this.style = this.doc.createElement("style");
    this.style.setAttribute("data-ableverse-owned", "");
    this.style.textContent =
      '[data-ableverse-hover="active"]{outline:2px solid #087b78!important;outline-offset:3px!important;}';
    this.doc.head.append(this.style);
    this.doc.addEventListener("pointerover", this.over);
    if (this.settings.hoverScope === "word")
      this.doc.addEventListener("pointermove", this.over);
    this.doc.addEventListener("pointerout", this.out);
    this.doc.addEventListener("keydown", this.key);
    this.doc.addEventListener("visibilitychange", this.visibility);
  }
  destroy() {
    this.cancel();
    this.target = undefined;
    this.wordNode = undefined;
    this.entryKey = "";
    this.style?.remove();
    this.style = undefined;
    this.doc.removeEventListener("pointerover", this.over);
    this.doc.removeEventListener("pointermove", this.over);
    this.doc.removeEventListener("pointerout", this.out);
    this.doc.removeEventListener("keydown", this.key);
    this.doc.removeEventListener("visibilitychange", this.visibility);
  }
}
