const SPECIALISTS = [
  "Architecture",
  "Code quality",
  "Testing",
  "Performance",
  "Usability",
  "Accessibility",
  "Documentation",
];

export default function FypArchitectureDiagram() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-3 bg-white px-6 py-8">
      <div className="rounded-md border border-rule-strong bg-paper px-4 py-2 font-mono text-[11px] text-ink-mute">
        buggy submission
      </div>
      <div className="h-6 w-px bg-rule-strong" />
      <div className="flex flex-wrap justify-center gap-2">
        {SPECIALISTS.map((s) => (
          <div
            key={s}
            className="rounded-md border border-rule-strong bg-paper px-3 py-1.5 font-mono text-[10.5px] text-ink-mute"
          >
            {s}
          </div>
        ))}
      </div>
      <div className="h-6 w-px bg-rule-strong" />
      <div className="rounded-md border border-rule-strong bg-paper px-4 py-2 font-mono text-[11px] text-ink-mute">
        coordinator agent
      </div>
      <div className="h-6 w-px bg-rule-strong" />
      <div className="rounded-md border border-green-text bg-green-soft px-4 py-2 font-mono text-[11px] font-medium text-green-text">
        diagnosis
      </div>
    </div>
  );
}
