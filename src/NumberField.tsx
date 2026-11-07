import React, { useEffect, useState } from "react";
type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  nonzeroMinimum?: number;
  onCommit: (value: number) => void;
};
export function NumberField({
  value,
  min,
  max,
  step,
  label,
  nonzeroMinimum,
  onCommit,
}: Props) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const allowed = (n: number) =>
    Number.isFinite(n) &&
    n >= min &&
    n <= max &&
    (!nonzeroMinimum || n === 0 || n >= nonzeroMinimum);
  const commit = () => {
    if (draft.trim() === "" || !Number.isFinite(Number(draft))) {
      setDraft(String(value));
      return;
    }
    let next = Math.min(max, Math.max(min, Number(draft)));
    if (nonzeroMinimum && next !== 0 && next < nonzeroMinimum)
      next = nonzeroMinimum;
    setDraft(String(next));
    if (next !== value) onCommit(next);
  };
  return (
    <input
      aria-label={label}
      type="number"
      min={min}
      max={max}
      step={step}
      value={draft}
      onChange={(event) => {
        const text = event.target.value;
        setDraft(text);
        if (
          text.trim() !== "" &&
          allowed(Number(text)) &&
          Number(text) !== value
        )
          onCommit(Number(text));
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setDraft(String(value));
        }
      }}
    />
  );
}
