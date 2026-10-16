import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Trajectory from "@/components/Trajectory";
import WorkSection from "@/components/WorkSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AboutSection />
        <Trajectory />
        <WorkSection />
      </main>
      <Footer />
    </>
  );
}
