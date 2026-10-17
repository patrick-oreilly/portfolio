"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import type { DrawShape } from "chessground/draw";
import type { Key } from "chessground/types";
import { projects } from "@/lib/content";
import { bookMove, type OpeningBook } from "@/lib/chess/book";
import { loadBot, loadStockfish, type Bot, type Stockfish } from "@/lib/chess/engines";
import { BLUNDER_CP, findBlunders, formatEval, type Evaluation, type PlayedMove } from "@/lib/chess/review";
import Board from "./Board";

type Colour = "w" | "b";
type Result = { winner: "you" | "me" | "draw"; reason: string };

// The bot plays from my book for my first eight moves, while it has an answer.
const BOOK_PLIES = 16;
// A beat before the bot replies, so its moves don't land instantly.
const BOT_PAUSE_MS = 450;

const blunderRiskUrl = projects.find((p) => p.slug === "chess-blunder-risk")?.link;

const toUci = (m: { from: string; to: string; promotion?: string }) => m.from + m.to + (m.promotion ?? "");

function destinations(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>();
  for (const m of chess.moves({ verbose: true })) {
    dests.set(m.from, [...(dests.get(m.from) ?? []), m.to]);
  }
  return dests;
}

function gameOver(chess: Chess, player: Colour): Result | null {
  if (chess.isCheckmate()) {
    return { winner: chess.turn() === player ? "me" : "you", reason: "Checkmate" };
  }
  if (chess.isStalemate()) return { winner: "draw", reason: "Stalemate" };
  if (chess.isInsufficientMaterial()) return { winner: "draw", reason: "Not enough material to mate" };
  if (chess.isThreefoldRepetition()) return { winner: "draw", reason: "Threefold repetition" };
  if (chess.isDraw()) return { winner: "draw", reason: "Fifty-move rule" };
  return null;
}

// Engines and my book load once per page, the first time the game is shown,
// and then stay: closing and reopening the card doesn't reload them.
let shared: { bot: Promise<Bot>; stockfish: Promise<Stockfish>; book: Promise<OpeningBook> } | null = null;
const engines = () =>
  (shared ??= {
    bot: loadBot(),
    stockfish: loadStockfish(),
    book: import("@/lib/chess/opening-book.json").then((m) => m.default as unknown as OpeningBook),
  });

const START_FEN = new Chess().fen();

const HEADLINE: Record<Result["winner"], string> = {
  you: "You beat me. Fair play.",
  me: "I'll take that one.",
  draw: "A draw. I'll take it.",
};

