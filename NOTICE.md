# Licensing

**Code** in this repository is licensed under the GNU General Public License,
version 3 or later. See [LICENSE](LICENSE). The site bundles GPL-3 software
(chessground, Stockfish in a Web Worker, and the Maia network), so its code is
offered under the same terms.

**Content is not covered by that licence.** My CV, the written copy (including
`src/lib/content.ts`), photos and other images, and my opening book
(`src/lib/chess/opening-book.json`, derived from my own games) are
© Patrick O'Reilly, all rights reserved.

## Third-party components

| Component | Licence | Source |
| --- | --- | --- |
| chessground | GPL-3.0-or-later | https://github.com/lichess-org/chessground |
| Stockfish 19 (stockfish.js lite build) | GPL-3.0 | https://github.com/official-stockfish/Stockfish, https://github.com/nmrugg/stockfish.js |
| Maia chess (1500 network, ONNX export) | GPL-3.0 (weights and code) | https://github.com/CSSLab/maia-chess, https://huggingface.co/spaces/lczerolens/backends-demo |
| chess.js | BSD-2-Clause | https://github.com/jhlywa/chess.js |
| onnxruntime-web | MIT | https://github.com/microsoft/onnxruntime |

Engine files and their notices are in [`public/engines/`](public/engines/README.txt).

## Copyright notices

- **chessground** — Copyright © Thibault Duplessis and contributors.
- **Stockfish 19 / stockfish.js** — Copyright © the Stockfish developers (see the AUTHORS file in the Stockfish repository); the stockfish.js build is © 2026 Chess.com, LLC.
- **Maia** — © the Maia authors: Reid McIlroy-Young, Siddhartha Sen, Jon Kleinberg and Ashton Anderson.
- **chess.js** — Copyright © 2025 Jeff Hlywa.
- **onnxruntime-web** — Copyright © Microsoft Corporation.

The GPL-3.0 text is in [LICENSE](LICENSE); Stockfish's copy is also in
[`public/engines/STOCKFISH-COPYING.txt`](public/engines/STOCKFISH-COPYING.txt).
The BSD-2-Clause and MIT terms are those published by the chess.js and
onnxruntime projects.
