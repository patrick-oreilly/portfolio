// Builds src/app/opengraph-image.jpg, the card shown when the site is shared.
//
//   node scripts/build-share-image.mjs
//
// It's a static JPEG rather than an opengraph-image.tsx route because a photo
// card comes out of next/og as a ~800 KB PNG, and WhatsApp drops previews whose
// image is over roughly 300 KB.
//
// The fonts in scripts/share-image/ are Geist Bold with its GPOS (kerning) table
// stripped, because Satori misapplies Geist's kerning and leaves some word gaps
// far wider than others, and Geist Mono Medium. Satori can't read woff2.

import { readFileSync, writeFileSync } from "node:fs";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";

const W = 1200;
const H = 630;
const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root));

// Crop of the speaking photo that puts me left of centre at a size that still
// reads as a thumbnail. Coordinates are in the 5712×4284 original.
const photo = await sharp(read("public/about/speaking.jpg"))
  .extract({ left: 666, top: 1238, width: 4570, height: 2399 })
  .resize(W, H)
  .jpeg({ quality: 90 })
  .toBuffer();

const box = (style, ...children) => h("div", { style: { display: "flex", ...style } }, ...children);
const dot = (color) => box({ width: 10, height: 10, borderRadius: 99, backgroundColor: color });
const mono = (color, ...children) =>
  box({ alignItems: "center", gap: 12, fontFamily: "Geist Mono", fontSize: 18, color }, ...children);

const card = box(
  {
    width: W,
    height: H,
    backgroundImage: `url(data:image/jpeg;base64,${photo.toString("base64")})`,
    backgroundSize: `${W}px ${H}px`,
  },
  // The right side must end fully opaque: the slide behind it has an HPE
  // "Confidential" footer that can't show through, even faintly.
  box({
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: H,
    backgroundImage:
      "linear-gradient(90deg, rgba(15,17,20,0) 0%, rgba(15,17,20,0) 33%, rgba(15,17,20,0.92) 43%, rgba(15,17,20,1) 48%)",
  }),
  box(
    { position: "absolute", top: 0, left: 636, width: 508, height: H, flexDirection: "column", justifyContent: "center", gap: 28 },
    mono("#b9bec6", dot("#3a68f0"), "Final-Year CS Student · University of Galway"),
    box(
      { fontFamily: "Geist", fontWeight: 700, fontSize: 64, lineHeight: 1, letterSpacing: "-0.03em", color: "#f0f0ee" },
      "Patrick O’Reilly"
    ),
    mono("#4ec08d", dot("#4ec08d"), "Part-time at HPE now · grad roles Sept 2027"),
    box({ height: 1, backgroundColor: "#383d45", marginTop: 6 }),
    mono("#8d939c", "patrickoreilly.dev")
  )
);

const png = await new ImageResponse(card, {
  width: W,
  height: H,
  fonts: [
    { name: "Geist", data: read("scripts/share-image/Geist-Bold-nokern.ttf"), weight: 700, style: "normal" },
    { name: "Geist Mono", data: read("scripts/share-image/GeistMono-Medium.woff"), weight: 500, style: "normal" },
  ],
}).arrayBuffer();

const jpg = await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
writeFileSync(new URL("src/app/opengraph-image.jpg", root), jpg);
console.log(`wrote src/app/opengraph-image.jpg (${Math.round(jpg.length / 1024)} KB)`);
