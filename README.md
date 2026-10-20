# patrickoreilly.dev

Personal portfolio for Patrick O'Reilly — graduate software engineer, AI-focused.
Live at [patrickoreilly.dev](https://www.patrickoreilly.dev).

A single-page site: one page of evidence for recruiters and hiring managers who are
scanning fast and deciding whether to move to a screen.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · deployed on Vercel.

The stack is a deliberate choice rather than a default — the site itself is meant to
demonstrate the stack.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Layout

```
src/app/layout.tsx       metadata, viewport colours, Person structured data
src/app/page.tsx         section order
src/app/taxi-chat/       live Taxi Chat route (ported frontend + scoped CSS)
src/app/api/taxi-chat/   SSE and stats proxies to the FastAPI service
src/app/globals.css      design tokens (light + dark), base styles
src/app/opengraph-image.tsx  generated 1200x630 share card
src/app/robots.ts        robots.txt
src/app/sitemap.ts       sitemap.xml
src/components/          one file per page section, plus the theme toggle
src/components/taxi-chat/  Taxi Chat conversation, map, trace and charts
src/lib/content.ts       all page copy and project data
src/lib/taxi-chat.ts     backend URL and SSE error helpers
src/lib/theme.ts         theme storage key and palette
src/lib/boot.ts          the inline pre-paint script
content/copy.md          long-form source copy
public/taxi-chat/        taxi zone geometry and the MapLibre worker
public/                  resume PDF, photos, project figures
```

## Progressive enhancement

Most of the page sits inside a `Reveal` wrapper, which animates content in on
scroll. That hidden state is gated behind a `.js` class on `<html>`, and nothing in
the page is hidden without it — so a visitor whose JavaScript never arrives still
gets the whole page as plain content rather than a blank scroll below the hero.

[boot.ts](src/lib/boot.ts) is a plain inline `<script>`, the first thing in `<body>`,
so it runs while the parser is still working: it restores a stored theme, marks
`<html>` as scriptable, and withdraws that mark after three seconds if React never
turns up. [Reveal](src/components/Reveal.tsx) sets `window.__revealReady` on mount to
cancel the withdrawal.

## Editing content

Page copy lives in [src/lib/content.ts](src/lib/content.ts) — hero, About, experience
entries, and the six projects. Contact links and the resume path are in the same file
under `references`. The project figures in `public/projects/` are real screenshots and
diagrams; the chess card shows a playable game instead of a figure, and the FYP card
has its architecture diagram.

## Chess bot

The chess card opens a game against a bot that plays my opening repertoire and then
Maia-1500 in the browser via onnxruntime-web. After the game, Stockfish 19 reviews
both sides for blunders. The engines live in `public/engines/` and nothing loads until
Play is pressed; the opening book is built from my rated rapid games by
`scripts/build-opening-book.mjs`.

The code is GPL-3.0-or-later, because chessground, Stockfish and Maia are GPL. The
site's written content, images and opening book are not; see [NOTICE.md](NOTICE.md).

## Taxi Chat demo

`/taxi-chat` is the live interface for the separate
[taxi-chat](https://github.com/patrick-oreilly/taxi-chat) service. It is a
client-side port of that project's Vite frontend; the zone geometry and the
MapLibre worker live in [public/taxi-chat/](public/taxi-chat/).

The browser only talks to this site. Two Route Handlers proxy to the FastAPI
backend:

- `/api/taxi-chat/ask` forwards the server-sent events from `/api/ask`
- `/api/taxi-chat/stats` reads `/api/stats`

Set `TAXI_CHAT_API_URL` to the backend's base URL (for example
`https://taxi-chat.example.com`). In development it defaults to
`http://127.0.0.1:8000`, so the local setup is:

```bash
# terminal 1
cd ../taxi-chat
uv run --env-file .env uvicorn taxichat.server:app

# terminal 2
cd ../portfolio
npm run dev
```

Production must set `TAXI_CHAT_API_URL`; without it the page still renders but
asks return a connection error. The Taxi Chat README covers the Docker and
Fly.io deployment, including the DuckDB data volume.

## Theming

Colours are CSS custom properties in [src/app/globals.css](src/app/globals.css),
each declared once as `light-dark(light, dark)`. With no `data-theme` on `<html>`
they resolve against the OS preference, so that case is correct at first paint with
no script at all — including the initial canvas colour, which is what stops a white
flash on a dark-preferring device.

A stored choice only has to override `color-scheme` on `<html>`:
[boot.ts](src/lib/boot.ts) restores it before the parser reaches the page content,
and [ThemeToggle](src/components/ThemeToggle.tsx) flips it and writes the choice back
to `localStorage`. The toggle's icon is chosen in CSS from the same rules, so its
markup is identical on the server and after hydration.

Accents come in pairs: a solid fill (`--blue`, `--green`) for buttons, and a
`--*-text` token for text sitting on the matching `--*-soft` surface. Because the
text tokens are re-derived per mode, both accents clear 4.5:1 against whatever they
actually appear on. Change a token, not a component.
