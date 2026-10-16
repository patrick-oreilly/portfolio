"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WarpLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  const [warping, setWarping] = useState(false);

  function go() {
    if (warping) return;
    setWarping(true);
    setTimeout(() => router.push(href), 650);
  }

  return (
    <>
      <button
        onClick={go}
        className="rounded-full border border-green/30 bg-green-soft px-4 py-1.5 text-sm font-medium text-green transition-colors hover:border-green/60"
      >
        {children}
      </button>
      {warping && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#05060a] [animation:warp-fade_650ms_ease-in_forwards]">
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * 360;
            const delay = Math.random() * 120;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-px w-0 bg-gradient-to-r from-white to-transparent [animation:warp-streak_550ms_ease-out_forwards]"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "0 0",
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes warp-streak {
              0% { width: 0; opacity: 0; }
              15% { opacity: 1; }
              100% { width: 70vw; opacity: 0; }
            }
            @keyframes warp-fade {
              0% { opacity: 0; }
              60% { opacity: 1; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
