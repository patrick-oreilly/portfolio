import Image from "next/image";
import { projects } from "@/lib/content";
import Reveal from "./Reveal";

function ProjectCard({ p, delayMs }: { p: (typeof projects)[number]; delayMs: number }) {
  return (
    <Reveal delayMs={delayMs} className={p.featured ? "md:col-span-2" : ""}>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-paper-raised">
        {p.images?.length ? (
          <div className={`grid gap-px bg-rule ${p.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {p.images.map((img) => (
              <div key={img.src} className="relative aspect-[16/10] bg-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-14 items-center justify-center border-b border-rule bg-rule/20">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
              No figure yet · in progress
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">{p.kicker}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                p.status === "complete" ? "bg-green-soft text-green-text" : "bg-blue-soft text-blue-text"
              }`}
            >
              {p.statusLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
          <p className="text-[14px] leading-relaxed text-ink-mute">{p.summary}</p>
          {p.body?.map((para) => (
            <p key={para.slice(0, 24)} className="text-[13.5px] leading-relaxed text-ink-soft">
              {para}
            </p>
          ))}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="font-mono text-[11px] text-ink-mute">{p.stack}</div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                Code →
              </a>
            )}
          </div>
        </div>
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
              {ongoing.map((p, i) => (
                <ProjectCard key={p.slug} p={p} delayMs={i * 60} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
