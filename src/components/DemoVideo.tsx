"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted, looping screen recording. It plays only while on screen, starts paused
 * under reduced motion, and has a pause control since it runs longer than 5s.
 */
export default function DemoVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // null means "no explicit choice yet", so reduced motion decides.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const paused = userPaused ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [userPaused]);

  return (
    <div className="relative aspect-[16/10] bg-[#1e1e2e]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <button
        type="button"
        onClick={() => setUserPaused(playing)}
        aria-label={playing ? "Pause demo" : "Play demo"}
        className="absolute bottom-3 right-3 inline-flex min-h-10 items-center rounded-full bg-black/60 px-4 font-mono text-[12px] text-white backdrop-blur transition-colors hover:bg-black/80"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
