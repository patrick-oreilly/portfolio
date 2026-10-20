"use client";

import type { ReactNode } from "react";

import { Icon } from "./Icon";
import type { Detail, StageEvent, Turn } from "./types";

const DETAIL_LABELS: [key: string, label: string][] = [
  ["measure", "Measure"],
  ["service", "Service"],
  ["place", "Place"],
  ["place_role", "Trips"],
  ["year", "Year"],
  ["month", "Month"],
  ["day", "Day"],
  ["time_of_day", "Time"],
  ["direction", "Ranking"],
  ["rank_unit", "Ranked by"],
  ["grain", "Step"],
  ["year_to", "Until"],
  ["compare_by", "Comparing"],
  ["service_b", "Against"],
  ["place_b", "Against"],
  ["distribution_of", "Spread of"],
];
const UNSTATED = new Set(["not_stated", "no_place"]);
// Details Jev answers for every question but that only mean something for one intent.
const ONLY_FOR: Record<string, string> = {
  direction: "ranking",
  rank_unit: "ranking",
  grain: "trend",
  year_to: "trend",
  compare_by: "compare",
  service_b: "compare",
  place_b: "compare",
  distribution_of: "distribution",
};
const CHECK_NAMES: Record<string, string> = {
  numbers: "Numbers",
  size_words: "Size words",
  claim: "Jev claim check",
};
const LOW_CONFIDENCE = 0.6;

const SOURCES: Record<string, string> = {
  llm: "Phrased by DeepSeek, numbers checked",
  llm_retry: "Phrased by DeepSeek on its second attempt",
  template: "Fixed template (the language model’s reply failed a check)",
};

const DECLINE_SOURCES: Record<string, string> = {
  fixed: "Decided in code, fixed message",
  llm: "Decided in code, phrased by DeepSeek and checked",
  llm_retry: "Decided in code, phrased by DeepSeek on its second attempt",
  template: "Decided in code, fixed message (the phrasing failed a check)",
};

const NAMES: Record<string, string> = {
  all: "All services",
  dropoff: "Ending there",
  pickup: "Starting there",
  yellow: "Yellow taxis",
  green: "Green taxis",
  rideshare: "Rideshare",
  uber: "Uber",
  lyft: "Lyft",
  total_or_average: "Total or average",
  out_of_scope: "Out of scope",
  trip_count: "Trips",
  rush_hour: "Rush hour",
  most_recent: "Most recent",
};

function words(value: string | null | undefined) {
  if (!value) return "—";
  if (NAMES[value]) return NAMES[value];
  const [kind, rest] = value.split(":");
  if (rest && kind === "zone") return `Zone ${rest}`;
  const text = (rest ?? value).replace(/_/g, " ");
  return rest ? text.replace(/\b\w/g, (c) => c.toUpperCase()) : text.charAt(0).toUpperCase() + text.slice(1);
}

function Confidence({ value }: { value: number | null | undefined }) {
  if (value == null) return null;
  const low = value < LOW_CONFIDENCE;
  return (
    <span className={`tc-conf${low ? " is-low" : ""}`} title="Jev's confidence">
      <span className="tc-conf-bar" style={{ ["--v" as string]: value }} />
      <span className="tc-mono">{value.toFixed(2)}</span>
    </span>
  );
}

function Step({
  title,
  at,
  state,
  children,
}: {
  title: string;
  at?: number;
  state: "done" | "active" | "waiting" | "failed";
  children?: ReactNode;
}) {
  return (
    <li className={`tc-step is-${state}`}>
      <div className="tc-step-head">
        <span className="tc-step-dot" aria-hidden />
        <h3>{title}</h3>
        {at != null && <span className="tc-mono tc-step-at">{Math.round(at)} ms</span>}
      </div>
      {children && <div className="tc-step-body">{children}</div>}
    </li>
  );
}

function find(events: StageEvent[], stage: string) {
  return events.find((e) => e.stage === stage);
}

