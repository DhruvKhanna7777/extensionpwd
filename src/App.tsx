import React, { useState } from "react";
import { validateSettings, type Settings } from "./settings";
import { usePageController } from "./usePageController";
import "./ui.css";
const sections = [
  "Overview",
  "Reading",
  "Sensory",
  "Charts",
  "Settings",
] as const;
export function App() {
  const [section, setSection] = useState<string>("Overview");
  const {
    settings,
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
  } = usePageController();
  const isPopup = location.pathname.endsWith("popup.html");
  const toggle = (
    key:
      "reading" | "motion" | "focus" | "emphasis" | "chroma" | "distractions",
    label: string,
    help: string,
  ) => (
    <label className="toggle">
      <span>
        <strong>{label}</strong>
        <small>{help}</small>
      </span>
      <input
        type="checkbox"
        disabled={!canApply}
        checked={settings[key]}
        onChange={(e) => change({ [key]: e.target.checked })}
      />
      <span className="state">{settings[key] ? "On" : "Off"}</span>
    </label>
  );
  const slider = (
    key:
      | "fontScale"
      | "lineHeight"
      | "letterSpacing"
      | "wordSpacing"
      | "rate"
      | "volume",
    label: string,
    min: number,
    max: number,
    step: number,
    unit: string,
  ) => (
    <div className="slider">
      <label htmlFor={key}>
        {label}
        <span>
          {settings[key]}
          {unit}
        </span>
      </label>
      <div>
        <input
          id={key}
          type="range"
          min={min}
          max={max}
          step={step}
          value={settings[key]}
          onChange={(e) => change({ [key]: Number(e.target.value) })}
        />
        <input
          aria-label={`${label} numeric value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={settings[key]}
          onChange={(e) => {
            if (e.target.value !== "")
              change({ [key]: Number(e.target.value) });
          }}
        />
      </div>
    </div>
  );
  return (
    <div className={isPopup ? "shell popup" : "shell"}>
      <header>
        <div className="brand">
          <span className="logo" aria-hidden="true">
            a<span>v</span>
          </span>
          <div>
            <h1>
              AbleVerse <span>AI</span>
            </h1>
            <p>Your web. Your way.</p>
          </div>
          <span className="badge">LOCAL CORE</span>
        </div>
        <div className="site">
          <span aria-hidden="true">◉</span> {domain}
        </div>
        <button className="restore" disabled={!canApply} onClick={restore}>
          ↶ Restore original page
        </button>
      </header>
      <div
        className={error ? "notice error" : "notice"}
        role="status"
        aria-live="polite"
      >
        {status}
      </div>
      {!isPopup && (
        <nav aria-label="Modules">
          {sections.map((s) => (
            <button
              key={s}
              aria-pressed={section === s}
              className={section === s ? "active" : ""}
              onClick={() => setSection(s)}
            >
              {s}
            </button>
          ))}
        </nav>
      )}
      <main>
        <fieldset className="page-controls" disabled={!canApply}>
          {(isPopup || section === "Overview") && (
            <>
              <div className="eyebrow">A LITTLE MORE COMFORT</div>
              <h2>Make room for what matters.</h2>
              <p className="intro">
                Personal controls for clearer reading, calmer pages and charts
                beyond colour.
              </p>
              <section className="card">
                {toggle(
                  "reading",
                  "Reading Studio",
                  "Give eligible page text more breathing room.",
                )}
                {toggle(
                  "motion",
                  "Reduce motion",
                  "Pause supported CSS animation and transitions.",
                )}
                {toggle(
                  "chroma",
                  "Colour-independent charts",
                  "Label and pattern supported SVG bars.",
                )}
              </section>
              {!isPopup && (
                <section className="card">
                  <h3>Start with a preset</h3>
                  <div className="presets">
                    {[
                      [
                        "Comfortable reading",
                        {
                          reading: true,
                          fontScale: 120,
                          lineHeight: 1.8,
                          letterSpacing: 0.04,
                          wordSpacing: 0.08,
                        },
                      ],
                      [
                        "Low stimulation",
                        { motion: true, focus: true, calm: "warm" },
                      ],
                      ["Colour independent", { chroma: true, emphasis: true }],
                    ].map(([label, patch]) => (
                      <button
                        key={String(label)}
                        onClick={() => change(patch as Partial<Settings>)}
                      >
                        {String(label)} <span aria-hidden="true">↗</span>
                      </button>
                    ))}
                  </div>
                  <small>
                    Presets are editable starting points. Choose what feels
                    useful.
                  </small>
                </section>
              )}
              <section className="card">
                <h3>Listen to a selection</h3>
                <p>Select text on the page, then choose Read aloud.</p>
                <div className="actions">
                  <button className="primary" onClick={() => run("READ")}>
                    Read aloud
                  </button>
                  <button onClick={() => run("PAUSE")}>Pause / resume</button>
                  <button onClick={() => run("STOP")}>Stop</button>
                </div>
              </section>
            </>
          )}
          {!isPopup && section === "Reading" && (
            <>
              <div className="eyebrow">READING STUDIO</div>
              <h2>A comfortable pace.</h2>
              <section className="card">
                {toggle(
                  "reading",
                  "Adjust page text",
                  "Applies to safe prose in article and main regions.",
                )}
                <label className="field">
                  Font family
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => change({ fontFamily: e.target.value })}
                  >
                    {["system-ui", "Arial", "Georgia", "Verdana"].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </label>
                {slider("fontScale", "Text size", 90, 180, 5, "%")}
                {slider("lineHeight", "Line height", 1.35, 2.2, 0.05, "×")}
                {slider(
                  "letterSpacing",
                  "Space between letters",
                  0,
                  0.12,
                  0.01,
                  "em",
                )}
                {slider(
                  "wordSpacing",
                  "Space between words",
                  0,
                  0.25,
                  0.01,
                  "em",
                )}
                <button
                  onClick={() =>
                    change({
                      fontScale: 100,
                      lineHeight: 1.5,
                      letterSpacing: 0,
                      wordSpacing: 0,
                      fontFamily: "system-ui",
                    })
                  }
                >
                  Reset typography
                </button>
              </section>
              <section className="card">
                <h3>Reading preview</h3>
                <p
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${settings.fontScale}%`,
                    lineHeight: settings.lineHeight,
                    letterSpacing: `${settings.letterSpacing}em`,
                    wordSpacing: `${settings.wordSpacing}em`,
                  }}
                >
                  Small changes can make space for a better reading experience.
                </p>
              </section>
              <section className="card">
                <h3>Selected-text speech</h3>
                <label className="field">
                  Speech voice
                  <select
                    value={settings.voiceURI}
                    onChange={(event) =>
                      change({ voiceURI: event.target.value })
                    }
                  >
                    <option value="">Browser default</option>
                    {voices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} · {voice.lang}
                        {voice.localService
                          ? " · device voice"
                          : " · browser voice"}
                      </option>
                    ))}
                  </select>
                </label>
                <button onClick={() => run("LIST_VOICES")}>
                  Refresh voices
                </button>
                {slider("rate", "Speech rate", 0.7, 1.5, 0.1, "×")}
                {slider("volume", "Speech volume", 0, 1, 0.1, "×")}
                <div className="actions">
                  <button className="primary" onClick={() => run("READ")}>
                    Read selection
                  </button>
                  <button onClick={() => run("PAUSE")}>Pause / resume</button>
                  <button onClick={() => run("STOP")}>Stop</button>
                </div>
                <small>
                  Press Esc on the page to stop. Browser/device voices may use
                  online speech services.
                </small>
              </section>
            </>
          )}
          {!isPopup && section === "Sensory" && (
            <>
              <div className="eyebrow">SENSESHIFT</div>
              <h2>Less noise. More focus.</h2>
              <section className="card">
                {toggle(
                  "distractions",
                  "Hide marked distractions",
                  "Only marked noninteractive items on supported pages. Forms, links and alerts stay visible.",
                )}
                {toggle(
                  "motion",
                  "Reduce motion",
                  "CSS animation and transitions, with status/progress exclusions.",
                )}
                {toggle(
                  "focus",
                  "Focus reading region",
                  "Outline the article without blocking other content.",
                )}
                {toggle(
                  "emphasis",
                  "Emphasise controls",
                  "Add outlines and underline links.",
                )}
                <label className="field">
                  Reading colour preference
                  <select
                    value={settings.calm}
                    onChange={(e) => change({ calm: e.target.value })}
                  >
                    <option value="default">Original colours</option>
                    <option value="warm">Warm paper</option>
                    <option value="dark">Midnight</option>
                    <option value="contrast">High contrast</option>
                  </select>
                </label>
                <small>
                  Colour changes affect eligible prose only. Warnings, forms and
                  code are excluded. Images, video and canvas motion are
                  unchanged.
                </small>
              </section>
            </>
          )}
          {!isPopup && section === "Charts" && (
            <>
              <div className="eyebrow">CHROMASENSE</div>
              <h2>Meaning beyond colour.</h2>
              <section className="card">
                {toggle(
                  "chroma",
                  "Enhance supported bar charts",
                  "Distinct textures, exact values and a companion table.",
                )}
                <p>
                  Only annotated SVG bar charts with explicit labels, values and
                  geometry are supported. Unknown charts remain intact.
                </p>
                <div className="callout">
                  Canvas, screenshots, line and pie chart reconstruction are not
                  included in this core build.
                </div>
              </section>
            </>
          )}
          {!isPopup && section === "Settings" && (
            <>
              <div className="eyebrow">YOUR PREFERENCES</div>
              <h2>You stay in control.</h2>
              <section className="card">
                <h3>Save locally</h3>
                <p>
                  Save this control configuration on your device. Saved settings
                  never activate on a new page automatically.
                </p>
                <div className="actions">
                  <button
                    className="primary"
                    onClick={async () => {
                      try {
                        await chrome.storage.local.set({ ableverse: settings });
                        tell("Preferences saved on this device.");
                      } catch {
                        tell("Storage is unavailable in preview.", true);
                      }
                    }}
                  >
                    Save preferences
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const data =
                          await chrome.storage.local.get("ableverse");
                        const next = validateSettings(data.ableverse);
                        setSettings(next);
                        tell(
                          "Saved preferences loaded into controls. Choose Apply saved to change this page.",
                        );
                      } catch {
                        tell("Storage is unavailable in preview.", true);
                      }
                    }}
                  >
                    Load saved
                  </button>
                  <button onClick={() => run("APPLY")}>
                    Apply saved / current
                  </button>
                </div>
              </section>
              <section className="card">
                <h3>Privacy & honest limits</h3>
                <p>
                  No account, analytics, page upload or AI request. Only
                  preferences are saved. Page text stays out of extension
                  storage.
                </p>
                <p>
                  AI simplification, hover speech, per-site profiles and ASL
                  lookup are planned. No verified sign clips are bundled.
                </p>
                <p>
                  Internal browser pages, the Chrome Web Store, embedded PDFs
                  and cross-origin frames are unsupported. Shadow DOM coverage
                  is partial.
                </p>
                <p>Core build 0.1.0 · Chrome 116+</p>
              </section>
            </>
          )}
        </fieldset>
      </main>
      <footer>
        {isPopup && (
          <button className="primary full" onClick={openPanel}>
            Open full panel ↗
          </button>
        )}
        <p>Opt-in changes. Original content. One-click undo.</p>
      </footer>
    </div>
  );
}
