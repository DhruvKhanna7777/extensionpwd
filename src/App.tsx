import React, { useEffect, useState, useRef } from "react";
import { validateSettings, type Settings } from "./settings";
import { usePageController } from "./usePageController";
import { BrandLogo, Icon } from "./Icons";
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
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [section]);
  const {
    settings: effectiveSettings,
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
  } = usePageController();
  const [typographyDraft, setTypographyDraft] =
    useState<Partial<Settings> | null>(null);
  useEffect(() => setTypographyDraft(null), [pageEpoch]);
  const settings = { ...effectiveSettings, ...typographyDraft };
  const editTypography = (patch: Partial<Settings>) => {
    if (typographyDraft !== null)
      setTypographyDraft((draft) => {
        const next = validateSettings({
          ...effectiveSettings,
          ...draft,
          ...patch,
        });
        return {
          ...draft,
          ...Object.fromEntries(
            Object.keys(patch).map((key) => [key, next[key as keyof Settings]]),
          ),
        };
      });
    else change(patch);
  };
  const editSlider = (key: keyof Settings, value: number) =>
    [
      "fontScale",
      "lineHeight",
      "letterSpacing",
      "wordSpacing",
      "paragraphSpacing",
      "readingWidth",
    ].includes(key)
      ? editTypography({ [key]: value })
      : change({ [key]: value });
  const colourControl = (
    <label className="field">
      Reading colour preference
      <select
        value={effectiveSettings.calm}
        onChange={(e) => change({ calm: e.target.value })}
      >
        <option value="default">Original colours</option>
        <option value="warm">Warm paper</option>
        <option value="dark">Midnight</option>
        <option value="contrast">High contrast</option>
      </select>
    </label>
  );
  const isPopup = location.pathname.endsWith("popup.html");
  const toggle = (
    key:
      | "reading"
      | "motion"
      | "focus"
      | "emphasis"
      | "chroma"
      | "distractions"
      | "ruler"
      | "hoverSpeech",
    label: string,
    help: string,
  ) => (
    <label className="toggle">
      {["reading", "motion", "chroma"].includes(key) && (
        <span className={`mode-icon ${key}`}>
          <Icon
            name={
              key === "reading"
                ? "reading"
                : key === "motion"
                  ? "sensory"
                  : "charts"
            }
          />
        </span>
      )}
      <span className="toggle-copy">
        <strong>{label}</strong>
        <small>{help}</small>
      </span>
      <input
        type="checkbox"
        disabled={!canApply}
        checked={settings[key]}
        onChange={(e) => change({ [key]: e.target.checked })}
      />
      <span className="state" aria-hidden="true">
        {settings[key] ? "On" : "Off"}
      </span>
    </label>
  );
  const slider = (
    key:
      | "fontScale"
      | "lineHeight"
      | "letterSpacing"
      | "wordSpacing"
      | "rate"
      | "volume"
      | "paragraphSpacing"
      | "readingWidth"
      | "hoverDelay",
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
          onChange={(e) => editSlider(key, Number(e.target.value))}
        />
        <input
          aria-label={`${label} numeric value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={settings[key]}
          onChange={(e) => {
            if (e.target.value !== "") editSlider(key, Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
  return (
    <div className={isPopup ? "shell popup" : "shell"}>
      <header>
        <div className="brand">
          <BrandLogo />
          <div>
            <h1>
              AbleVerse <span>AI</span>
            </h1>
            <p>Personal accessibility controls</p>
          </div>
          <button
            className="restore"
            aria-label="Restore original page"
            title="Restore original page"
            disabled={!canApply}
            onClick={() => {
              setTypographyDraft(null);
              restore();
            }}
          >
            <Icon name="restore" />
            <span>Restore</span>
          </button>
        </div>
        <div className="site">
          <span className="site-dot" aria-hidden="true" /> {domain}
        </div>
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
              onClick={() => {
                setTypographyDraft(null);
                setSection(s);
              }}
            >
              {s}
            </button>
          ))}
        </nav>
      )}
      <main ref={mainRef}>
        <fieldset className="page-controls" disabled={!canApply}>
          {(isPopup || section === "Overview") && (
            <>
              {!isPopup && <h2>Make yourself comfortable.</h2>}
              <p className="intro">
                Personal controls for clearer reading, calmer pages and charts
                beyond colour.
              </p>
              <section className="preset-section">
                <h3>Comfort preset</h3>
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
                      {String(label)}
                    </button>
                  ))}
                </div>
                <small>
                  Presets are editable starting points. Choose what feels
                  useful.
                </small>
              </section>
              <section className="mode-list">
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
                  "Label supported SVG bars, lines and pie charts.",
                )}
              </section>

              <section className="card selection-card">
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
              <h2>Reading Studio</h2>
              <p className="intro">Find a style that feels comfortable.</p>
              <section className="reading-sample">
                <div className="sample-label">
                  <h3>Reading preview</h3>
                  <span>Live sample</span>
                </div>
                <p
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${settings.fontScale}%`,
                    lineHeight: settings.lineHeight,
                    letterSpacing: `${settings.letterSpacing}em`,
                    wordSpacing: `${settings.wordSpacing}em`,
                    marginBlockEnd: settings.paragraphSpacing
                      ? `${settings.paragraphSpacing}em`
                      : undefined,
                    maxInlineSize: settings.readingWidth
                      ? `${settings.readingWidth}ch`
                      : undefined,
                    textAlign:
                      settings.textAlign === "original"
                        ? undefined
                        : (settings.textAlign as "start" | "left"),
                  }}
                >
                  Small changes can make space for a better reading experience.
                </p>
              </section>
              <section className="card">
                {toggle(
                  "reading",
                  "Adjust page text",
                  "Applies to safe prose in article and main regions.",
                )}
                <label className="toggle">
                  <span>
                    <strong>Preview typography only</strong>
                    <small>
                      Try font and spacing changes here before applying them to
                      the page.
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={typographyDraft !== null}
                    onChange={(e) =>
                      setTypographyDraft(e.target.checked ? {} : null)
                    }
                  />
                </label>
                {typographyDraft !== null && (
                  <p>
                    Typography preview only. The webpage keeps its current
                    typography until you choose Apply typography preview.
                    Leaving preview discards unapplied changes.
                  </p>
                )}
                <fieldset className="font-options">
                  <legend>Typeface family</legend>
                  <div className="segmented-grid">
                    {[
                      ["system-ui", "System Sans"],
                      ["Lexend", "Lexend"],
                      ["Atkinson Hyperlegible", "Atkinson Hyper"],
                      ["OpenDyslexic", "OpenDyslexic"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        aria-pressed={settings.fontFamily === value}
                        onClick={() => editTypography({ fontFamily: value })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  All font families
                  <select
                    value={settings.fontFamily}
                    onChange={(e) =>
                      editTypography({ fontFamily: e.target.value })
                    }
                  >
                    {[
                      "system-ui",
                      "Arial",
                      "Georgia",
                      "Verdana",
                      "Lexend",
                      "Atkinson Hyperlegible",
                      "OpenDyslexic",
                    ].map((f) => (
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
                {slider(
                  "paragraphSpacing",
                  "Space after paragraphs",
                  0,
                  2,
                  0.25,
                  "em",
                )}
                {slider("readingWidth", "Reading width", 0, 90, 5, "ch")}
                <small>
                  Zero keeps the original spacing or width. Custom width is
                  limited to 50–90 characters on eligible prose; paragraph
                  spacing to 0.5–2em. Site grids stay in place.
                </small>
                <label className="field">
                  Text alignment
                  <select
                    value={settings.textAlign}
                    onChange={(e) =>
                      editTypography({ textAlign: e.target.value })
                    }
                  >
                    <option value="original">Original alignment</option>
                    <option value="start">Natural reading direction</option>
                    <option value="left">Left</option>
                  </select>
                </label>
                <button
                  onClick={() =>
                    editTypography({
                      fontScale: 100,
                      lineHeight: 1.5,
                      letterSpacing: 0,
                      wordSpacing: 0,
                      paragraphSpacing: 0,
                      readingWidth: 0,
                      textAlign: "original",
                      fontFamily: "system-ui",
                    })
                  }
                >
                  Reset typography
                </button>
                {typographyDraft !== null && (
                  <button
                    className="primary"
                    onClick={() => {
                      change({ ...typographyDraft, reading: true });
                      setTypographyDraft(null);
                    }}
                  >
                    Apply typography preview
                  </button>
                )}
                {colourControl}
              </section>

              <section className="card">
                <h3>Selected-text speech</h3>
                {toggle(
                  "hoverSpeech",
                  "Read on hover",
                  "Opt in to delayed speech on safe article prose. Moving away stops playback.",
                )}
                {settings.hoverSpeech && (
                  <>
                    {slider("hoverDelay", "Hover delay", 300, 1500, 100, "ms")}
                    <label className="field">
                      Hover speech scope
                      <select
                        value={settings.hoverScope}
                        onChange={(e) => change({ hoverScope: e.target.value })}
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="sentence">First sentence</option>
                        <option value="word">Word under pointer</option>
                      </select>
                    </label>
                    <small>
                      Word mode falls back to the element text if point-to-text
                      lookup is unavailable. Hover reads at most 500 characters
                      once per entry. Read selection below is the keyboard
                      alternative.
                    </small>
                  </>
                )}
                {toggle(
                  "ruler",
                  "Reading ruler",
                  "A pointer-transparent guide. Move with the pointer or Alt + Up/Down; Esc turns it off.",
                )}
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
              <h2>SenseShift</h2>
              <p className="intro">Less noise. More focus.</p>
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
                {colourControl}
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
              <h2>ChromaSense</h2>
              <p className="intro">Meaning beyond colour.</p>
              <section className="card">
                {toggle(
                  "chroma",
                  "Enhance supported charts",
                  "Bar/pie patterns, line dashes and markers, exact value tables.",
                )}
                <p>
                  Annotated SVG bars, lines and pies require explicit labels,
                  values and matching geometry. Summaries use those declared
                  numbers. Unknown charts remain intact.
                </p>
                <div className="callout">
                  Canvas, screenshots and unannotated charts cannot be
                  reconstructed. Pie shares are calculated from declared values
                  and rounded; they are not inferred from slice sizes.
                </div>
              </section>
            </>
          )}
          {!isPopup && section === "Settings" && (
            <>
              <h2>Your preferences</h2>
              <p className="intro">You stay in control.</p>
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
                        await chrome.storage.local.set({
                          ableverse: effectiveSettings,
                        });
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
                <h3>This site's profile</h3>
                <p>
                  Save a separate profile for this website's origin. Loading
                  only updates the controls. Nothing activates on a visit,
                  reload or tab switch.
                </p>
                <div className="actions">
                  <button onClick={() => siteProfile("save")}>
                    Save site profile
                  </button>
                  <button onClick={() => siteProfile("load")}>
                    Load site profile
                  </button>
                  <button onClick={() => siteProfile("reset")}>
                    Reset this site's profile
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
                  AI simplification and ASL lookup are planned. No verified sign
                  clips are bundled.
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
            Open full panel <Icon name="arrow" />
          </button>
        )}
        {!isPopup && section === "Reading" && (
          <div className="panel-actions">
            <button disabled={!canApply} onClick={() => siteProfile("save")}>
              Save site profile
            </button>
            <button
              className="primary"
              disabled={!canApply}
              onClick={() => {
                change({ ...typographyDraft, reading: true });
                setTypographyDraft(null);
              }}
            >
              Apply to page
            </button>
          </div>
        )}
        <p>Opt-in changes. Original content. One-click undo.</p>
      </footer>
    </div>
  );
}