export function TracePanel({ turn }: { turn?: Turn }) {
  if (!turn) {
    return (
      <aside className="tc-panel tc-trace" aria-label="How I got this">
        <header className="tc-panel-head">
          <h2>How I got this</h2>
        </header>
        <p className="tc-trace-empty">
          Ask a question and every step shows up here as it happens: how Jev read it, what code resolved, the query
          that ran and the checks the reply had to pass.
        </p>
      </aside>
    );
  }

  const { events, status } = turn;
  const classified = find(events, "classified");
  const resolved = find(events, "resolved");
  const queried = find(events, "queried");
  const checks = events.filter((e) => e.stage === "checked");
  const written = find(events, "written");
  const declined = find(events, "declined");
  const error = find(events, "error");
  const streaming = status === "streaming";
  const next = (seen: boolean) => (seen ? "done" : streaming ? "active" : "waiting");

  const intent = classified?.intent as Detail | undefined;
  const details = (classified?.details ?? {}) as Record<string, Detail>;
  const result = queried?.result as Record<string, unknown> | undefined;

  return (
    <aside className="tc-panel tc-trace" aria-label="How I got this" aria-live="polite">
      <header className="tc-panel-head">
        <h2>How I got this</h2>
        {turn.finishedAt && (
          <span className="tc-mono tc-muted">{Math.round(turn.finishedAt - turn.startedAt)} ms total</span>
        )}
      </header>
      <ol className="tc-steps">
        <Step title="Read by Jev" at={classified?.at as number} state={next(!!classified)}>
          {intent && (
            <>
              <div className="tc-intent">
                <span className="tc-intent-name">{words(intent.value)}</span>
                <Confidence value={intent.confidence} />
              </div>
              <dl className="tc-details">
                {DETAIL_LABELS.filter(
                  ([key]) =>
                    details[key] &&
                    !UNSTATED.has(details[key].value ?? "") &&
                    (!ONLY_FOR[key] || ONLY_FOR[key] === intent.value),
                ).map(([key, label]) => (
                  <div key={key} className="tc-detail-row">
                    <dt>{label}</dt>
                    <dd>
                      {key === "place" && resolved?.place
                        ? String(resolved.place)
                        : key === "place_b" && turn.highlight?.zones.find((z) => z.group === "b")
                          ? turn.highlight.zones.find((z) => z.group === "b")!.label
                          : words(details[key].value)}
                    </dd>
                    <Confidence value={details[key].confidence} />
                  </div>
                ))}
              </dl>
              <p className="tc-guards tc-mono">
                injection {(classified!.injection as number).toFixed(2)}
                {typeof classified!.compound === "number" && (
                  <> · compound {(classified!.compound as number).toFixed(2)}</>
                )}
              </p>
            </>
          )}
        </Step>

        {(resolved || !declined) && (
          <Step
            title="Resolved in code"
            at={resolved?.at as number}
            state={declined && !resolved ? "waiting" : next(!!resolved)}
          >
            {resolved && (
              <>
                <p className="tc-resolved">
                  {[
                    resolved.period,
                    words(resolved.service as string),
                    resolved.place,
                    resolved.day && words(resolved.day as string).toLowerCase(),
                    resolved.time_of_day && words(resolved.time_of_day as string).toLowerCase(),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {(turn.trace?.notes ?? []).length > 0 && (
                  <ul className="tc-assumptions is-notes">
                    {turn.trace!.notes!.map((n) => (
                      <li key={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</li>
                    ))}
                  </ul>
                )}
                {(resolved.assumptions as string[]).length > 0 && (
                  <ul className="tc-assumptions">
                    {(resolved.assumptions as string[]).map((a) => (
                      <li key={a}>Assumed {a}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Step>
        )}

        {!declined && (
          <Step title="Queried" at={queried?.at as number} state={next(!!queried)}>
            {queried && (
              <>
                <div className="tc-query-line">
                  <span className={`tc-source-tag is-${queried.source}`}>
                    {queried.source === "raw" ? "Raw trips" : "Hourly rollups"}
                  </span>
                  <span className="tc-num">{(queried.rows_scanned as number).toLocaleString("en-US")} rows</span>
                </div>
                <details className="tc-sql">
                  <summary>Show the SQL</summary>
                  <pre className="tc-mono">
                    {String(queried.sql).replace(
                      / (FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|SELECT|JOIN)\b/g,
                      "\n$1",
                    )}
                  </pre>
                  <p className="tc-mono tc-params">params: {(queried.params as string[]).join(", ")}</p>
                </details>
                {result && "value" in result && result.value == null && (
                  <p className="tc-muted">No matching trips.</p>
                )}
              </>
            )}
          </Step>
        )}

        {(checks.length > 0 || (!declined && streaming && queried)) && (
          <Step
            title="Checked"
            state={checks.length ? (checks.some((c) => c.passed) || written ? "done" : "failed") : "active"}
          >
            <ul className="tc-checks">
              {checks.map((c, i) => {
                const attempt = String(c.attempt);
                const named = (turn.trace?.checks ?? []).filter((k) => k.name.endsWith(`:${attempt}`));
                return (
                  <li key={i} className={c.passed ? "is-pass" : "is-fail"}>
                    <Icon name={c.passed ? "check" : "cross"} />
                    <span>
                      {attempt === "llm_retry" ? "Second attempt" : "First attempt"}:{" "}
                      {c.passed
                        ? "every number and claim traced to the result"
                        : (c.detail as string)}
                      {named.length > 1 && (
                        <span className="tc-check-names">
                          {named.map((k) => (
                            <span key={k.name} className={k.passed ? "is-pass" : "is-fail"}>
                              {CHECK_NAMES[k.name.split(":")[0]] ?? k.name.split(":")[0]}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Step>
        )}

        {written && (
          <Step title="Answered" at={written.at as number} state="done">
            <p className="tc-muted">{SOURCES[written.source as string] ?? String(written.source)}</p>
          </Step>
        )}

        {declined && (
          <Step title="Declined" at={declined.at as number} state="failed">
            <p className="tc-decline-code">{words(String(declined.reason))}</p>
            {turn.trace?.decline_source && (
              <p className="tc-muted">
                {DECLINE_SOURCES[turn.trace.decline_source] ?? turn.trace.decline_source}
              </p>
            )}
          </Step>
        )}

        {error && (
          <Step title="Something broke" state="failed">
            <p className="tc-muted">{String(error.message)}</p>
          </Step>
        )}
      </ol>
    </aside>
  );
}
