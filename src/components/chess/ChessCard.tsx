"use client";

import { Activity, startTransition, useEffect, useRef, useState, ViewTransition } from "react";
import dynamic from "next/dynamic";
import { PLAY_EVENT } from "@/lib/chess/events";
import ProjectCardBody, { type Project } from "../ProjectCardBody";
import Reveal from "../Reveal";

// The game (board, rules, engine wrappers) is its own chunk. Pointing at or
// focusing Play starts fetching it, so it's usually there by the click; if
// not, the placeholder has the game's shape, so the card doesn't jump.
const loadGame = () => import("./ChessGame");
const ChessGame = dynamic(loadGame, {
  ssr: false,
  loading: () => (
    <div className="grid gap-8 md:grid-cols-[minmax(0,480px)_1fr]">
      <div className="aspect-square w-full rounded-sm bg-[var(--sq-light)]" />
      <p className="text-[13.5px] text-ink-mute">Setting up the board…</p>
    </div>
  ),
});

// Opening and closing are one view transition: the card's outline morphs
// between sizes while its contents hand over, and the card below slides (see
// the view-transition rules in globals.css). Browsers without view
// transitions, and reduced motion, get an instant switch.
//
// The card spans the whole row and narrows itself to one column when closed,
// so this relies on it sitting alone on its row, as the first ongoing project
// before the full-width FYP card.
const MORPH_MS = 560;

export default function ChessCard({ p, delayMs }: { p: Project; delayMs: number }) {
  const [open, setOpen] = useState(false);
  // Mounted on first open; afterwards Activity keeps the game alive while the
  // card is closed, so reopening returns to the same position.
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = (): ScrollBehavior => (reduced() ? "auto" : "smooth");
  // Scrolling mid-transition would drag the snapshots, so wait it out.
  const afterMorph = (fn: () => void) => window.setTimeout(fn, reduced() ? 0 : MORPH_MS);

  function openGame() {
    startTransition(() => {
      setMounted(true);
      setOpen(true);
    });
    afterMorph(() => cardRef.current?.querySelector("[data-game]")?.scrollIntoView({ block: "nearest", behavior: behavior() }));
  }

  function closeGame() {
    startTransition(() => setOpen(false));
    playRef.current?.focus({ preventScroll: true });
    afterMorph(() => {
      const card = cardRef.current;
      if (card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ block: "start", behavior: behavior() });
    });
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeGame();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const onPlay = () => {
      cardRef.current?.scrollIntoView({ block: "start", behavior: behavior() });
      if (!open) afterMorph(openGame);
    };
    window.addEventListener(PLAY_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_EVENT, onPlay);
  });

  return (
    <Reveal delayMs={delayMs} className="md:col-span-2">
      <ViewTransition name="chess-card" default="none" update="card-morph">
        <article
          ref={cardRef}
          className={`flex w-full flex-col overflow-hidden rounded-xl border border-rule bg-paper-raised scroll-mt-24 ${
            open ? "" : "md:w-[calc(50%-12px)]"
          }`}
        >
          {/* The text is its own layer, so it stays readable through the morph. */}
          <ViewTransition name="chess-card-text" default="none" update="card-text">
            <div className="flex flex-1 flex-col">
              <ProjectCardBody
                p={p}
                hideEmptyFigure
                actions={
                  <button
                    ref={playRef}
                    type="button"
                    onClick={open ? closeGame : openGame}
                    onPointerEnter={loadGame}
                    onFocus={loadGame}
                    onTouchStart={loadGame}
                    aria-expanded={open}
                    aria-controls="chess-game"
                    className="rounded-full bg-green px-4 py-1.5 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    {open ? "Close game" : "Play me →"}
                  </button>
                }
              />
            </div>
          </ViewTransition>
          <div id="chess-game" data-game>
            {mounted && (
              <Activity mode={open ? "visible" : "hidden"}>
                <div className="border-t border-rule p-6">
                  <ChessGame onClose={closeGame} />
                </div>
              </Activity>
            )}
          </div>
        </article>
      </ViewTransition>
    </Reveal>
  );
}
