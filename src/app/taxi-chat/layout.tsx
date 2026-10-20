import type { Metadata, Viewport } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./taxi-chat.css";

const description =
  "Ask plain-English questions about 1.79 billion NYC taxi and rideshare trips. Every number comes from a query you can inspect, and Taxi Chat declines anything it can't answer.";

export const metadata: Metadata = {
  title: "Taxi Chat — Patrick O'Reilly",
  description,
  alternates: { canonical: "/taxi-chat" },
  openGraph: {
    type: "website",
    url: "/taxi-chat",
    title: "Taxi Chat — Patrick O'Reilly",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Chat — Patrick O'Reilly",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
};

export default function TaxiChatLayout({ children }: LayoutProps<"/taxi-chat">) {
  return children;
}
