import { PageEngine } from "./engine";
import { SpeechPlayer } from "./speech";
import { defaults, validateSettings } from "./settings";
// This file is bundled as an isolated-world IIFE. Repeated injection reuses this listener.
const scope = globalThis as typeof globalThis & { __ableverse?: boolean };
if (!scope.__ableverse) {
  scope.__ableverse = true;
  const engine = new PageEngine(document);
  const changed = () => {
    const pending = chrome.runtime.sendMessage?.({
      type: "PAGE_STATE_CHANGED",
    });
    pending?.catch(() => {});
  };
  const speech = new SpeechPlayer(document, changed);
  let route = location.href;
  let current = { ...defaults };
  const stop = () => speech.stop();
  const observer = new MutationObserver((records) => {
    const sourceChartChanged = records.some((record) => {
      const target =
        record.target instanceof Element
          ? record.target
          : record.target.parentElement;
      if (target?.closest('svg[data-av-chart="bar"]')) return true;
      return [...record.removedNodes].some(
        (node) =>
          node instanceof Element &&
          (node.matches('svg[data-av-chart="bar"]') ||
            node.querySelector('svg[data-av-chart="bar"]')),
      );
    });
    // Do not keep calling a stale snapshot verified after a site updates its source.
    if (location.href !== route || sourceChartChanged) restore();
  });
  const observe = () => {
    route = location.href;
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: [
        "data-av-value",
        "data-av-label",
        "data-av-unit",
        "data-av-chart",
        "aria-label",
        "x",
        "y",
        "width",
        "height",
        "transform",
        "style",
        "fill",
      ],
    });
    window.addEventListener("pagehide", restore);
  };
  const restore = () => {
    observer.disconnect();
    stop();
    engine.restore();
    current = { ...defaults };
    changed();
    window.removeEventListener("pagehide", restore);
  };
  const selection = () => {
    const sel = getSelection();
    if (!sel || sel.isCollapsed) return "";
    const protectedSelector =
      'input,textarea,select,button,code,pre,[contenteditable]:not([contenteditable="false"]),[aria-hidden="true"]';
    // Reject the entire range if it intersects protected content, including middle nodes.
    for (const el of document.querySelectorAll(protectedSelector))
      for (let i = 0; i < sel.rangeCount; i++)
        if (sel.getRangeAt(i).intersectsNode(el)) return "";
    const parent = sel.anchorNode?.parentElement;
    if (parent?.closest(protectedSelector)) return "";
    return sel.toString().trim().slice(0, 5000);
  };
  chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
    try {
      if (!msg || typeof msg.type !== "string") return;
      switch (msg.type) {
        case "GET_STATE":
          respond({
            ok: true,
            settings: current,
            speech: speech.getState(),
            voices: speech
              .listVoices()
              .map(({ voiceURI, name, lang, localService }) => ({
                voiceURI,
                name,
                lang,
                localService,
              })),
          });
          break;
        case "APPLY": {
          stop();
          observer.disconnect();
          current = validateSettings(msg.settings);
          const result = engine.apply(current);
          observe();
          respond({ ok: true, ...result });
          break;
        }
        case "RESTORE":
          restore();
          respond({ ok: true });
          break;
        case "LIST_VOICES":
          respond({
            ok: true,
            voices: speech
              .listVoices()
              .map(({ voiceURI, name, lang, localService }) => ({
                voiceURI,
                name,
                lang,
                localService,
              })),
          });
          break;
        case "READ": {
          const text = selection();
          if (!text) {
            respond({
              ok: false,
              error:
                "Select up to 5,000 characters of page text first. Form fields and code are excluded.",
            });
            break;
          }
          speech.play(text, msg.settings);
          observe();
          respond({ ok: true });
          break;
        }
        case "PAUSE":
          speech.pause();
          respond({ ok: true });
          break;
        case "STOP":
          stop();
          respond({ ok: true });
          break;
      }
    } catch (error) {
      respond({
        ok: false,
        error:
          error instanceof Error ? error.message : "Page operation failed.",
      });
    }
  });
}
