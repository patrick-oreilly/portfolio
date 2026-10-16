import { references } from "@/lib/content";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#trajectory" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 sm:px-10">
        <span className="font-semibold tracking-[-0.01em]">Patrick O&rsquo;Reilly</span>
        <div className="hidden items-center gap-7 text-sm text-ink-mute md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={references.resume}
          download
          className="rounded-full border border-rule-strong px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
