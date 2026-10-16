import { meta } from "@/lib/content";
import StatusWidget from "./StatusWidget";

export default function Hero() {
  return (
    <header className="px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            {meta.kicker}
          </div>
          <h1 className="max-w-[16ch] text-[clamp(2.1rem,4.6vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
            {meta.headline}
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-mute">{meta.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              View the work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-rule-strong px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              Get in touch
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
