import { useEffect, useRef, useState } from "react";
import { defaults, validateSettings, type Settings } from "./settings";
import { loadSiteProfile, saveSiteProfile, resetSiteProfile } from "./profiles";
type Voice = {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
};

export function supportedUrl(raw?: string) {
  try {
    const u = new URL(raw || "");
    return (
      ["http:", "https:"].includes(u.protocol) &&
      u.hostname !== "chromewebstore.google.com" &&
      !(
        u.hostname === "chrome.google.com" && u.pathname.startsWith("/webstore")
      )
    );
  } catch {
    return false;
  }
}
export function usePageController() {
  const [settings, setSettings] = useState<Settings>({ ...defaults });
  const [status, setStatus] = useState("Checking this page…");
  const [domain, setDomain] = useState("Current page");
  const [error, setError] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [pageEpoch, setPageEpoch] = useState(0);
  const [canApply, setCanApply] = useState(!globalThis.chrome?.tabs);
  const targetRef = useRef<chrome.tabs.Tab>();
  const revision = useRef(0);
  const queue = useRef(Promise.resolve());
  function tell(text: string, failed = false) {
    setStatus(text);
    setError(failed);
  }
  useEffect(() => {
    if (!globalThis.chrome?.tabs) {
      tell(
        "Interface preview. Load dist as an unpacked Chrome extension to change pages.",
      );
      return;
    }
    let mounted = true;
    const refresh = async (reason?: string) => {
      const generation = ++revision.current;
      if (!reason) {
        setPageEpoch((value) => value + 1);
        setCanApply(false);
        setSettings({ ...defaults });
        setError(false);
      }
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!mounted || generation !== revision.current) return;
        targetRef.current = tab;
        setDomain(
          tab?.url
            ? new URL(tab.url).hostname || "Current page"
            : "Current page",
        );
        if (!tab?.url) {
          tell(
            "Click the extension toolbar icon on this page to grant access.",
          );
          return;
        }
        if (!supportedUrl(tab.url)) {
          tell(
            "This page cannot be changed. Browser pages, stores and PDFs are unsupported.",
          );
          return;
        }
        setCanApply(true);
        if (!reason) tell("Choose a setting to enable this page.");
        if (tab.id !== undefined)
          try {
            const result = await chrome.tabs.sendMessage(tab.id, {
              type: "GET_STATE",
            });
            if (!mounted || generation !== revision.current) return;
            if (result?.ok) {
              setSettings(validateSettings(result.settings));
              if (Array.isArray(result.voices)) setVoices(result.voices);
              if (result.speech?.state === "error")
                tell(result.speech.error, true);
              else if (result.speech?.state === "speaking")
                tell(
                  "Reading your selection. Use Stop or press Esc on the page.",
                );
              else if (result.speech?.state === "paused")
                tell("Speech paused. Choose Pause / resume to continue.");
              else if (reason === "restored")
                tell("Original page restored. Speech stopped.");
              else if (reason === "state" && result.speech?.state === "idle")
                tell("Speech stopped or finished.");
              else if (!reason)
                tell("Showing this page’s current preferences.");
            }
          } catch {
            /* No content script until an explicit action. */
          }
      } catch {
        if (mounted && generation === revision.current)
          tell(
            "Unable to inspect this page. Click the extension toolbar icon and retry.",
            true,
          );
      }
    };
    void refresh();
    const activated = () => {
      void refresh();
    };
    const updated = (
      _id: number,
      info: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      if (tab.active && (info.status === "complete" || info.url))
        void refresh();
    };
    chrome.tabs.onActivated.addListener(activated);
    chrome.tabs.onUpdated.addListener(updated);
    const pageChanged = (
      message: { type?: string; reason?: string },
      sender: chrome.runtime.MessageSender,
    ) => {
      if (
        message?.type === "PAGE_STATE_CHANGED" &&
        sender.tab?.id === targetRef.current?.id
      )
        void refresh(message.reason || "state");
    };
    chrome.runtime?.onMessage?.addListener(pageChanged);
    return () => {
      mounted = false;
      revision.current++;
      chrome.tabs.onActivated.removeListener(activated);
      chrome.tabs.onUpdated.removeListener(updated);
      chrome.runtime?.onMessage?.removeListener(pageChanged);
    };
  }, []);

  function run(type: string, next = settings) {
    // Start the query inside the click handler, before waiting for earlier operations.
    // A later tab switch must never retarget this action.
    const generation = ++revision.current;
    const target = globalThis.chrome?.tabs
      ? chrome.tabs.query({ active: true, currentWindow: true }).then(
          (t) => ({ tab: t[0] }),
          (e) => ({ failure: e }),
        )
      : Promise.resolve({
          failure: new Error(
            "Preview only. Install the unpacked extension to use this control.",
          ),
        });
    queue.current = queue.current.then(async () => {
      let tab: chrome.tabs.Tab | undefined;
      try {
        const resolved = await target;
        if ("failure" in resolved) throw resolved.failure;
        tab = resolved.tab;
        if (tab?.id === undefined || !supportedUrl(tab.url))
          throw new Error(
            "This page cannot be changed. Use a regular http(s) website, then click the extension icon.",
          );
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
        const result = await chrome.tabs.sendMessage(tab.id, {
          type,
          settings: next,
        });
        if (!result?.ok)
          throw new Error(
            result?.error ||
              "The page did not respond. Click the extension toolbar icon and retry.",
          );
        if (generation !== revision.current) return;
        if (type === "LIST_VOICES") {
          setVoices(Array.isArray(result.voices) ? result.voices : []);
          tell(
            result.voices?.length
              ? "Voice list refreshed. Choose a voice below."
              : "No voices ready. Check device speech settings, then refresh.",
          );
        } else if (type === "APPLY")
          tell(
            `Preferences applied.${next.distractions ? ` ${result.hidden ?? 0} marked distraction(s) hidden.` : ""}${next.chroma ? ` ${result.charts} supported chart(s) enhanced.` : ""}${result.warnings?.length ? " " + result.warnings.join(" ") : ""}`,
          );
        else
          tell(
            (
              {
                RESTORE: "Original page restored. Speech stopped.",
                READ: "Reading your selection. Use Stop or press Esc on the page.",
                PAUSE: "Speech pause/resume requested.",
                STOP: "Speech stopped.",
              } as Record<string, string>
            )[type] || "Done.",
          );
      } catch (e) {
        if (generation !== revision.current) return;
        if (type === "APPLY" || type === "RESTORE") {
          let effective = { ...defaults };
          if (tab?.id !== undefined)
            try {
              const state = await chrome.tabs.sendMessage(tab.id, {
                type: "GET_STATE",
              });
              if (state?.ok) effective = validateSettings(state.settings);
            } catch {}
          if (generation !== revision.current) return;
          setSettings(effective);
        }
        tell(
          e instanceof Error ? e.message : "Could not change this page.",
          true,
        );
      }
    });
  }
  function change(patch: Partial<Settings>) {
    const next = validateSettings({ ...settings, ...patch });
    setSettings(next);
    run("APPLY", next);
  }
  function restore() {
    setSettings({ ...defaults });
    run("RESTORE", { ...defaults });
  }
  function openPanel() {
    const tabId = targetRef.current?.id;
    if (tabId === undefined) {
      tell("Wait for this tab to load, then retry.", true);
      return;
    }
    try {
      chrome.sidePanel
        .open({ tabId })
        .then(() => window.close())
        .catch(() =>
          tell(
            "Could not open the panel. Open it from Chrome’s side panel selector.",
            true,
          ),
        );
    } catch {
      tell("Full panel requires Chrome 116 or newer.", true);
    }
  }
  async function siteProfile(action: "save" | "load" | "reset") {
    const generation = ++revision.current;
    const snapshot = { ...settings };
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!supportedUrl(tab?.url))
        throw new Error("Open a regular website to use site profiles.");
      if (action === "save")
        await saveSiteProfile(chrome.storage.local, tab.url!, snapshot);
      if (action === "reset")
        await resetSiteProfile(chrome.storage.local, tab.url!);
      if (action === "load") {
        const loaded = await loadSiteProfile(chrome.storage.local, tab.url!);
        if (generation !== revision.current) return;
        if (!loaded) {
          tell("No saved profile for this site.");
          return;
        }
        setSettings(loaded);
      }
      if (generation !== revision.current) return;
      tell(
        action === "save"
          ? "Profile saved for this site only. It never activates automatically."
          : action === "reset"
            ? "Saved site profile removed. The current page is unchanged."
            : "Site profile loaded into controls. Choose Apply saved / current to change this page.",
      );
    } catch (error) {
      if (generation === revision.current)
        tell(
          error instanceof Error
            ? error.message
            : "Site profile storage is unavailable.",
          true,
        );
    }
  }
  return {
    settings,
    pageEpoch,
    setSettings,
    status,
    domain,
    error,
    voices,
    canApply,
    tell,
    run,
    change,
    restore,
    openPanel,
    siteProfile,
  };
}
