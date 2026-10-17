// Leela Chess Zero's 1858-move policy layout, which Maia's network outputs.
// Moves are written from the side to move's point of view (as if White), in
// lc0's order: every from-square a1..h8, and for each, every queen-line or
// knight destination in square order; then the 66 under/over-promotions
// (q, r, b for each of the 22 seventh-to-eighth-rank moves). A knight
// promotion uses the plain move, so it has no entry of its own.

const FILES = "abcdefgh";
const sq = (file: number, rank: number) => `${FILES[file]}${rank + 1}`;

function buildPolicyIndex(): string[] {
  const moves: string[] = [];
  for (let from = 0; from < 64; from++) {
    const f0 = from % 8;
    const r0 = Math.floor(from / 8);
    for (let to = 0; to < 64; to++) {
      if (to === from) continue;
      const df = (to % 8) - f0;
      const dr = Math.floor(to / 8) - r0;
      const queenLine = df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr);
      const knight = (Math.abs(df) === 1 && Math.abs(dr) === 2) || (Math.abs(df) === 2 && Math.abs(dr) === 1);
      if (queenLine || knight) moves.push(sq(f0, r0) + sq(to % 8, Math.floor(to / 8)));
    }
  }
  for (let file = 0; file < 8; file++) {
    for (const df of [-1, 0, 1]) {
      const toFile = file + df;
      if (toFile < 0 || toFile > 7) continue;
      for (const piece of "qrb") moves.push(sq(file, 6) + sq(toFile, 7) + piece);
    }
  }
  return moves;
}

export const POLICY_INDEX = buildPolicyIndex();

const POLICY_LOOKUP = new Map(POLICY_INDEX.map((move, i) => [move, i]));

/** Policy slot for a UCI move already written from the mover's side, or -1. */
export function policySlot(uci: string): number {
  // Knight promotions share the plain move's slot.
  const key = uci.length === 5 && uci[4] === "n" ? uci.slice(0, 4) : uci;
  return POLICY_LOOKUP.get(key) ?? -1;
}
