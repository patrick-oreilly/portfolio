import { ViewTransition } from "react";
import { projects } from "@/lib/content";
import ChessCard from "./chess/ChessCard";
import ProjectCardBody, { type Project } from "./ProjectCardBody";
import Reveal from "./Reveal";

function ProjectCard({ p, delayMs }: { p: Project; delayMs: number }) {
  return (
    <Reveal delayMs={delayMs}>
      <article
        id={`project-${p.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-paper-raised scroll-mt-24"
      >
        <ProjectCardBody p={p} />
      </article>
    </Reveal>
  );
}

export default function WorkSection() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Featured projects</h2>
            <a
              href="#more-work"
              className="hidden shrink-0 rounded-full border border-rule-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink sm:block"
            >
              More work ↓
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} p={p} delayMs={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MoreWorkSection() {
  const moreWork = projects.filter((p) => !p.featured);

  return (
    <section id="more-work" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">More work</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-ink-mute">
                {moreWork.map((p, idx) => (
                  <span key={p.slug} className="inline-flex items-center gap-2">
                    {idx > 0 && <span aria-hidden>·</span>}
                    <a
                      href={`#project-${p.slug}`}
                      className="transition-colors hover:text-ink hover:underline"
                    >
                      {p.title}
                    </a>
                  </span>
                ))}
              </div>
            </div>
            <a
              href="https://github.com/patrick-oreilly"
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 rounded-full border border-rule-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink sm:block"
            >
              All repositories →
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {moreWork.map((p, i) =>
            p.slug === "chess-blunder-risk" ? (
              <ChessCard key={p.slug} p={p} delayMs={i * 60} />
            ) : (
              <ViewTransition key={p.slug} name={`card-${p.slug}`} default="none" update="card-slide">
                <ProjectCard p={p} delayMs={i * 60} />
              </ViewTransition>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
