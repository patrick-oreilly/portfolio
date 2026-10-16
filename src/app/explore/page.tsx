import type { Metadata } from "next";
import Constellation from "@/components/Constellation";

export const metadata: Metadata = {
  title: "Patrick O'Reilly — Explore",
  description: "An interactive 3D tour of Patrick O'Reilly's experience and projects.",
};

export default function ExplorePage() {
  return <Constellation />;
}
