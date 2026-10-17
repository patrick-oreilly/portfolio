"use client";

import { useEffect, useState } from "react";
import { references } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#trajectory" },
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-6 py-2.5 sm:px-10 sm:py-3.5">
        <span className="font-semibold tracking-[-0.01em]">Patrick O&rsquo;Reilly</span>
        <div className="hidden items-center gap-7 text-sm text-ink-mute md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={references.resume}
            download
            className="inline-flex min-h-11 items-center rounded-full border border-rule-strong px-4 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            CV
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-rule-strong text-ink transition-colors hover:border-ink md:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M3.5 3.5 12.5 12.5" />
                  <path d="M12.5 3.5 3.5 12.5" />
                </>
              ) : (
                <>
                  <path d="M2.5 5.5h11" />
                  <path d="M2.5 10.5h11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-rule md:hidden">
        <div className="mx-auto flex max-w-[1180px] flex-col px-6 sm:px-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-rule py-3.5 text-sm text-ink-soft transition-colors last:border-b-0 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
