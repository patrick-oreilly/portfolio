"use client";

import { getCurrentTheme, setTheme } from "@/lib/theme";

export default function ThemeToggle() {
  function toggle() {
    setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className="grid h-11 w-11 place-items-center rounded-full border border-rule-strong text-ink transition-colors hover:border-ink"
    >
      <svg
        className="theme-icon-moon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5.356 1.98A6.4 6.4 0 1 0 14.02 10.644A6.4 6.4 0 0 1 5.356 1.98Z" />
      </svg>
      <svg
        className="theme-icon-sun"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="2.8" />
        <path d="M8 1.8v1.3M8 12.9v1.3M1.8 8h1.3M12.9 8h1.3M3.616 3.616l.919.919M11.465 11.465l.919.919M3.616 12.384l.919-.919M11.465 4.535l.919-.919" />
      </svg>
    </button>
  );
}
