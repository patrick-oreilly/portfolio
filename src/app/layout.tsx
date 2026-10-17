import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { bootScript } from "@/lib/boot";
import { THEME_COLORS } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.patrickoreilly.dev";
const siteDescription =
  "Patrick O'Reilly, graduate software engineer building agentic AI systems. Interning at HPE, with selected work in production AI and LLM evaluation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Patrick O'Reilly — Portfolio",
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Patrick O'Reilly",
    locale: "en_IE",
    title: "Patrick O'Reilly — Graduate Software Engineer",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick O'Reilly — Graduate Software Engineer",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Patrick O'Reilly",
  url: siteUrl,
  jobTitle: "Graduate Software Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Galway" },
  sameAs: [
    "https://github.com/patrick-oreilly",
    "https://www.linkedin.com/in/patrick-o-reilly-79a6662a9",
  ],
  knowsAbout: [
    "Agentic AI",
    "LLM engineering",
    "Multi-agent systems",
    "LangGraph",
    "Model Context Protocol",
    "Python",
    "Kubernetes",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {/* A plain inline tag, not next/script: that strategy ships the code inside the
            RSC payload, so it only runs once the client runtime is up. This has to
            execute while the parser is still working, before anything paints. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
