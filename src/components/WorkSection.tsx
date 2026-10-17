import { ViewTransition } from "react";
import { projects } from "@/lib/content";
import ChessCard from "./chess/ChessCard";
import ProjectCardBody, { type Project } from "./ProjectCardBody";
import Reveal from "./Reveal";

function ProjectCard({ p, delayMs }: { p: Project; delayMs: number }) {
  return (
    <Reveal delayMs={delayMs} className={p.featured ? "md:col-span-2" : ""}>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-paper-raised">
        <ProjectCardBody p={p} />
      </article>
    </Reveal>
  );
}

export default function WorkSection() {
  const shipped = projects.filter((p) => p.status === "complete");
  const ongoing = projects.filter((p) => p.status === "in-progress");

  return (
    <section id="work" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Selected work</h2>
            <a
              href="https://github.com/patrick-oreilly"
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 rounded-full border border-rule-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink sm:block"
            >
              All projects →
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {shipped.map((p, i) => (
            <ProjectCard key={p.slug} p={p} delayMs={i * 60} />
          ))}
        </div>

        {ongoing.length > 0 && (
          <>
            <Reveal>
              <div className="mb-6 mt-14 flex items-center gap-2 text-[13px] font-medium text-ink-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                Ongoing research &amp; final year work
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {ongoing.map((p, i) =>
                p.slug === "chess-blunder-risk" ? (
                  <ChessCard key={p.slug} p={p} delayMs={i * 60} />
                ) : (
                  // Named so it slides when the chess card above opens or closes.
                  <ViewTransition key={p.slug} name={`card-${p.slug}`} default="none" update="card-slide">
                    <ProjectCard p={p} delayMs={i * 60} />
                  </ViewTransition>
                ),
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
