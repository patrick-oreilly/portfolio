"use client";

import { useEffect, useState } from "react";
import { meta, projects } from "@/lib/content";

const feed = projects.map((p) => ({ label: p.title, status: p.statusLabel }));

export default function StatusWidget() {
  const [time, setTime] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Dublin",
        })
      );
    tick();
    const clock = setInterval(tick, 1000);
    const rotate = setInterval(() => setIdx((i) => (i + 1) % feed.length), 3200);
    return () => {
      clearInterval(clock);
      clearInterval(rotate);
    };
  }, []);

  const current = feed[idx];

  return (
    <div className="w-full max-w-[340px] rounded-xl border border-rule bg-paper-raised shadow-sm">
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[11px] text-ink-mute">status</span>
        </div>
        <span className="font-mono text-[11px] text-ink-mute">
          {meta.location} {time ? `· ${time}` : ""}
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute">currently</div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-sm font-medium">AI Intern @ HPE</span>
        </div>

        <div className="mt-4 border-t border-rule pt-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute">record</div>
          <div key={idx} className="mt-1.5 text-sm">
            <span className="font-medium">{current.label}</span>
            <span className="text-ink-mute"> · {current.status}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-rule px-4 py-2.5 font-mono text-[10.5px] text-ink-mute">
        <span>rotating · 3.2s</span>
        <span>
          {idx + 1} / {feed.length}
        </span>
      </div>
    </div>
  );
}
