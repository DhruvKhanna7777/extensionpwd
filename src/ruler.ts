// An owned guide only: never captures pointer input or dims essential page content.
export function createRuler(doc: Document, disabled: () => void) {
  const view = doc.defaultView!;
  const el = doc.createElement("div");
  el.setAttribute("data-ableverse-owned", "");
  el.setAttribute("data-ableverse-ruler", "");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;left:0;right:0;height:48px;pointer-events:none;z-index:2147483646;border-block:2px solid #087b78;background:rgba(8,123,120,0.06);box-sizing:border-box;";
  let y = view.innerHeight / 2;
  const move = (next: number) => {
    y = Math.max(24, Math.min(Math.max(24, view.innerHeight - 24), next));
    el.style.top = `${y - 24}px`;
  };
  const pointer = (e: PointerEvent) => move(e.clientY);
  const focus = (e: FocusEvent) => {
    if (
      e.target instanceof Element &&
      !e.target.closest("[data-ableverse-owned]")
    ) {
      const box = e.target.getBoundingClientRect();
      move(box.top + box.height / 2);
    }
  };
  const stop = () => {
    dispose();
    disabled();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Escape") stop();
    else if (
      e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      ["ArrowUp", "ArrowDown"].includes(e.key) &&
      !(
        e.target instanceof Element &&
        e.target.closest(
          'input,textarea,select,[contenteditable]:not([contenteditable="false"])',
        )
      )
    ) {
      e.preventDefault();
      move(y + (e.key === "ArrowDown" ? 24 : -24));
    }
  };
  const visibility = () => {
    if (doc.hidden) stop();
  };
  const resize = () => move(y);
  let active = true;
  const dispose = () => {
    if (!active) return;
    active = false;
    el.remove();
    doc.removeEventListener("pointermove", pointer);
    doc.removeEventListener("focusin", focus);
    doc.removeEventListener("keydown", key);
    doc.removeEventListener("visibilitychange", visibility);
    view.removeEventListener("resize", resize);
  };
  move(y);
  doc.documentElement.append(el);
  doc.addEventListener("pointermove", pointer);
  doc.addEventListener("focusin", focus);
  doc.addEventListener("keydown", key);
  doc.addEventListener("visibilitychange", visibility);
  view.addEventListener("resize", resize);
  return dispose;
}
