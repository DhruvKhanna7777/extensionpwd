const protectedContent =
  'input,textarea,select,button,form,code,pre,[contenteditable]:not([contenteditable="false"]),[aria-hidden="true"],[hidden],[role],[tabindex],nav,menu,[data-ableverse-owned]';
const prose = "p,li,h1,h2,h3,h4,h5,h6";
type Capture = { token: string; text: string; canApply: boolean };
export class SelectionSession {
  private pending?: {
    range: Range;
    original: string;
    url: string;
    expires: number;
    capture: Capture;
  };
  private undo: (() => void)[] = [];
  constructor(private doc: Document) {}
  private hidden(el: Element) {
    const css = this.doc.defaultView!.getComputedStyle(el);
    return (
      css.display === "none" ||
      ["hidden", "collapse"].includes(css.visibility) ||
      css.contentVisibility === "hidden"
    );
  }
  get active() {
    return (
      this.undo.length > 0 ||
      (!!this.pending && Date.now() < this.pending.expires)
    );
  }
  discard(token?: unknown) {
    if (token === undefined || token === this.pending?.capture.token)
      this.pending = undefined;
  }
  capture(): Capture {
    this.pending = undefined;
    const selection = this.doc.defaultView?.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount !== 1)
      throw new Error("Select one passage of page text first.");
    const range = selection.getRangeAt(0).cloneRange(),
      original = range.toString();
    if (!original.trim() || original.length > 5000)
      throw new Error("Select between 1 and 5,000 characters.");
    const scope =
      range.commonAncestorContainer instanceof Element
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;
    if (!scope) throw new Error("Select page text first.");
    for (
      let parent: Element | null = scope;
      parent;
      parent = parent.parentElement
    )
      if (parent.matches(protectedContent) || this.hidden(parent))
        throw new Error("Selection includes protected or hidden content.");
    for (const el of scope.querySelectorAll("*"))
      if (
        range.intersectsNode(el) &&
        (el.matches(protectedContent) || this.hidden(el))
      )
        throw new Error("Selection includes protected or hidden content.");
    const start =
      range.startContainer instanceof Element
        ? range.startContainer
        : range.startContainer.parentElement;
    const end =
      range.endContainer instanceof Element
        ? range.endContainer
        : range.endContainer.parentElement;
    const root = start?.closest(prose);
    const canApply =
      !!root &&
      start === end &&
      root === end?.closest(prose) &&
      !!root.closest("main,article") &&
      !root.querySelector(`${protectedContent},a[href],${prose}`);
    const capture = {
      token: crypto.randomUUID(),
      text: original.trim(),
      canApply,
    };
    this.pending = {
      range,
      original,
      url: this.doc.defaultView!.location.href,
      expires: Date.now() + 5 * 60_000,
      capture,
    };
    return capture;
  }
  apply(token: unknown, text: unknown) {
    const item = this.pending;
    if (
      !item ||
      token !== item.capture.token ||
      Date.now() > item.expires ||
      item.url !== this.doc.defaultView!.location.href ||
      !item.range.commonAncestorContainer.isConnected ||
      item.range.toString() !== item.original
    )
      throw new Error(
        "The selected page text changed or expired. Capture it again.",
      );
    if (!item.capture.canApply)
      throw new Error(
        "Apply supports one safe prose block without links or controls. You can copy the suggestion instead.",
      );
    if (typeof text !== "string" || !text.trim() || text.length > 6000)
      throw new Error("Invalid simplification text.");
    // Revalidate protection at Apply time, including new controls inserted after capture.
    const root = (
      item.range.startContainer instanceof Element
        ? item.range.startContainer
        : item.range.startContainer.parentElement
    )?.closest(prose);
    if (
      !root ||
      root.querySelector(`${protectedContent},a[href],${prose}`) ||
      root.closest(protectedContent)
    )
      throw new Error("The selected page text changed. Capture it again.");
    const boundaryParent = (node: Node) =>
      node instanceof Element ? node : node.parentElement;
    if (
      boundaryParent(item.range.startContainer) !==
      boundaryParent(item.range.endContainer)
    )
      throw new Error(
        "Apply supports a safe, unsplit text range. Copy the suggestion instead.",
      );
    for (
      let parent: Element | null = root;
      parent;
      parent = parent.parentElement
    )
      if (this.hidden(parent))
        throw new Error("Selected text is now hidden. Capture it again.");
    if ([...root.querySelectorAll("*")].some((el) => this.hidden(el)))
      throw new Error(
        "Selected text contains hidden content. Capture it again.",
      );
    const fragment = item.range.extractContents();
    const replacement = this.doc.createElement("span");
    replacement.setAttribute("data-ableverse-owned", "");
    replacement.setAttribute("data-ableverse-ai", "");
    replacement.textContent = text;
    item.range.insertNode(replacement);
    const applied = replacement.outerHTML;
    this.undo.push(() => {
      if (!replacement.isConnected) return;
      if (replacement.outerHTML === applied) replacement.replaceWith(fragment);
      else {
        replacement.removeAttribute("data-ableverse-owned");
        replacement.removeAttribute("data-ableverse-ai");
      }
    });
    this.pending = undefined;
  }
  restore() {
    this.pending = undefined;
    for (const undo of this.undo.reverse()) undo();
    this.undo = [];
  }
}
