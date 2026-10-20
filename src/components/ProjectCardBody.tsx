import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { projects } from "@/lib/content";
import DemoVideo from "./DemoVideo";
import FypArchitectureDiagram from "./FypArchitectureDiagram";

export type Project = (typeof projects)[number];

const INLINE_LINK = /\[([^\]]+)\]\(((?:https?:\/\/|#)[^)\s]+)\)/g;

/** Body paragraphs are plain text, except `[text](https://…)` or `[text](#…)` becomes a link. */
function withLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const href = match[2];
    const isExternal = href.startsWith("http");
    parts.push(text.slice(last, match.index));
    parts.push(
      <a
        key={match.index}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="font-medium text-ink underline decoration-rule-strong transition-colors hover:decoration-ink"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

/**
 * A card's figure and text. `actions` adds buttons before the links;
 * `hideEmptyFigure` drops the default figure strip for cards that bring
 * something else to show.
 */
export default function ProjectCardBody({
  p,
  actions,
  hideEmptyFigure = false,
}: {
  p: Project;
  actions?: ReactNode;
  hideEmptyFigure?: boolean;
}) {
  return (
    <>
      {p.video ? (
        <DemoVideo {...p.video} />
      ) : p.images?.length ? (
        <div
          className={`grid gap-px border-b border-rule bg-rule ${
            p.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {p.images.map((img) => (
            <div key={img.src} className="relative aspect-[16/10] bg-white">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={p.slug === "chess-coach" ? "object-cover object-top" : "object-contain p-2"}
                sizes="(min-width: 768px) 560px, 100vw"
              />
            </div>
          ))}
        </div>
      ) : p.slug === "fyp-multi-agent-diagnosis" ? (
        <FypArchitectureDiagram />
      ) : hideEmptyFigure ? null : (
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
        <h3 className="text-lg font-bold leading-snug tracking-[-0.01em] sm:text-xl">{p.title}</h3>
        {p.question && (
          <p className="text-[15px] font-medium leading-snug text-ink">{p.question}</p>
        )}
        <p className="text-[14px] leading-relaxed text-ink-mute">{p.summary}</p>
        {p.body?.map((para) => (
          <p key={para.slice(0, 24)} className="text-[13.5px] leading-relaxed text-ink-soft">
            {withLinks(para)}
          </p>
        ))}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="font-mono text-[11px] text-ink-mute">{p.stack}</div>
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            {p.demo &&
              (p.demo.href.startsWith("/") ? (
                <Link
                  href={p.demo.href}
                  className="rounded-full bg-blue px-4 py-1.5 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  {p.demo.label}
                </Link>
              ) : (
                <a
                  href={p.demo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-blue px-4 py-1.5 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  {p.demo.label}
                </a>
              ))}
            {p.secondaryLink && (
              <a
                href={p.secondaryLink.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-rule-strong px-4 py-1.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-ink"
              >
                {p.secondaryLink.label}
              </a>
            )}
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
      </div>
    </>
  );
}
