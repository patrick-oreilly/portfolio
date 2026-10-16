import Image from "next/image";
import { about } from "@/lib/content";
import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-rule px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-rule-strong sm:h-44 sm:w-44">
              <Image
                src="/about/headshot.png"
                alt="Patrick O'Reilly"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 176px, 128px"
              />
            </div>
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">{about.body}</p>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-14 border-t border-rule pt-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[40ch]">
                <div className="mb-3 flex items-center gap-2 text-[13px] font-medium text-ink-mute">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                  Public speaking
                </div>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  I recently gave a tech talk to 100+ students at ATU on what I've learned at HPE.
                </p>
              </div>
              <div className="w-full shrink-0 sm:w-[420px]">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-rule-strong">
                  <Image
                    src="/about/speaking.jpg"
                    alt="Patrick O'Reilly giving a tech talk to 100+ students at ATU"
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 420px, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
