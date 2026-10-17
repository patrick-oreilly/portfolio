// Browser-only engine wrappers, loaded the first time someone presses Play.
//
// Maia (the bot) runs through onnxruntime-web. Its WebAssembly runtime is
// fetched from jsDelivr rather than this site, so a game costs the site only
// the 3.5 MB model. Single-threaded, so no cross-origin isolation headers.
//
// Stockfish (the review) is the single-threaded "lite" build in a Web Worker,
// served from /engines with its GPL licence beside it.

import * as ort from "onnxruntime-web/wasm";
import { encodePlanes, legalMoveProbabilities, PLANES, sampleMove } from "./maia";
import { toWhiteCp, type Evaluation } from "./review";

const ORT_VERSION = "1.30.0";
export const MAIA_LEVEL = 1500;
const ANALYSIS_DEPTH = 14;

/** Something that chooses the bot's move: Maia, or the Stockfish fallback. */
export type Bot = { name: string; pick: (fens: string[], legalUci: string[]) => Promise<string> };

export async function loadMaia(): Promise<Bot> {
  ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
  ort.env.wasm.numThreads = 1;
  const session = await ort.InferenceSession.create(`/engines/maia-${MAIA_LEVEL}.onnx`, {
    executionProviders: ["wasm"],
  });
  return {
    name: `Maia-${MAIA_LEVEL}`,
    async pick(fens, legalUci) {
      const input = new ort.Tensor("float32", encodePlanes(fens), [1, PLANES, 8, 8]);
      const output = await session.run({ "/input/planes": input });
      const policy = output["/output/policy"].data as Float32Array;
      const side = fens[fens.length - 1].split(" ")[1] as "w" | "b";
      return sampleMove(legalMoveProbabilities(policy, legalUci, side));
    },
  };
}

export type Stockfish = {
  /** Evaluates one position. Calls queue, so only one search runs at a time. */
  analyse: (fen: string, depth?: number) => Promise<Evaluation>;
  dispose: () => void;
};

/**
 * `limitElo` turns on Stockfish's own strength limit (its floor is 1320), for
 * the fallback bot used when Maia can't run. Analysis uses an unlimited one.
 */
export function loadStockfish({ limitElo }: { limitElo?: number } = {}): Promise<Stockfish> {
  const worker = new Worker("/engines/stockfish-19-lite-single.js");
  let onLine: (line: string) => void = () => {};
  worker.onmessage = (e: MessageEvent<string>) => onLine(String(e.data));

  let queue: Promise<unknown> = Promise.resolve();

  const analyse = (fen: string, depth = ANALYSIS_DEPTH) => {
    const run = () =>
      new Promise<Evaluation>((resolve) => {
        const sideToMove = fen.split(" ")[1] as "w" | "b";
        let score: { cp?: number; mate?: number } = {};
        onLine = (line) => {
          // Only the main line's score; deeper lines overwrite shallower ones.
          const m = line.match(/^info .*\bdepth \d+.*\bscore (cp|mate) (-?\d+)/);
          if (m && !/\bmultipv [2-9]/.test(line)) score = m[1] === "cp" ? { cp: Number(m[2]) } : { mate: Number(m[2]) };
          const best = line.match(/^bestmove (\S+)/);
          if (best) {
            resolve({ cp: toWhiteCp(score, sideToMove), best: best[1] === "(none)" ? null : best[1] });
          }
        };
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
      });
    const result = queue.then(run);
    queue = result.catch(() => {});
    return result;
  };

  return new Promise((resolve) => {
    onLine = (line) => {
      if (line === "readyok") resolve({ analyse, dispose: () => worker.terminate() });
    };
    worker.postMessage("uci");
    if (limitElo) {
      worker.postMessage("setoption name UCI_LimitStrength value true");
      worker.postMessage(`setoption name UCI_Elo value ${limitElo}`);
    }
    worker.postMessage("isready");
  });
}

/** Maia if this browser can run it, otherwise Stockfish held to about 1320. */
export async function loadBot(): Promise<Bot> {
  try {
    return await loadMaia();
  } catch {
    const weak = await loadStockfish({ limitElo: 1320 });
    return {
      name: "Stockfish, limited",
      async pick(fens, legalUci) {
        const { best } = await weak.analyse(fens[fens.length - 1], 8);
        return best ?? legalUci[0];
      },
    };
  }
}
