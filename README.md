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
src/app/globals.css      design tokens (light + dark), base styles
src/app/opengraph-image.tsx  generated 1200x630 share card
src/app/robots.ts        robots.txt
src/app/sitemap.ts       sitemap.xml
src/components/          one file per page section, plus the theme toggle
src/lib/content.ts       all page copy and project data
src/lib/theme.ts         theme storage key and palette
src/lib/boot.ts          the inline pre-paint script
content/copy.md          long-form source copy
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
diagrams; two projects are still in progress and deliberately carry no figure rather
than an invented one.

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
