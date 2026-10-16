import { toolkit } from "@/lib/content";
import Reveal from "./Reveal";

export default function Toolkit() {
  return (
    <section id="toolkit" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Toolkit</h2>
        </Reveal>
        <Reveal>
          <dl className="mt-10 border-t border-rule">
            {toolkit.map((group) => (
              <div
                key={group.label}
                className="flex flex-col gap-1.5 border-b border-rule py-4 sm:flex-row sm:gap-8"
              >
                <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute sm:w-[150px] sm:pt-1">
                  {group.label}
                </dt>
                <dd className="max-w-[80ch] text-[14px] leading-relaxed text-ink-soft">{group.items}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
