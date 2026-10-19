import { references } from "@/lib/content";
import Reveal from "./Reveal";

// 44px minimum hit area: these are the conversion actions and recruiters triage on phones.
const contactLink =
  "inline-flex min-h-11 items-center px-2 text-ink-mute transition-colors hover:text-ink";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-rule px-6 py-16 sm:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.01em]">Get in touch</h2>
            <p className="mt-2 max-w-[48ch] text-sm text-ink-mute">
              Always happy for a chat. If something here caught your eye, say hello.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a href={`mailto:${references.email}`} className={contactLink}>
              Email
            </a>
            <a href={references.github} target="_blank" rel="noreferrer" className={contactLink}>
              GitHub
            </a>
            <a href={references.linkedin} target="_blank" rel="noreferrer" className={contactLink}>
              LinkedIn
            </a>
            <a
              href={`mailto:${references.email}`}
              className="rounded-full bg-green px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Say hello
            </a>
          </div>
        </div>
      </Reveal>
      <div className="mx-auto mt-14 flex max-w-[1180px] flex-col gap-2 border-t border-rule pt-6 text-[12px] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Patrick O&rsquo;Reilly · Final-Year CS Student</span>
        <span className="font-mono">GitHub · LinkedIn · Next.js · Tailwind</span>
      </div>
    </footer>
  );
}
