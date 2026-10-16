import { ImageResponse } from "next/og";

// next/og bundles Geist Regular, the same face the site renders in, so the card
// needs no font fetched at build time. Weight stays at 400: hierarchy here is
// carried by size and colour, not by a bold that would be synthesised.
export const alt =
  "Patrick O'Reilly — graduate software engineer building agentic AI workflows and production AI systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori has no radial-gradient, so the site's dot grid is tiled from an inline
// SVG instead.
const dotGrid =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><circle cx='1' cy='1' r='1' fill='%23e2e1dc'/></svg>\")";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          backgroundColor: "#fcfcfb",
          backgroundImage: dotGrid,
          backgroundRepeat: "repeat",
          color: "#16181d",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, letterSpacing: "-0.03em" }}>Patrick O&rsquo;Reilly</div>
          <div style={{ marginTop: 14, fontSize: 24, letterSpacing: "0.01em", color: "#2457e8" }}>
            Graduate Software Engineer · AI-Focused
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            color: "#3d4148",
            maxWidth: 920,
          }}
        >
          I build practical agentic workflows and production AI systems.
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 1, backgroundColor: "#d6d5ce" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
              fontSize: 20,
              letterSpacing: "0.06em",
              color: "#6b7078",
            }}
          >
            <span>patrickoreilly.dev</span>
            <span>Galway, Ireland</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
