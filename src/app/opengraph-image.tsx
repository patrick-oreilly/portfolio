import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { meta } from "@/lib/content";

// Copy comes from the same `meta` the hero renders, so the card can't drift from
// the page. Geist Bold and Geist Mono are vendored because the Regular that next/og
// bundles has no bold to match the h1 (and Satori can't read woff2). The bold has
// its GPOS table stripped: Satori misapplies Geist's kerning and leaves some word
// gaps up to 60% wider than others.
export const alt = `Patrick O'Reilly — ${meta.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src/app/_og");
const geistBold = readFile(join(fontDir, "Geist-Bold-nokern.ttf"));
const geistMono = readFile(join(fontDir, "GeistMono-Medium.woff"));

// Satori has no radial-gradient, so the site's dot grid is tiled from an inline
// SVG instead.
const dotGrid =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><circle cx='1' cy='1' r='1' fill='%23e2e1dc'/></svg>\")";

const dot = (color: string) => (
  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: color }} />
);

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px 64px",
          backgroundColor: "#fcfcfb",
          backgroundImage: dotGrid,
          backgroundRepeat: "repeat",
          color: "#16181d",
          borderTop: "10px solid #2457e8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: "0.02em",
            color: "#6b7078",
          }}
        >
          {dot("#2457e8")}
          {meta.kicker}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontWeight: 700,
            fontSize: 74,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 940,
          }}
        >
          {meta.headline}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 1, backgroundColor: "#d6d5ce" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontFamily: "Geist", fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em" }}>
                Patrick O&rsquo;Reilly
              </span>
              <span style={{ fontFamily: "Geist Mono", fontSize: 20, color: "#6b7078" }}>
                patrickoreilly.dev
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "Geist Mono",
                fontSize: 20,
                color: "#0b7a50",
              }}
            >
              {dot("#0b7a50")}
              Open to grad roles · Sept 2027
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: await geistBold, weight: 700, style: "normal" },
        { name: "Geist Mono", data: await geistMono, weight: 500, style: "normal" },
      ],
    }
  );
}
