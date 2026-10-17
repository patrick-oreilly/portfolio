// Builds src/lib/chess/opening-book.json from my Chess.com game archives.
//
//   node scripts/build-opening-book.mjs <dir of monthly archive .json files>
//
// The archives are the raw Published-Data API downloads kept (uncommitted) in
// the chess-blunder-risk project. Same scope as that project: rated rapid
// games of standard chess. For every position I faced in my first BOOK_MOVES
// moves, it keeps each move I played there at least MIN_PLAYS times, with its
// count, so the bot can pick among them in proportion.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Chess } from "chess.js";

const USERNAME = "patrickoreilly2";
const BOOK_MOVES = 8;
const MIN_PLAYS = 3;
const OUT = new URL("../src/lib/chess/opening-book.json", import.meta.url);

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node scripts/build-opening-book.mjs <archive dir>");
  process.exit(1);
}

// Must match positionKey in src/lib/chess/book.ts.
const positionKey = (fen) => fen.split(" ").slice(0, 4).join(" ");

const counts = new Map(); // position key -> Map(uci -> plays)
let games = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const { games: archive } = JSON.parse(readFileSync(join(dir, file), "utf8"));
  for (const g of archive) {
    if (!g.rated || g.rules !== "chess" || g.time_class !== "rapid") continue;
    const myColour = g.white.username.toLowerCase() === USERNAME ? "w" : g.black.username.toLowerCase() === USERNAME ? "b" : null;
    if (!myColour) continue;

    const parsed = new Chess();
    try {
      parsed.loadPgn(g.pgn);
    } catch {
      continue;
    }
    const moves = parsed.history({ verbose: true });
    if (moves.length === 0) continue; // abandoned before the first move
    games++;

    for (const m of moves.slice(0, BOOK_MOVES * 2)) {
      if (m.color !== myColour) continue;
      const key = positionKey(m.before);
      const uci = m.from + m.to + (m.promotion ?? "");
      if (!counts.has(key)) counts.set(key, new Map());
      const here = counts.get(key);
      here.set(uci, (here.get(uci) ?? 0) + 1);
    }
  }
}

const book = {};
for (const [key, moves] of counts) {
  const kept = [...moves].filter(([, n]) => n >= MIN_PLAYS).sort((a, b) => b[1] - a[1]);
  if (kept.length) book[key] = kept;
}

writeFileSync(OUT, JSON.stringify(book));
console.log(`${games} games -> ${Object.keys(book).length} book positions`);
