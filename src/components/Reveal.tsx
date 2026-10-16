"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tells the boot script React is alive, so it leaves the .js class (and with it
    // the reveal animations) switched on. If this never runs, the timeout in
    // src/lib/boot.ts un-hides the content instead.
    window.__revealReady = true;

    const el = ref.current;
    if (!el) return;

    // Content already inside the viewport at mount must never start hidden:
    // waiting on the observer's first async tick risks a flash of invisible
    // content, so show it immediately and skip the entrance animation.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            el.classList.add("is-visible");
          }, delayMs);
          observer.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
