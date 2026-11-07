import React, { useEffect, useRef, useState } from "react";
import { approvedSigns, lookupSigns, type SignEntry } from "./signs";
export function SignLookup({
  pageEpoch,
  entries = approvedSigns,
}: {
  pageEpoch: number;
  entries?: readonly SignEntry[];
}) {
  const [word, setWord] = useState(""),
    [results, setResults] = useState<SignEntry[] | null>(null),
    [chosen, setChosen] = useState<SignEntry | null>(null),
    [unavailable, setUnavailable] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    setWord("");
    setResults(null);
    setChosen(null);
  }, [pageEpoch]);
  useEffect(() => {
    const media = video.current;
    const visibility = () => {
      if (document.hidden) media?.pause();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChosen(null);
    };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", escape);
    return () => {
      media?.pause();
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("keydown", escape);
    };
  }, [chosen]);
  return (
    <section className="card">
      <h3>Verified sign lookup</h3>
      <p>
        A word dictionary, not sentence translation. Choose a meaning before
        playing a clip. Lookup text is not sent to a server or saved.
      </p>
      {!entries.length && (
        <p className="callout">
          No approved, licensed sign clips are bundled. Video lookup is
          unavailable until a source-reviewed dictionary is added. No generated
          or guessed signs are shown.
        </p>
      )}
      <label className="field">
        Word or short phrase
        <input
          maxLength={64}
          value={word}
          onChange={(event) => {
            setWord(event.target.value);
            setResults(null);
            setChosen(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              setResults(lookupSigns(word, entries));
              setChosen(null);
            }
          }}
        />
      </label>
      <button
        disabled={!word.trim()}
        onClick={() => {
          setResults(lookupSigns(word, entries));
          setChosen(null);
        }}
      >
        Look up sign
      </button>
      {results?.length === 0 && (
        <p aria-live="polite">
          No verified clip for “{word}”. Try another word or meaning.
        </p>
      )}
      {!!results?.length && (
        <ul>
          {results.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => {
                  setChosen(entry);
                  setUnavailable(false);
                }}
              >
                {entry.headword} — {entry.sense}
              </button>
            </li>
          ))}
        </ul>
      )}
      {chosen && (
        <>
          <h4>
            {chosen.headword} — {chosen.sense}
          </h4>
          {unavailable ? (
            <p>Video not available. The source and meaning remain below.</p>
          ) : (
            <video
              ref={video}
              key={chosen.id}
              controls
              muted
              preload="none"
              style={{ maxWidth: "100%" }}
              src={
                globalThis.chrome?.runtime?.getURL?.(chosen.clipPath) ||
                `/assets/${chosen.clipPath}`
              }
              onError={() => setUnavailable(true)}
              aria-label={`ASL sign: ${chosen.headword}, ${chosen.sense}`}
            />
          )}
          <p>
            {chosen.attribution} · {chosen.licence}.{" "}
            <a href={chosen.sourceUrl} target="_blank" rel="noreferrer">
              Source: {chosen.sourceName}
            </a>
          </p>
          <small>
            Reviewed by {chosen.reviewedBy} · {chosen.updatedAt}
          </small>
          <button onClick={() => setChosen(null)}>Close sign</button>
        </>
      )}
    </section>
  );
}
