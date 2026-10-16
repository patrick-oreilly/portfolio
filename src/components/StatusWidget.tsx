"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { meta, projects } from "@/lib/content";

const feed = projects.map((p) => ({ label: p.title, status: p.statusLabel }));
const ROTATE_MS = 3200;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export default function StatusWidget() {
  const [time, setTime] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [interacting, setInteracting] = useState(false);

  // null means "no explicit choice yet", so the system preference decides.
  const reducedMotion = usePrefersReducedMotion();
  const isPaused = paused ?? reducedMotion;
  // Hover or focus holds the rotation so the text never changes under a reader.
  const held = interacting && !isPaused;
  const isRotating = !isPaused && !held;

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Dublin",
        })
      );
    tick();
    const clock = setInterval(tick, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!isRotating) return;
    const rotate = setInterval(() => setIdx((i) => (i + 1) % feed.length), ROTATE_MS);
    return () => clearInterval(rotate);
  }, [isRotating]);

  // The visible label and the button's own action are both derived from
  // isRotating, so pressing it always does what the footer says it will.
  function toggleRotation() {
    if (isRotating) {
      setPaused(true);
      return;
    }
    // An explicit press outranks the hover/focus hold, otherwise pressing
    // "resume" while the pointer is still over the panel would appear to do nothing.
    setPaused(false);
    setInteracting(false);
  }

  const current = feed[idx];

  return (
    <div
      className="w-full max-w-[340px] rounded-xl border border-rule bg-paper-raised shadow-sm"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[11px] text-ink-mute">status</span>
        </div>
        <span className="font-mono text-[11px] text-ink-mute">
          {meta.location} {time ? `· ${time}` : ""}
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">currently</div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-sm font-medium">AI Intern @ HPE</span>
        </div>

        <div className="mt-4 border-t border-rule pt-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">selected</div>
          <div className="mt-1.5 text-sm">
            <span className="font-medium">{current.label}</span>
            <span className="text-ink-mute"> · {current.status}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-rule px-4 py-2 font-mono text-[11px] text-ink-mute">
        <button
          type="button"
          onClick={toggleRotation}
          aria-label={isRotating ? "Pause automatic rotation" : "Resume automatic rotation"}
          className="inline-flex items-center gap-1.5 rounded-sm py-1.5 transition-colors hover:text-ink"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isRotating ? <path d="M4.6 2.8v6.4M7.4 2.8v6.4" /> : <path d="M4.4 2.8 8.8 6 4.4 9.2Z" />}
          </svg>
          {isRotating ? "rotating" : "paused"}
        </button>
        <span>
          {idx + 1} / {feed.length}
        </span>
      </div>
    </div>
  );
}
