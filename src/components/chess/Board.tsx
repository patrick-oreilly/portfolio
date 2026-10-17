"use client";

import { useEffectEvent, useLayoutEffect, useRef } from "react";
import { Chessground } from "chessground";
import type { Api } from "chessground/api";
import type { DrawShape } from "chessground/draw";
import type { Color, Key } from "chessground/types";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.cburnett.css";

export type BoardProps = {
  fen: string;
  orientation: Color;
  turnColor: Color;
  /** Whose pieces can be moved right now, or undefined for nobody. */
  movableColor?: Color;
  dests: Map<Key, Key[]>;
  lastMove?: [Key, Key];
  check: boolean;
  shapes?: DrawShape[];
  onMove: (from: Key, to: Key) => void;
};

// A thin, controlled wrapper over chessground (Lichess's board). Rules live in
// chess.js upstream; this only shows the position and reports drops.
export default function Board(props: BoardProps) {
  const el = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const handleMove = useEffectEvent((from: Key, to: Key) => props.onMove(from, to));

  // Layout effects, so the board is drawn before a view transition snapshots it.
  useLayoutEffect(() => {
    if (!el.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const board = Chessground(el.current, {
      animation: { enabled: !reduced, duration: 180 },
      premovable: { enabled: false },
      draggable: { showGhost: true },
      movable: { free: false, showDests: true, events: { after: (from, to) => handleMove(from, to) } },
      drawable: { enabled: false, visible: true },
    });
    api.current = board;
    const observer = new ResizeObserver(() => board.redrawAll());
    observer.observe(el.current);
    return () => {
      observer.disconnect();
      board.destroy();
      api.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    api.current?.set({
      fen: props.fen,
      orientation: props.orientation,
      turnColor: props.turnColor,
      lastMove: props.lastMove,
      check: props.check,
      movable: { color: props.movableColor, dests: props.dests },
      drawable: { autoShapes: props.shapes ?? [] },
    });
  }, [props.fen, props.orientation, props.turnColor, props.movableColor, props.dests, props.lastMove, props.check, props.shapes]);

  return (
    <div className="chess-board w-full">
      <div ref={el} className="aspect-square w-full" />
    </div>
  );
}
