// My opening repertoire, built from my own rapid games by
// scripts/build-opening-book.mjs. Maps a position to the moves I've played
// there at least three times, with how often.

export type OpeningBook = Record<string, [uci: string, plays: number][]>;

/** Placement, side to move, castling and en passant: what makes positions equal. */
export const positionKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

/** A move I'd play here, chosen in proportion to how often I have, or null. */
export function bookMove(book: OpeningBook, fen: string, random = Math.random): string | null {
  const moves = book[positionKey(fen)];
  if (!moves) return null;
  const total = moves.reduce((sum, [, plays]) => sum + plays, 0);
  let pick = random() * total;
  for (const [uci, plays] of moves) {
    pick -= plays;
    if (pick <= 0) return uci;
  }
  return moves[moves.length - 1][0];
}
