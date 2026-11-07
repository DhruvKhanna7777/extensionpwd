import React, { useEffect, useRef, useState } from "react";
import { localAIOrigin, requestSimplification } from "./ai";
import type { SelectionCapture } from "./usePageController";
type Props = {
  pageEpoch: number;
  captureSelection: () => Promise<SelectionCapture>;
  applySimplification: (
    capture: SelectionCapture,
    text: string,
  ) => Promise<void>;
  discardSelection: (capture: SelectionCapture) => void;
};
export function AISelection({
  pageEpoch,
  captureSelection,
  applySimplification,
  discardSelection,
}: Props) {
  const [capture, setCapture] = useState<SelectionCapture | null>(null),
    [consent, setConsent] = useState(false),
    [connected, setConnected] = useState(false),
    [suggestion, setSuggestion] = useState(""),
    [busy, setBusy] = useState(false),
    [applying, setApplying] = useState(false),
    [message, setMessage] = useState(""),
    [failed, setFailed] = useState(false),
    [applied, setApplied] = useState(false);
  const active = useRef<SelectionCapture | null>(null),
    request = useRef<AbortController | null>(null),
    serial = useRef(0);
  const tell = (text: string, error = false) => {
    setMessage(text);
    setFailed(error);
  };
  useEffect(() => {
    serial.current++;
    request.current?.abort();
    if (active.current) discardSelection(active.current);
    active.current = null;
    setCapture(null);
    setSuggestion("");
    setConsent(false);
    setBusy(false);
    setApplying(false);
    setApplied(false);
    setMessage("");
    return () => {
      serial.current++;
      request.current?.abort();
      if (active.current) discardSelection(active.current);
      active.current = null;
    };
  }, [pageEpoch]);
  const captureText = async () => {
    const ticket = ++serial.current;
    request.current?.abort();
    if (active.current) discardSelection(active.current);
    active.current = null;
    setCapture(null);
    setConsent(false);
    setSuggestion("");
    setApplied(false);
    setBusy(true);
    try {
      const value = await captureSelection();
      if (ticket !== serial.current) {
        discardSelection(value);
        return;
      }
      active.current = value;
      setCapture(value);
      setConsent(false);
      setSuggestion("");
      setApplied(false);
      tell(
        "Selection captured for review. Nothing has been sent to the AI service.",
      );
    } catch (error) {
      if (ticket === serial.current)
        tell(
          error instanceof Error ? error.message : "Could not capture text.",
          true,
        );
    } finally {
      if (ticket === serial.current) setBusy(false);
    }
  };
  const connect = async () => {
    const ticket = ++serial.current;
    const abort = new AbortController();
    request.current = abort;
    setBusy(true);
    try {
      if (!globalThis.chrome?.permissions)
        throw new Error(
          "Local AI requires the installed extension and a running model adapter.",
        );
      const granted = await chrome.permissions.request({
        origins: ["http://127.0.0.1/*"],
      });
      if (!granted)
        throw new Error(
          "Local service access was not granted. Other tools still work.",
        );
      const response = await fetch(`${localAIOrigin}/health`, {
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(5000)]),
        credentials: "omit",
        cache: "no-store",
      });
      const health = await response.json();
      if (!response.ok || health.ready !== true)
        throw new Error("Local model adapter is not ready.");
      if (ticket !== serial.current) return;
      setConnected(true);
      tell(
        "Connected to the local model adapter. Consent is still required for each selection.",
      );
    } catch (error) {
      if (ticket === serial.current) {
        setConnected(false);
        tell(
          error instanceof Error
            ? error.message
            : "Start the configured local AI adapter and retry.",
          true,
        );
      }
    } finally {
      if (ticket === serial.current) setBusy(false);
    }
  };
  const simplify = async () => {
    if (!capture || !connected) return;
    const ticket = ++serial.current;
    const abort = new AbortController();
    request.current = abort;
    setBusy(true);
    setSuggestion("");
    tell("Simplifying only the captured selection…");
    try {
      const text = await requestSimplification(
        capture.text,
        consent,
        abort.signal,
      );
      if (ticket === serial.current) {
        setSuggestion(text);
        tell(
          "Review the suggestion carefully. Original page text has not changed.",
        );
      }
    } catch (error) {
      if (ticket === serial.current && !abort.signal.aborted)
        tell(
          error instanceof Error
            ? error.message
            : "Simplification failed. Original text is preserved.",
          true,
        );
    } finally {
      if (ticket === serial.current) setBusy(false);
    }
  };
  return (
    <section className="card" aria-busy={busy}>
      <h3>Simplify selected text</h3>
      <p>
        Optional AI through a model service you run on this device. No account
        or AI key is bundled. Check the model's own licence and remote-service
        settings.
      </p>
      <div className="actions">
        <button disabled={busy} onClick={captureText}>
          Capture selection
        </button>
        <button disabled={busy} onClick={connect}>
          Connect local AI service
        </button>
      </div>
      <small>
        Configure the local adapter with extension ID{" "}
        {globalThis.chrome?.runtime?.id || "shown on chrome://extensions"} and
        an installed Ollama model. Other tools work without it.
      </small>
      {capture && (
        <>
          <h4>Original selection</h4>
          <p className="selection-copy">{capture.text}</p>
          <label className="toggle">
            <span>
              Allow this selected text to be sent to my local AI service.
            </span>
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
          </label>
          <button
            disabled={busy || !connected || !consent || applied}
            className="primary"
            onClick={simplify}
          >
            Simplify selection
          </button>
          {!capture.canApply && (
            <small>
              Safe page replacement requires one prose block without links or
              controls. You can compare or copy this selection instead.
            </small>
          )}
        </>
      )}
      {busy && !applying && (
        <button
          onClick={() => {
            serial.current++;
            request.current?.abort();
            setBusy(false);
            tell("Cancelled. No suggestion was applied by this operation.");
          }}
        >
          Cancel AI request
        </button>
      )}
      {suggestion && (
        <>
          <h4>AI suggestion</h4>
          <p className="selection-copy">{suggestion}</p>
          <small>
            AI can change meaning. Check facts, numbers, names and warnings
            before using the suggestion.
          </small>
          <div className="actions">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(suggestion);
                  tell("Suggestion copied.");
                } catch {
                  tell(
                    "Copy failed. Select the suggestion text and copy manually.",
                    true,
                  );
                }
              }}
            >
              Copy suggestion
            </button>
            <button
              disabled={!capture?.canApply || applied || busy}
              onClick={async () => {
                if (!capture || busy) return;
                const ticket = ++serial.current;
                setBusy(true);
                setApplying(true);
                tell("Applying the suggestion to the captured passage…");
                try {
                  await applySimplification(capture, suggestion);
                  if (ticket !== serial.current) return;
                  setApplied(true);
                  tell(
                    "Suggestion applied to the captured passage. Restore original page undoes it.",
                  );
                } catch (error) {
                  if (ticket !== serial.current) return;
                  tell(
                    error instanceof Error
                      ? error.message
                      : "Could not replace the selected text.",
                    true,
                  );
                } finally {
                  if (ticket === serial.current) {
                    setBusy(false);
                    setApplying(false);
                  }
                }
              }}
            >
              Apply suggestion to page
            </button>
          </div>
        </>
      )}
      {message && (
        <p className={failed ? "callout" : ""} aria-live="polite">
          {message}
        </p>
      )}
    </section>
  );
}
