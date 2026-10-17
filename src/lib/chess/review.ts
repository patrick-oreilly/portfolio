// The post-game review: which moves were blunders, by the same rule as my
// chess-blunder-risk project. A move is a blunder when it drops the mover's
// engine evaluation by BLUNDER_CP centipawns or more.
//
// Evaluations are capped at +/-EVAL_CAP and a forced mate counts as the cap,
// so "mate in 3" is a large finite number rather than infinity, and a move
// from +15 to mate-in-3 isn't scored as losing ground.

export const BLUNDER_CP = 200;
export const EVAL_CAP = 1000;

/** Stockfish's view of a position, always from White's side, in centipawns. */
export type Evaluation = { cp: number; best: string | null };

export type PlayedMove = { san: string; uci: string; color: "w" | "b"; ply: number };

export type Blunder = PlayedMove & {
  /** Mover's evaluation before and after the move, in centipawns. */
  before: number;
  after: number;
  /** What the engine preferred in the position the move was played from. */
  best: string | null;
};

/** Converts a UCI `score` (from the side to move) into capped White-side cp. */
export function toWhiteCp(score: { cp?: number; mate?: number }, sideToMove: "w" | "b"): number {
  let cp: number;
  if (score.mate !== undefined) cp = score.mate > 0 ? EVAL_CAP : -EVAL_CAP;
  else cp = Math.max(-EVAL_CAP, Math.min(EVAL_CAP, score.cp ?? 0));
  return sideToMove === "w" ? cp : -cp;
}

/**
 * `evals[i]` is the evaluation of the position before `moves[i]`, so there is
 * one more evaluation than moves (the final position). Missing evaluations
 * (analysis not finished yet) are skipped rather than guessed.
 */
export function findBlunders(moves: PlayedMove[], evals: (Evaluation | undefined)[]): Blunder[] {
  const blunders: Blunder[] = [];
  moves.forEach((move, i) => {
    const pre = evals[i];
    const post = evals[i + 1];
    if (!pre || !post) return;
    const sign = move.color === "w" ? 1 : -1;
    const before = sign * pre.cp;
    const after = sign * post.cp;
    if (before - after >= BLUNDER_CP) blunders.push({ ...move, before, after, best: pre.best });
  });
  return blunders;
}

/** "+0.6", "−2.4": pawns, with a real minus sign. */
export function formatEval(cp: number): string {
  if (Math.abs(cp) >= EVAL_CAP) return cp > 0 ? "+M" : "−M";
  const pawns = (cp / 100).toFixed(1);
  return cp > 0 ? `+${pawns}` : cp < 0 ? `−${pawns.slice(1)}` : "0.0";
}
