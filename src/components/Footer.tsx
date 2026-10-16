import { references } from "@/lib/content";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-rule px-6 py-16 sm:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.01em]">Get in touch</h2>
            <p className="mt-2 max-w-[48ch] text-sm text-ink-mute">
              Always glad to talk shop: agentic AI, autonomous agents, applied ML.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a href={`mailto:${references.email}`} className="text-ink-mute transition-colors hover:text-ink">
              Email
            </a>
            <a href={references.github} target="_blank" rel="noreferrer" className="text-ink-mute transition-colors hover:text-ink">
              GitHub
            </a>
            <a href={references.linkedin} target="_blank" rel="noreferrer" className="text-ink-mute transition-colors hover:text-ink">
              LinkedIn
            </a>
            <a
              href={`mailto:${references.email}`}
              className="rounded-full bg-green px-5 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Say hello
            </a>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto mt-14 flex max-w-[1180px] flex-col gap-2 border-t border-rule pt-6 text-[12px] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Patrick O&rsquo;Reilly · Graduate Software Engineer</span>
        <span className="font-mono">GitHub · LinkedIn · Next.js · Tailwind</span>
      </div>
    </footer>
  );
}