export default function ChessGame({ onClose }: { onClose: () => void }) {
  const chess = useRef(new Chess());
  // Bumped by a new game, so late analysis of the old one is dropped.
  const gameId = useRef(0);
  // Bumped by a new game or resigning, so a bot move in flight is dropped.
  const botTurn = useRef(0);
  const started = useRef(false);

  const [player, setPlayer] = useState<Colour>("w");
  const [fens, setFens] = useState<string[]>([START_FEN]);
  const [moves, setMoves] = useState<PlayedMove[]>([]);
  const [evals, setEvals] = useState<(Evaluation | undefined)[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [thinking, setThinking] = useState(false);
  const [botName, setBotName] = useState<string | null>(null);
  const [view, setView] = useState<"game" | "review">("game");
  const [selected, setSelected] = useState<number | null>(null);

  const analyse = useCallback((index: number, fen: string) => {
    const id = gameId.current;
    engines().stockfish.then((sf) =>
      sf.analyse(fen).then((ev) => {
        if (gameId.current !== id) return;
        setEvals((prev) => {
          const next = [...prev];
          next[index] = ev;
          return next;
        });
      }),
    );
  }, []);

  const play = useCallback(
    (uci: string, playerColour: Colour) => {
      const c = chess.current;
      const move = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? "q" });
      const ply = c.history().length - 1;
      const fen = c.fen();
      setFens((prev) => [...prev, fen]);
      setMoves((prev) => [...prev, { san: move.san, uci: toUci(move), color: move.color, ply }]);
      analyse(ply + 1, fen);
      const over = gameOver(c, playerColour);
      if (over) setResult(over);
      return !over;
    },
    [analyse],
  );

  const botMove = useCallback(
    async (playerColour: Colour) => {
      const turn = ++botTurn.current;
      const c = chess.current;
      setThinking(true);
      const [bot, book] = await Promise.all([engines().bot, engines().book]);
      const legal = c.moves({ verbose: true }).map(toUci);
      const fromBook = c.history().length < BOOK_PLIES ? bookMove(book, c.fen()) : null;
      const allFens = [START_FEN, ...c.history({ verbose: true }).map((m) => m.after)];
      const [uci] = await Promise.all([
        fromBook && legal.includes(fromBook) ? fromBook : bot.pick(allFens, legal),
        new Promise((r) => setTimeout(r, BOT_PAUSE_MS)),
      ]);
      if (botTurn.current !== turn) return;
      setThinking(false);
      play(uci, playerColour);
    },
    [play],
  );

  const newGame = useCallback(
    (colour: Colour) => {
      gameId.current++;
      botTurn.current++;
      chess.current = new Chess();
      const start = START_FEN;
      setPlayer(colour);
      setFens([start]);
      setMoves([]);
      setEvals([]);
      setResult(null);
      setThinking(false);
      setView("game");
      setSelected(null);
      analyse(0, start);
      if (colour === "b") botMove(colour);
    },
    [analyse, botMove],
  );

  // This component stays mounted (hidden) after the card closes, so the
  // effect can run again on reopen; the first run is the only one that starts.
  useEffect(() => {
    const { bot, book } = engines();
    Promise.all([bot, book]).then(([b]) => setBotName(b.name));
    if (started.current) return;
    started.current = true;
    analyse(0, START_FEN);
  }, [analyse]);

  function onBoardMove(from: Key, to: Key) {
    if (result || thinking) return;
    const piece = chess.current.get(from as Square);
    const promoting = piece?.type === "p" && (to[1] === "8" || to[1] === "1");
    if (play(from + to + (promoting ? "q" : ""), player)) botMove(player);
  }

  function resign() {
    botTurn.current++;
    setThinking(false);
    setResult({ winner: "me", reason: "You resigned" });
  }

  const blunders = useMemo(() => findBlunders(moves, evals), [moves, evals]);
  const analysed = evals.filter(Boolean).length;
  const analysisDone = analysed >= fens.length;

  // In review, the board shows the position before the selected blunder, with
  // the move played in red and the engine's choice in green.
  const reviewing = view === "review" && selected !== null ? blunders[selected] : null;
  const boardFen = reviewing ? fens[reviewing.ply] : fens[fens.length - 1];
  const boardChess = useMemo(() => new Chess(boardFen), [boardFen]);
  const dests = useMemo(() => destinations(boardChess), [boardChess]);
  const last = moves[moves.length - 1];
  const shapes: DrawShape[] = reviewing
    ? [
        { orig: reviewing.uci.slice(0, 2) as Key, dest: reviewing.uci.slice(2, 4) as Key, brush: "red" },
        ...(reviewing.best
          ? [{ orig: reviewing.best.slice(0, 2) as Key, dest: reviewing.best.slice(2, 4) as Key, brush: "green" }]
          : []),
      ]
    : [];

  const yourTurn = !result && !thinking && boardChess.turn() === player && !reviewing;
  const status = result
    ? result.reason
    : !botName && boardChess.turn() !== player
      ? "Setting up the board…"
      : thinking
        ? "Thinking…"
        : "Your move";

  const pairs: [PlayedMove, PlayedMove | undefined][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }

  const yours = blunders.filter((b) => b.color === player).length;
  const mine = blunders.length - yours;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,480px)_1fr]">
      <Board
        fen={boardFen}
        orientation={player === "w" ? "white" : "black"}
        turnColor={boardChess.turn() === "w" ? "white" : "black"}
        movableColor={yourTurn ? (player === "w" ? "white" : "black") : undefined}
        dests={dests}
        lastMove={!reviewing && last ? [last.uci.slice(0, 2) as Key, last.uci.slice(2, 4) as Key] : undefined}
        check={!reviewing && boardChess.inCheck()}
        shapes={shapes}
        onMove={onBoardMove}
      />

      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <h4 className="text-xl font-bold tracking-[-0.01em]">Think you can beat me?</h4>
          <p className="mt-1 text-[14px] text-ink-mute">My bot plays like me.</p>
        </div>

        {view === "game" && !result && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {moves.length === 0 ? (
                <div className="inline-flex rounded-full border border-rule-strong p-0.5 text-[12.5px] font-medium">
                  {(["w", "b"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => c !== player && newGame(c)}
                      aria-pressed={player === c}
                      className={`rounded-full px-3 py-1 ${player === c ? "bg-ink text-paper" : "text-ink-mute hover:text-ink"}`}
                    >
                      {c === "w" ? "White" : "Black"}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[12.5px] text-ink-mute">You&apos;re {player === "w" ? "White" : "Black"}</span>
              )}
              <span className="flex items-center gap-2 text-[12.5px] text-ink-mute" aria-live="polite">
                <span className={`h-1.5 w-1.5 rounded-full ${yourTurn ? "bg-green" : "bg-rule-strong"}`} />
                {status}
              </span>
            </div>
            {pairs.length > 0 && (
              <ol className="grid max-h-[220px] grid-cols-[auto_1fr_1fr] content-start gap-x-4 gap-y-1 overflow-y-auto font-mono text-[12.5px]">
                {pairs.map(([w, b], i) => (
                  <li key={i} className="contents">
                    <span className="text-ink-mute">{i + 1}.</span>
                    <span>{w?.san ?? "…"}</span>
                    <span>{b?.san ?? ""}</span>
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-auto flex gap-2">
              {moves.length > 0 && (
                <button
                  type="button"
                  onClick={resign}
                  className="rounded-full border border-rule-strong px-4 py-1.5 text-[12.5px] font-semibold hover:border-ink"
                >
                  Resign
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-ink-mute hover:text-ink"
              >
                Close
              </button>
            </div>
          </>
        )}

        {view === "game" && result && (
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-2xl font-bold tracking-[-0.01em]" aria-live="polite">
              {HEADLINE[result.winner]}
            </p>
            <p className="text-[13.5px] text-ink-mute">
              {result.reason} after {Math.ceil(moves.length / 2)} moves.
            </p>
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setView("review");
                  setSelected(null);
                }}
                className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-paper"
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => newGame(player)}
                className="rounded-full border border-rule-strong px-4 py-1.5 text-[12.5px] font-semibold hover:border-ink"
              >
                Rematch
              </button>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-1 flex-col gap-3">
            {!analysisDone ? (
              <p className="text-[13.5px] text-ink-mute" aria-live="polite">
                Analysing… {analysed} of {fens.length} positions
              </p>
            ) : blunders.length === 0 ? (
              <p className="text-[13.5px] font-semibold">No blunders from either of us.</p>
            ) : (
              <p className="text-[13.5px] font-semibold">
                {blunders.length} {blunders.length === 1 ? "blunder" : "blunders"}: {yours} yours, {mine} mine
              </p>
            )}
            {analysisDone && blunders.length > 0 && (
              <ul className="flex max-h-[260px] flex-col divide-y divide-rule overflow-y-auto rounded-lg border border-rule">
                {blunders.map((b, i) => (
                  <li key={b.ply}>
                    <button
                      type="button"
                      onClick={() => setSelected(selected === i ? null : i)}
                      aria-pressed={selected === i}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-rule/30 ${selected === i ? "bg-rule/40" : ""}`}
                    >
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
                          b.color === player ? "bg-blue-soft text-blue-text" : "bg-green-soft text-green-text"
                        }`}
                      >
                        {b.color === player ? "you" : "my bot"}
                      </span>
                      <span className="font-mono text-[12.5px]">
                        {Math.floor(b.ply / 2) + 1}
                        {b.color === "w" ? ". " : "… "}
                        {b.san}
                      </span>
                      <span className="ml-auto font-mono text-[12px] text-ink-mute">
                        {formatEval(b.before)} → {formatEval(b.after)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[12px] leading-relaxed text-ink-mute">
              A blunder is a move that drops the eval by {BLUNDER_CP} centipawns or more, the same rule as my{" "}
              <a href={blunderRiskUrl} target="_blank" rel="noreferrer" className="underline">
                blunder-risk project
              </a>
              . Evals are Stockfish&apos;s, from the mover&apos;s side.
            </p>
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => newGame(player)}
                className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-paper"
              >
                Rematch
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-ink-mute hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <p className="font-mono text-[10.5px] text-ink-mute">
          Bot: {botName ?? "loading"} + my openings · Review: Stockfish 19 ·{" "}
          <a href="/engines/README.txt" className="underline">
            engines &amp; licences
          </a>
        </p>
      </div>
    </div>
  );
}
