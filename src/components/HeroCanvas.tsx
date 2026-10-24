"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };

const LINK_DIST = 140;
const POINTER_RADIUS = 180;

/**
 * A drifting graph of nodes behind the hero, a nod to the agent graphs in the
 * projects. Nodes link when close, lean away from the pointer, and send a pulse
 * along edges now and then. Runs only while on screen; under reduced motion it
 * draws one still frame.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let colors = { link: "#2457e8", dot: "#2457e8", pulse: "#0b7a50" };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      colors = {
        link: s.getPropertyValue("--blue-text").trim() || colors.link,
        dot: s.getPropertyValue("--blue").trim() || colors.dot,
        pulse: s.getPropertyValue("--green-text").trim() || colors.pulse,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 1.6,
        pulse: Math.random(),
      }));
    };

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (animate) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = ((POINTER_RADIUS - d) / POINTER_RADIUS) * 0.35;
            n.vx += (dx / d) * push * 0.05;
            n.vy += (dy / d) * push * 0.05;
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = w + 10;
          if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          if (n.y > h + 10) n.y = -10;
          n.pulse = (n.pulse + 0.004) % 1;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          ctx.globalAlpha = t * 0.35;
          ctx.strokeStyle = colors.link;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          // A bright packet travelling a → b while a's pulse is mid-cycle.
          if (animate && a.pulse > 0.8) {
            const p = (a.pulse - 0.8) / 0.2;
            ctx.globalAlpha = t * 0.9;
            ctx.fillStyle = colors.pulse;
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.fillStyle = colors.dot;
      for (const n of nodes) {
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw(true);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    readColors();
    resize();

    if (reduced) {
      draw(false);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(false);
    });
    ro.observe(canvas);

    // Theme can change by toggle (data-theme) or by OS preference.
    const mo = new MutationObserver(() => {
      readColors();
      if (reduced) draw(false);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      readColors();
      if (reduced) draw(false);
    };
    mq.addEventListener("change", onScheme);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onScheme);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    />
  );
}
