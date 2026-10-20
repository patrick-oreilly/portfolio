"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Icon } from "./Icon";
import { CompareBars, Histogram, TrendChart } from "./InlineChart";
import type { Turn } from "./types";

const SUGGESTIONS = [
  "What were the 5 busiest pickup zones in January 2024?",
  "How did daily Uber trips change through January 2024?",
  "Uber vs Lyft average fare in January 2024?",
  "What share of yellow cab trips in January 2024 were under 2 miles?",
  "Will fares go up next year?",
];

const PROGRESS: Record<string, string> = {
  classified: "Resolving dates and places…",
  resolved: "Running the query…",
  queried: "Writing the answer…",
  checked: "Checking every number…",
};

function format(unit: string | undefined, value: number) {
  if (unit === "usd") return `$${value.toFixed(2)}`;
  if (unit === "miles") return `${value.toFixed(2)} mi`;
  if (unit === "minutes") return `${value.toFixed(1)} min`;
  return Math.round(value).toLocaleString("en-US");
}

function Answer({ turn }: { turn: Turn }) {
  const result = turn.trace?.result;
  if (turn.status === "streaming") {
    const last = turn.events[turn.events.length - 1]?.stage;
    return <p className="tc-answer is-pending">{(last && PROGRESS[last]) || "Reading the question…"}</p>;
  }
  if (turn.status === "declined" || turn.status === "error") {
    return (
      <div className={`tc-answer is-${turn.status}`}>
        <span className="tc-answer-tag">{turn.status === "declined" ? "Declined" : "Error"}</span>
        <p>{turn.declineMessage}</p>
      </div>
    );
  }
  return (
    <div className="tc-answer">
      <p>{turn.reply}</p>
      {result?.rows && result.rows.length > 1 && (
        <ol className="tc-ranked">
          {result.rows.map((row) => (
            <li key={row.rank}>
              <span className="tc-num tc-rank-no">{row.rank}</span>
              <span className="tc-rank-name">{row.name}</span>
              <span className="tc-num tc-rank-value">{format(result.unit, row.value)}</span>
            </li>
          ))}
        </ol>
      )}
      {result?.series && <TrendChart result={result} format={(v) => format(result.unit, v)} />}
      {result?.groups && (
        <CompareBars result={result} derived={turn.trace?.derived} format={(v) => format(result.unit, v)} />
      )}
      {result?.buckets && <Histogram result={result} />}
    </div>
  );
}

export function Conversation({
  turns,
  onAsk,
  busy,
  header,
}: {
  turns: Turn[];
  onAsk: (q: string) => void;
  busy: boolean;
  header: ReactNode;
}) {
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    onAsk(draft);
    setDraft("");
  };

  return (
    <section className="tc-panel tc-conversation" aria-label="Conversation">
      {header}
      <div className="tc-turns">
        {turns.length === 0 ? (
          <div className="tc-welcome">
            <p className="tc-welcome-lede">
              Ask about any NYC taxi or rideshare trip from 2019 to 2025. Every number comes from a query you can
              inspect, and anything I can’t answer, I decline.
            </p>
            <ul className="tc-suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => onAsk(s)} disabled={busy}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          turns.map((turn) => (
            <article key={turn.id} className={`tc-turn is-${turn.status}`}>
              <p className="tc-question">{turn.question}</p>
              <Answer turn={turn} />
            </article>
          ))
        )}
        <div ref={end} />
      </div>
      <form className="tc-ask" onSubmit={submit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about trips, fares, tips, places, times…"
          aria-label="Your question"
          autoFocus
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label="Ask">
          <Icon name="send" />
        </button>
      </form>
    </section>
  );
}
