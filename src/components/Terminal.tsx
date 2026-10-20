"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { projects, references, toolkit, trajectory } from "@/lib/content";
import { PLAY_EVENT } from "@/lib/chess/events";
import { setTheme } from "@/lib/theme";
import Reveal from "./Reveal";

type Entry = { id: number; kind: "cmd" | "out"; text: string };

const HELP_LINES = [
  "available commands:",
  "  help                 show this list",
  "  whoami               who am i",
  "  about                a short bio",
  "  experience           where i've worked and studied",
  "  projects, ls         list projects",
  "  cat <slug>           show details for one project",
  "  toolkit              languages, stack, practices",
  "  contact              how to reach me",
  "  cv                   download my cv",
  "  play                 play my chess bot",
  "  theme <light|dark>   switch theme",
  "  clear                clear the screen",
];

const QUICK_COMMANDS = ["help", "projects", "contact", "cv"];

function runCommand(raw: string, downloadCv: () => void): string[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);

  switch (cmd) {
    case "help":
      return HELP_LINES;
    case "whoami":
      return [
        "Hey, I'm Patrick. I'm 21 and in my final year of Computer Science at the University of Galway. I love building things and driving projects.",
        "I'm fascinated by AI as a technology and its potential positive applications on the world.",
        "I spend my time between work, college, running, meeting friends, and spending time with family.",
      ];
    case "about":
      return [
        "I think AI will change what's possible for a lot of people, so I keep up with it and throw myself into experimenting when something new comes out.",
        "This week I'm working on my final year project and college assignments.",
      ];
    case "experience":
      return trajectory.map((e) => `${e.org} — ${e.role} (${e.dates})`);
    case "projects":
    case "ls":
      return [
        ...projects.map((p) => `${p.slug.padEnd(26)}${p.statusLabel}`),
        "",
        "type 'cat <slug>' for details",
      ];
    case "cat": {
      const slug = args[0];
      if (!slug) return ["usage: cat <slug>. try 'projects' to list slugs."];
      const project = projects.find((p) => p.slug === slug);
      if (!project) return [`no project named "${slug}". try 'projects'.`];
      return [project.title, project.summary, project.link ?? ""].filter(Boolean);
    }
    case "toolkit":
      return toolkit.map((g) => `${g.label}: ${g.items}`);
    case "contact":
      return [
        `email     ${references.email}`,
        `github    ${references.github}`,
        `linkedin  ${references.linkedin}`,
      ];
    case "cv":
      downloadCv();
      return ["downloading cv..."];
    case "play":
      window.dispatchEvent(new Event(PLAY_EVENT));
      return ["opening the board... think you can beat me?"];
    case "theme": {
      const choice = args[0];
      if (choice === "light" || choice === "dark") {
        setTheme(choice);
        return [`theme set to ${choice}`];
      }
      return ["usage: theme <light|dark>"];
    }
    case "clear":
      return null;
    case "sudo":
      return ["permission denied: you're not root. try emailing me instead."];
    default:
      return [`command not found: ${cmd}. type 'help' for a list of commands.`];
  }
}

export default function Terminal() {
  const nextId = useRef(1);
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, kind: "out", text: "type 'help' to see what this does." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cvLinkRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  function submit(raw: string) {
    const output = runCommand(raw, () => cvLinkRef.current?.click());
    const cmdEntry: Entry = { id: nextId.current++, kind: "cmd", text: raw };

    if (output === null) {
      setEntries([]);
      setLiveMessage("screen cleared");
      return;
    }

    const outEntries: Entry[] = output.map((line) => ({ id: nextId.current++, kind: "out", text: line }));
    setEntries((prev) => [...prev, cmdEntry, ...outEntries]);
    setLiveMessage(output.join(" ").trim() || "ok");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = value;
    if (!raw.trim()) return;
    submit(raw);
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(null);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setValue(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(idx);
        setValue(history[idx]);
      }
    }
  }

  function runQuick(cmd: string) {
    submit(cmd);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(null);
    inputRef.current?.focus();
  }

  return (
    <section id="terminal" className="border-t border-rule px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">Poke around</h2>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
            A small shell for exploring this page. Type <code className="font-mono">help</code> to start.
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mx-auto mt-10 w-full max-w-[640px] overflow-hidden rounded-xl border border-rule bg-paper-raised shadow-sm">
            <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-ink-mute">patrick@portfolio</span>
            </div>

            <div
              ref={scrollRef}
              className="max-h-[280px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed"
            >
              {entries.map((entry) =>
                entry.kind === "cmd" ? (
                  <div key={entry.id} className="text-ink">
                    <span className="text-blue-text">$</span> {entry.text}
                  </div>
                ) : (
                  <div key={entry.id} className="whitespace-pre-wrap text-ink-mute">
                    {entry.text}
                  </div>
                )
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-rule px-4 py-3">
              <label htmlFor="terminal-input" className="sr-only">
                Terminal command input
              </label>
              <span className="font-mono text-[12.5px] text-blue-text">$</span>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="type a command..."
                className="min-w-0 flex-1 bg-transparent font-mono text-[16px] text-ink outline-none placeholder:text-ink-mute sm:text-[14px]"
              />
            </form>

            <div aria-live="polite" className="sr-only">
              {liveMessage}
            </div>
          </div>

          <div className="mx-auto mt-4 flex max-w-[640px] flex-wrap justify-center gap-2 sm:hidden">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => runQuick(cmd)}
                className="rounded-full border border-rule-strong px-3.5 py-1.5 text-[12.5px] font-medium text-ink-mute transition-colors hover:text-ink"
              >
                {cmd}
              </button>
            ))}
          </div>

          <a ref={cvLinkRef} href={references.resume} download className="hidden" aria-hidden tabIndex={-1} />
        </Reveal>
      </div>
    </section>
  );
}
