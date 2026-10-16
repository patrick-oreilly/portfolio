import Image from "next/image";
import { about } from "@/lib/content";
import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-rule px-6 py-16 sm:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-8 sm:flex-row sm:items-center">
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
    </section>
  );
}
