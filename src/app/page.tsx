import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Trajectory from "@/components/Trajectory";
import WorkSection from "@/components/WorkSection";
import Toolkit from "@/components/Toolkit";
import Terminal from "@/components/Terminal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <AboutSection />
        <Trajectory />
        <WorkSection />
        <Toolkit />
        <Terminal />
      </main>
      <Footer />
    </>
  );
}
