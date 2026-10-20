import { trajectory } from "@/lib/content";
import Reveal from "./Reveal";

export default function Trajectory() {
  return (
    <section id="trajectory" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Experience</h2>
        </Reveal>

        <div className="relative mt-12 flex flex-col gap-10">
          <div aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-rule-strong" />
          {trajectory.map((entry, i) => (
            <Reveal key={entry.id} delayMs={i * 70}>
              <div className="relative pl-9">
                <span
                  className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                    entry.current ? "border-green-text bg-green-soft" : "border-rule-strong bg-paper"
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold">{entry.org}</span>
                  <span className="text-ink-mute">· {entry.role}</span>
                  {entry.current && (
                    <span className="rounded-full bg-green-soft px-2 py-0.5 text-[11px] font-medium text-green-text">
                      current
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[12px] text-ink-mute">{entry.dates}</span>
                </div>
                <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-ink-mute">{entry.summary}</p>
                {entry.bullets && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {entry.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-rule-strong" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.stack && (
                  <div className="mt-2.5 font-mono text-[11.5px] text-ink-mute">{entry.stack}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
