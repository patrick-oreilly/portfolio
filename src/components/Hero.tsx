import { meta, references } from "@/lib/content";
import StatusWidget from "./StatusWidget";

export default function Hero() {
  return (
    <header className="px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            {meta.kicker}
          </div>
          <h1 className="max-w-[16ch] text-[clamp(2.1rem,4.6vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
            {meta.headline}
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-mute">{meta.sub}</p>
          <p className="mt-7 flex items-center gap-2 text-[13px] text-ink-mute">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-text" />
            {meta.availability}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${references.email}`}
              className="rounded-full bg-green px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Say hello
            </a>
            <a
              href={references.resume}
              download
              className="rounded-full border border-rule-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Download CV
            </a>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <StatusWidget />
        </div>
      </div>
    </header>
  );
}
