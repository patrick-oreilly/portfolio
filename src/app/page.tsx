import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import WorkSection, { MoreWorkSection } from "@/components/WorkSection";
import Trajectory from "@/components/Trajectory";
import Toolkit from "@/components/Toolkit";
import Terminal from "@/components/Terminal";
import Footer from "@/components/Footer";
import CardGlow from "@/components/CardGlow";

export default function Home() {
  return (
    <>
      <div aria-hidden className="scroll-progress" />
      <CardGlow />
      <Nav />
      <main id="main">
        <Hero />
        <AboutSection />
        <WorkSection />
        <Trajectory />
        <MoreWorkSection />
        <Toolkit />
        <Terminal />
      </main>
      <Footer />
    </>
  );
}
