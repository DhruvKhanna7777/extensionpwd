import { PageEngine } from "./engine";
import { SpeechPlayer } from "./speech";
import { HoverReader } from "./hover";
import { SelectionSession } from "./selectionSession";
import { defaults, validateSettings } from "./settings";
// This file is bundled as an isolated-world IIFE. Repeated injection reuses this listener.
const scope = globalThis as typeof globalThis & { __ableverse?: boolean };
if (!scope.__ableverse) {
  scope.__ableverse = true;
  const selections = new SelectionSession(document);
  const engine = new PageEngine(document, () => {
    current.ruler = false;
    changed();
  });
  const changed = (reason = "state") => {
    if (
      !hasActiveProfile() &&
      !["speaking", "paused"].includes(speech.getState().state)
    )
      unobserve();
    const pending = chrome.runtime.sendMessage?.({
      type: "PAGE_STATE_CHANGED",
      reason,
    });
    pending?.catch(() => {});
  };
  const speech = new SpeechPlayer(document, changed);
  let hoverError = "";
  const hover = new HoverReader(
    document,
    (text) => {
      hoverError = "";
      speech.play(text, current);
    },
    () => speech.stop(),
    (message) => {
      hoverError = message;
      changed();
    },
  );
  let route = location.href;
  let current = { ...defaults };
  let routeTimer: ReturnType<typeof setInterval> | undefined;
  const hasActiveProfile = () =>
    current.reading ||
    current.motion ||
    current.focus ||
    current.emphasis ||
    current.distractions ||
    current.chroma ||
    current.hoverSpeech ||
    current.ruler ||
    selections.active ||
    current.calm !== "default";
  const stop = () => {
    hover.cancel();
    speech.stop();
  };
  const observer = new MutationObserver((records) => {
    const sourceChartChanged =
      current.chroma &&
      records.some((record) => {
        const target =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement;
        if (
          record.type === "attributes" &&
          record.attributeName === "data-av-chart" &&
          target?.localName === "svg"
        )
          return true;
        if (
          target?.closest(
            'svg[data-av-chart="bar"],svg[data-av-chart="line"],svg[data-av-chart="pie"]',
          )
        )
          return true;
        return [...record.removedNodes].some(
          (node) =>
            node instanceof Element &&
            (node.matches(
              'svg[data-av-chart="bar"],svg[data-av-chart="line"],svg[data-av-chart="pie"]',
            ) ||
              node.querySelector(
                'svg[data-av-chart="bar"],svg[data-av-chart="line"],svg[data-av-chart="pie"]',
              )),
        );
      });
    // Do not keep calling a stale snapshot verified after a site updates its source.
    if (location.href !== route || sourceChartChanged) restore();
  });
  const observe = () => {
    if (
      !hasActiveProfile() &&
      !["speaking", "paused"].includes(speech.getState().state)
    ) {
      unobserve();
      return;
    }
    route = location.href;
    if (routeTimer === undefined)
      routeTimer = setInterval(() => {
        if (location.href !== route) restore();
        else if (
          !hasActiveProfile() &&
          !["speaking", "paused"].includes(speech.getState().state)
        )
          unobserve();
      }, 500);
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
        "data-av-source",
        "class",
        "aria-label",
        "x",
        "y",
        "width",
        "height",
        "transform",
        "style",
        "fill",
        "points",
        "d",
        "data-av-series",
        "data-av-slice",
      ],
    });
    window.addEventListener("pagehide", restore);
  };
  const unobserve = () => {
    if (routeTimer !== undefined) {
      clearInterval(routeTimer);
      routeTimer = undefined;
    }
    observer.disconnect();
    window.removeEventListener("pagehide", restore);
  };
  const restore = () => {
    unobserve();
    selections.restore();
    hover.destroy();
    hoverError = "";
    stop();
    engine.restore();
    current = { ...defaults };
    changed("restored");
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
        case "FOCUS_CHART_TABLE": {
          const table = document.querySelector<HTMLTableElement>(
            "table[data-ableverse-owned],[data-ableverse-owned] table",
          );
          if (!current.chroma || !table) {
            respond({
              ok: false,
              error:
                "Enable Charts on a supported chart before opening its verified table.",
            });
            break;
          }
          table.tabIndex = -1;
          table.style.outline = "3px solid #3069cf";
          table.addEventListener(
            "blur",
            () => table.style.removeProperty("outline"),
            { once: true },
          );
          table.scrollIntoView?.({ block: "nearest" });
          table.focus();
          respond({ ok: true });
          break;
        }
        case "GET_SELECTION": {
          const capture = selections.capture();
          observe();
          respond({ ok: true, ...capture });
          break;
        }
        case "DISCARD_SELECTION":
          selections.discard(msg.token);
          changed();
          respond({ ok: true });
          break;
        case "APPLY_SIMPLIFICATION":
          stop();
          selections.apply(msg.token, msg.text);
          observe();
          respond({ ok: true });
          break;
        case "GET_STATE":
          respond({
            ok: true,
            settings: current,
            speech: hoverError
              ? { state: "error", error: hoverError }
              : speech.getState(),
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
          hoverError = "";
          hover.configure(current);
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
          hover.cancel();
          hoverError = "";
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
          hoverError = "";
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
