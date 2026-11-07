import React from "react";
export function BrandLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#3069CF" />
      <path
        d="M7 11a2 2 0 0 1 2-2h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9a2 2 0 0 1-2-2V11Z"
        fill="white"
      />
      <path
        d="M16 10a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6a1 1 0 0 1-1-1V10Z"
        fill="#E6F6F5"
      />
      <circle cx="20.5" cy="18.5" r="3.5" fill="#087B78" />
    </svg>
  );
}
export function Icon({
  name,
}: {
  name: "reading" | "sensory" | "charts" | "restore" | "arrow";
}) {
  const paths = {
    reading:
      "M12 6v14M3 6c3-2 6-2 9 0 3-2 6-2 9 0v14c-3-2-6-2-9 0-3-2-6-2-9 0V6Z",
    sensory: "m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z",
    charts: "M4 20V12h4v8M10 20V7h4v13M16 20V3h4v17",
    restore: "M4 4v5h5M4.6 9a8 8 0 1 1-.1 6",
    arrow: "M5 12h14m-6-6 6 6-6 6",
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
