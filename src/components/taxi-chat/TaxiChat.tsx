"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Conversation } from "./Conversation";
import { Readout } from "./Readout";
import { TracePanel } from "./TracePanel";
import type { Stats } from "./types";
import { useAsk } from "./useAsk";

const CityMap = dynamic(() => import("./CityMap").then((m) => m.CityMap), {
  ssr: false,
  loading: () => <div className="tc-city tc-city-loading" aria-hidden />,
});

function Masthead({ stats }: { stats: Stats | null }) {
  return (
    <header className="tc-masthead">
      <div className="tc-masthead-top">
        <h1 className="tc-wordmark">
          <span className="tc-roof-light" aria-hidden />
          Taxi Chat
        </h1>
        <Link href="/" className="tc-back">
          ← Portfolio
        </Link>
      </div>
      <p className="tc-count">
        <span className="tc-num tc-count-value">
          {stats ? stats.trips.toLocaleString("en-US") : "—"}
        </span>
        <span className="tc-count-label">
          NYC trips, Jan 2019 – Dec 2025
          {stats && !stats.complete && ` · ${stats.months_loaded} of ${stats.months_expected} months loaded`}
        </span>
      </p>
    </header>
  );
}

export default function TaxiChat() {
  const { turns, ask } = useAsk();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/taxi-chat/stats", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null));
    return () => controller.abort();
  }, []);

  const active = turns[turns.length - 1];
  const busy = active?.status === "streaming";
  const lastFinished = [...turns].reverse().find((t) => t.status !== "streaming");
  const declined = !busy && (active?.status === "declined" || active?.status === "error");
  const queried = active?.events.find((e) => e.stage === "queried");
  const querying =
    busy && !!active?.events.find((e) => e.stage === "resolved") && !queried;

  return (
    <div className="taxi-chat-root">
      <div className={`tc-app${busy ? " is-busy" : ""}`}>
        <CityMap highlight={busy ? undefined : lastFinished?.highlight} declined={declined} busy={busy} />
        {declined && active?.declineMessage && (
          <div className="tc-decline-banner" role="status">
            <span className="tc-answer-tag">{active.status === "declined" ? "Declined" : "Error"}</span>
            {active.declineMessage}
          </div>
        )}
        <Conversation turns={turns} onAsk={ask} busy={busy} header={<Masthead stats={stats} />} />
        <TracePanel turn={active} />
        {(queried || querying) && (
          <Readout
            rows={(queried?.rows_scanned as number) ?? 0}
            source={(queried?.source as string) ?? null}
            ms={active?.trace?.timings_ms?.query ?? null}
            pending={querying}
          />
        )}
      </div>
    </div>
  );
}
