import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "*",
          "Googlebot",
          "Google-Extended",
          "GoogleOther",
          "Google-CloudVertexBot",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://www.patrickoreilly.dev/sitemap.xml",
  };
}
