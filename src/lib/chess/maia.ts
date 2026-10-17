// Turns a game into Maia's input planes, and Maia's policy back into moves.
// Pure functions with no runtime of their own: the browser feeds the planes
// to onnxruntime-web (see engines.ts), and the tests feed them to Node.
//
// Input is lc0's classical 112-plane format: 8 history positions x 13 planes
// (our P N B R Q K, their P N B R Q K, repetition), then 8 auxiliary planes.
// Every plane is drawn from the side to move's point of view, so for Black
// the board is mirrored top to bottom.

import { policySlot } from "./policy";

export const PLANES = 112;
const HISTORY = 8;
const PER_POSITION = 13;
const PIECE_ORDER = "pnbrqk";

type Side = "w" | "b";

/** The repetition-relevant part of a FEN: placement, side, castling, en passant. */
const positionKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

/**
 * Encodes the position after `fens.at(-1)`, using up to seven earlier
 * positions as history. `fens` is every position of the game so far, oldest
 * first, starting from the initial position.
 */
export function encodePlanes(fens: string[]): Float32Array {
  const planes = new Float32Array(PLANES * 64);
  const current = fens[fens.length - 1].split(" ");
  const us = current[1] as Side;
  const setPlane = (plane: number, value: number) => planes.fill(value, plane * 64, plane * 64 + 64);

  for (let i = 0; i < HISTORY; i++) {
    const idx = fens.length - 1 - i;
    if (idx < 0) break; // before the first move, history planes stay empty
    const fen = fens[idx];
    const base = i * PER_POSITION;
    const rows = fen.split(" ")[0].split("/");
    for (let row = 0; row < 8; row++) {
      let file = 0;
      for (const ch of rows[row]) {
        if (ch >= "1" && ch <= "8") {
          file += Number(ch);
          continue;
        }
        const white = ch === ch.toUpperCase();
        const ours = (white ? "w" : "b") === us;
        const rank = 7 - row; // FEN rows run from rank 8 down
        const r = us === "w" ? rank : 7 - rank;
        const plane = base + (ours ? 0 : 6) + PIECE_ORDER.indexOf(ch.toLowerCase());
        planes[plane * 64 + r * 8 + file] = 1;
        file++;
      }
    }
    const key = positionKey(fen);
    if (fens.slice(0, idx).some((earlier) => positionKey(earlier) === key)) setPlane(base + 12, 1);
  }

  const aux = HISTORY * PER_POSITION;
  const castling = current[2];
  const [ourK, ourQ, theirK, theirQ] = us === "w" ? ["K", "Q", "k", "q"] : ["k", "q", "K", "Q"];
  if (castling.includes(ourQ)) setPlane(aux + 0, 1);
  if (castling.includes(ourK)) setPlane(aux + 1, 1);
  if (castling.includes(theirQ)) setPlane(aux + 2, 1);
  if (castling.includes(theirK)) setPlane(aux + 3, 1);
  if (us === "b") setPlane(aux + 4, 1);
  setPlane(aux + 5, Number(current[4]) || 0); // halfmove clock, unscaled in this format
  // aux + 6 was lc0's old move-count plane and is always zero now.
  setPlane(aux + 7, 1);
  return planes;
}

/** Mirrors a UCI move top to bottom, which is how Black's moves look to Maia. */
function mirror(uci: string): string {
  const flip = (rank: string) => String(9 - Number(rank));
  return uci[0] + flip(uci[1]) + uci[2] + flip(uci[3]) + uci.slice(4);
}

export type MoveProbability = { uci: string; p: number };

/**
 * Softmax over the legal moves only, most likely first. `legalUci` are UCI
 * strings in real board coordinates for the side to move.
 */
export function legalMoveProbabilities(policy: Float32Array, legalUci: string[], side: Side): MoveProbability[] {
  const scored = legalUci
    .map((uci) => {
      const slot = policySlot(side === "w" ? uci : mirror(uci));
      return { uci, logit: slot >= 0 ? policy[slot] : -Infinity };
    })
    .filter((m) => Number.isFinite(m.logit));
  const max = Math.max(...scored.map((m) => m.logit));
  const exps = scored.map((m) => Math.exp(m.logit - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return scored.map((m, i) => ({ uci: m.uci, p: exps[i] / total })).sort((a, b) => b.p - a.p);
}

/**
 * Picks a move the way a person at this level might: from the most likely
 * moves covering `nucleus` of the probability, in proportion to how likely
 * each is. Always taking the top move would make every game identical; the
 * nucleus keeps the rare one-in-a-hundred oddities out.
 */
export function sampleMove(moves: MoveProbability[], random = Math.random, nucleus = 0.9): string {
  const kept: MoveProbability[] = [];
  let mass = 0;
  for (const m of moves) {
    kept.push(m);
    mass += m.p;
    if (mass >= nucleus) break;
  }
  let pick = random() * mass;
  for (const m of kept) {
    pick -= m.p;
    if (pick <= 0) return m.uci;
  }
  return kept[kept.length - 1].uci;
}
