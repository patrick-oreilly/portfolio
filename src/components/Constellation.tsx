"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type * as THREE from "three";
import { trajectory, projects } from "@/lib/content";

type NodeDatum = {
  id: string;
  label: string;
  tag: string;
  body: string;
  color: number;
  size: number;
  ring: boolean;
  link?: string;
};

function buildData(): NodeDatum[] {
  const exp: NodeDatum[] = trajectory.map((t) => ({
    id: t.id,
    label: t.org === "University of Galway" ? t.org : `${t.role.split(" ").slice(0, 3).join(" ")}`,
    tag: `${t.org === "University of Galway" ? "EDUCATION" : "EXPERIENCE"} · ${t.dates}`,
    body: t.summary + (t.bullets ? " " + t.bullets.join(" ") : ""),
    color: t.org === "University of Galway" ? 0x9a8cff : 0xffb648,
    size: t.current ? 1.5 : 1.05,
    ring: t.current,
  }));
  const proj: NodeDatum[] = projects.map((p) => ({
    id: p.slug,
    label: p.title,
    tag: `PROJECT · ${p.statusLabel.toUpperCase()}`,
    body: p.summary,
    color: 0x5fe0c8,
    size: p.featured ? 1.3 : 1.0,
    ring: false,
    link: p.link,
  }));
  return [...exp, ...proj];
}

export default function Constellation() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<{
    setLabel: (text: string, visible: boolean) => void;
    openPanel: (d: NodeDatum) => void;
  } | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const closeFlightRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const DATA = buildData();
      const mount = mountRef.current;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05060a, 0.03);
      const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 200);
      camera.position.set(0, 0, 13);

      // --- lighting: planets need real shading to read as spheres ---
      scene.add(new THREE.AmbientLight(0x404060, 1.1));
      const sun = new THREE.DirectionalLight(0xfff4e0, 2.2);
      sun.position.set(8, 6, 10);
      scene.add(sun);

      // --- nebula backdrop: large inverted sphere with a soft canvas gradient ---
      function nebulaTexture() {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#05060a";
        ctx.fillRect(0, 0, 512, 256);
        const blobs: [number, number, number, string][] = [
          [120, 80, 110, "rgba(70,55,130,0.14)"],
          [380, 150, 130, "rgba(30,90,100,0.11)"],
          [250, 190, 90, "rgba(110,50,80,0.09)"],
        ];
        blobs.forEach(([x, y, r, color]) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, color);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 512, 256);
        });
        const tex = new THREE.CanvasTexture(c);
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
      }
      const nebulaGeo = new THREE.SphereGeometry(90, 32, 32);
      const nebulaMat = new THREE.MeshBasicMaterial({ map: nebulaTexture(), side: THREE.BackSide, fog: false });
      scene.add(new THREE.Mesh(nebulaGeo, nebulaMat));

      // --- starfield, two layers for depth ---
      function starField(count: number, spread: number, size: number, color: number) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          pos[i * 3] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        return new THREE.Points(geo, new THREE.PointsMaterial({ color, size, fog: false }));
      }
      scene.add(starField(900, 80, 0.055, 0x4a5068));
      scene.add(starField(300, 50, 0.09, 0x8fa0c8));

      const group = new THREE.Group();
      scene.add(group);

      // --- planet texture: procedural canvas noise tinted to the node color ---
      function planetTexture(hex: number) {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 128;
        const ctx = c.getContext("2d")!;
        const col = new THREE.Color(hex);
        const base = col.clone().multiplyScalar(0.55);
        ctx.fillStyle = `rgb(${Math.round(base.r * 255)},${Math.round(base.g * 255)},${Math.round(base.b * 255)})`;
        ctx.fillRect(0, 0, 256, 128);
        for (let i = 0; i < 90; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 128;
          const r = 5 + Math.random() * 22;
          const lighter = Math.random() > 0.4;
          const shade = col.clone().multiplyScalar(lighter ? 1.3 + Math.random() * 0.6 : 0.25 + Math.random() * 0.3);
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = `rgb(${Math.min(255, Math.round(shade.r * 255))},${Math.min(255, Math.round(shade.g * 255))},${Math.min(255, Math.round(shade.b * 255))})`;
          ctx.beginPath();
          ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.3;
        const polar = ctx.createLinearGradient(0, 0, 0, 128);
        polar.addColorStop(0, "white");
        polar.addColorStop(0.1, "rgba(255,255,255,0)");
        polar.addColorStop(0.9, "rgba(255,255,255,0)");
        polar.addColorStop(1, "white");
        ctx.fillStyle = polar;
        ctx.fillRect(0, 0, 256, 128);
        ctx.globalAlpha = 1;
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        return tex;
      }

      const nodeMeshes: THREE.Mesh[] = [];
      DATA.forEach((d, i) => {
        const phi = Math.acos(-1 + (2 * i) / DATA.length);
        const theta = Math.sqrt(DATA.length * Math.PI) * phi;
        const r = 5.2;
        const pos = new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        );

        const radius = 0.26 * d.size;
        const planetGeo = new THREE.SphereGeometry(radius, 48, 48);
        const planetMat = new THREE.MeshStandardMaterial({
          map: planetTexture(d.color),
          roughness: 0.85,
          metalness: 0.05,
        });
        const mesh = new THREE.Mesh(planetGeo, planetMat);
        mesh.position.copy(pos);
        mesh.userData = { ...d, spin: 0.15 + Math.random() * 0.2 };
        group.add(mesh);
        nodeMeshes.push(mesh);

        // thin additive atmosphere shell, the only part bloom should catch
        const atmoGeo = new THREE.SphereGeometry(radius * 1.18, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: d.color,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false,
        });
        const atmo = new THREE.Mesh(atmoGeo, atmoMat);
        atmo.position.copy(pos);
        group.add(atmo);
        mesh.userData.atmo = atmo;

        if (d.ring) {
          const ringGeo = new THREE.RingGeometry(radius * 1.6, radius * 2.1, 64);
          const ringMat = new THREE.MeshBasicMaterial({
            color: d.color,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.copy(pos);
          ring.rotation.x = Math.PI / 2.3;
          ring.rotation.z = Math.random() * Math.PI;
          group.add(ring);
          mesh.userData.ring = ring;
        }
      });

      const lineMat = new THREE.LineBasicMaterial({ color: 0x2a3040, transparent: true, opacity: 0.4 });
      for (let i = 0; i < nodeMeshes.length; i++) {
        for (let j = i + 1; j < nodeMeshes.length; j++) {
          if (Math.random() < 0.3) {
            const geo = new THREE.BufferGeometry().setFromPoints([nodeMeshes[i].position, nodeMeshes[j].position]);
            group.add(new THREE.Line(geo, lineMat));
          }
        }
      }

      // --- warp-speed streak lines, attached to the camera, invisible at idle ---
      const WARP_COUNT = 140;
      const warpGeo = new THREE.BufferGeometry();
      const warpPos = new Float32Array(WARP_COUNT * 2 * 3);
      const warpSpread = 6;
      for (let i = 0; i < WARP_COUNT; i++) {
        const ox = (Math.random() - 0.5) * warpSpread;
        const oy = (Math.random() - 0.5) * warpSpread;
        const near = -1 - Math.random() * 1.5;
        const far = near - 3 - Math.random() * 5;
        warpPos.set([ox, oy, near, ox, oy, far], i * 6);
      }
      warpGeo.setAttribute("position", new THREE.BufferAttribute(warpPos, 3));
      const warpMat = new THREE.LineBasicMaterial({
        color: 0xbfd4ff,
        transparent: true,
        opacity: 0,
        fog: false,
      });
      const warpLines = new THREE.LineSegments(warpGeo, warpMat);
      camera.add(warpLines);
      scene.add(camera);

      let mouseX = 0,
        mouseY = 0;
      let dragging = false,
        lastX = 0,
        lastY = 0,
        rotX = 0.25,
        rotY = 0.35;

      function onMouseMove(e: MouseEvent) {
        mouseX = e.clientX / mount.clientWidth - 0.5;
        mouseY = e.clientY / mount.clientHeight - 0.5;
        if (dragging) {
          rotY += (e.clientX - lastX) * 0.005;
          rotX += (e.clientY - lastY) * 0.005;
          lastX = e.clientX;
          lastY = e.clientY;
        }
      }
      function onMouseDown(e: MouseEvent) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
      function onMouseUp() {
        dragging = false;
      }
      mount.addEventListener("mousemove", onMouseMove);
      mount.addEventListener("mousedown", onMouseDown);
      addEventListener("mouseup", onMouseUp);

      const raycaster = new THREE.Raycaster();
      const mouseV = new THREE.Vector2();
      let hovered: THREE.Mesh | null = null;
      let focusedId: string | null = null;

      function onHoverMove(e: MouseEvent) {
        if (camState !== "idle") return;
        const rect = mount.getBoundingClientRect();
        mouseV.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseV.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseV, camera);
        const hits = raycaster.intersectObjects(nodeMeshes);
        if (hits.length) {
          hovered = hits[0].object as THREE.Mesh;
          mount.style.cursor = "pointer";
          uiRef.current?.setLabel(hovered.userData.label, true);
        } else {
          hovered = null;
          mount.style.cursor = dragging ? "grabbing" : "grab";
          uiRef.current?.setLabel("", false);
        }
      }
      mount.addEventListener("mousemove", onHoverMove);

      // --- camera flight state machine ---
      let camState: "idle" | "flying-in" | "focused" | "flying-out" = "idle";
      let flightT = 0;
      const FLIGHT_SECONDS = 1.3;
      const overviewPos = camera.position.clone();
      const overviewLook = new THREE.Vector3(0, 0, 0);
      const flightFrom = new THREE.Vector3();
      const flightTo = new THREE.Vector3();
      const lookFrom = new THREE.Vector3();
      const lookTo = new THREE.Vector3();
      const currentLook = new THREE.Vector3(0, 0, 0);
      let pendingNode: NodeDatum | null = null;

      function easeInOutCubic(x: number) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      }

      function flyTo(nodeMesh: THREE.Mesh) {
        const worldPos = nodeMesh.position.clone().applyMatrix4(group.matrixWorld);
        flightFrom.copy(camera.position);
        flightTo.copy(worldPos).multiplyScalar(1 - 1.5 / worldPos.length());
        lookFrom.copy(currentLook);
        lookTo.copy(worldPos);
        flightT = 0;
        camState = "flying-in";
        focusedId = nodeMesh.userData.id;
        pendingNode = nodeMesh.userData as NodeDatum;
        uiRef.current?.setLabel("", false);
      }

      function flyBack() {
        flightFrom.copy(camera.position);
        flightTo.copy(overviewPos);
        lookFrom.copy(currentLook);
        lookTo.copy(overviewLook);
        flightT = 0;
        camState = "flying-out";
        if (scrimRef.current) {
          scrimRef.current.style.opacity = "0";
          scrimRef.current.style.pointerEvents = "none";
        }
        if (panelRef.current) panelRef.current.style.translate = "";
      }
      closeFlightRef.current = flyBack;

      function onClick() {
        if (hovered && camState === "idle") flyTo(hovered);
      }
      mount.addEventListener("click", onClick);

      uiRef.current = {
        setLabel(text, visible) {
          const el = labelRef.current;
          if (!el) return;
          el.textContent = text;
          el.style.opacity = visible ? "1" : "0";
        },
        openPanel(d) {
          if (tagRef.current) tagRef.current.textContent = d.tag;
          if (titleRef.current) titleRef.current.textContent = d.label;
          if (bodyRef.current) bodyRef.current.textContent = d.body;
          if (linkRef.current) {
            if (d.link) {
              linkRef.current.href = d.link;
              linkRef.current.style.display = "inline-flex";
            } else {
              linkRef.current.style.display = "none";
            }
          }
          if (panelRef.current) panelRef.current.style.translate = "0 0";
          if (scrimRef.current) {
            scrimRef.current.style.opacity = "1";
            scrimRef.current.style.pointerEvents = "auto";
          }
        },
      };

      function updateLabelPos() {
        if (hovered && camState === "idle" && labelRef.current) {
          const v = hovered.position.clone().applyMatrix4(group.matrixWorld).project(camera);
          const rect = mount.getBoundingClientRect();
          labelRef.current.style.left = `${((v.x + 1) / 2) * rect.width}px`;
          labelRef.current.style.top = `${((1 - v.y) / 2) * rect.height}px`;
        }
      }

      let t = 0;
      let raf = 0;
      let lastFrameTime = performance.now();
      function animate() {
        const now = performance.now();
        const dt = Math.min(0.1, (now - lastFrameTime) / 1000); // seconds, clamped against tab-away jumps
        lastFrameTime = now;

        const autoRotate = camState === "idle";
        if (autoRotate) {
          t += dt * 0.19;
          group.rotation.y = rotY + t * 0.1;
          group.rotation.x = rotX * 0.35;
          camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
          camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.03;
          currentLook.set(0, 0, 0);
          camera.lookAt(currentLook);
          warpMat.opacity = Math.max(0, warpMat.opacity - dt * 3);
        } else {
          flightT = Math.min(1, flightT + dt / FLIGHT_SECONDS);
          const e = easeInOutCubic(flightT);
          camera.position.lerpVectors(flightFrom, flightTo, e);
          currentLook.lerpVectors(lookFrom, lookTo, e);
          camera.lookAt(currentLook);
          // warp streak intensity peaks mid-flight, fades at both ends
          warpMat.opacity = Math.sin(Math.min(flightT, 1) * Math.PI) * 0.55;
          if (flightT >= 1) {
            if (camState === "flying-in") {
              camState = "focused";
              if (pendingNode) uiRef.current?.openPanel(pendingNode);
            } else if (camState === "flying-out") {
              camState = "idle";
              focusedId = null;
            }
          }
        }
        nodeMeshes.forEach((m) => {
          const pulse = 1 + Math.sin((autoRotate ? t : flightT * 2) * 2 + m.position.x) * 0.04;
          m.userData.atmo.scale.setScalar(pulse);
          m.rotation.y += 0.0015 * m.userData.spin;
          const dim = focusedId && m.userData.id !== focusedId;
          const mat = m.material as InstanceType<typeof THREE.MeshStandardMaterial>;
          mat.opacity = dim ? 0.2 : 1;
          mat.transparent = !!dim;
          m.userData.atmo.material.opacity = dim ? 0.04 : 0.16;
          if (m.userData.ring) m.userData.ring.material.opacity = dim ? 0.1 : 0.45;
        });
        updateLabelPos();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      }
      animate();

      function onResize() {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      }
      addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        removeEventListener("resize", onResize);
        removeEventListener("mouseup", onMouseUp);
        mount.removeEventListener("mousemove", onMouseMove);
        mount.removeEventListener("mousemove", onHoverMove);
        mount.removeEventListener("mousedown", onMouseDown);
        mount.removeEventListener("click", onClick);
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#05060a] text-[#eef1f6]">
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none fixed inset-0 z-[5]">
        <div className="absolute left-10 top-9">
          <div className="mb-2.5 font-mono text-[12.5px] tracking-[0.08em] text-[#5fe0c8]">
            GRADUATE SOFTWARE ENGINEER — AI FOCUSED
          </div>
          <h1 className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-bold tracking-[-0.02em]">Patrick O&rsquo;Reilly</h1>
        </div>
        <div className="absolute right-10 top-9 text-right font-mono text-[11px] text-[#7a8396]">
          <div className="mb-1.5 flex items-center justify-end gap-2">
            <span>experience</span>
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffb648]" />
          </div>
          <div className="mb-1.5 flex items-center justify-end gap-2">
            <span>projects</span>
            <span className="h-[7px] w-[7px] rounded-full bg-[#5fe0c8]" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span>education</span>
            <span className="h-[7px] w-[7px] rounded-full bg-[#9a8cff]" />
          </div>
        </div>
        <div className="absolute bottom-9 left-10 font-mono text-xs text-[#7a8396]">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#5fe0c8]" />
          drag to orbit — click a planet to fly to it
        </div>
        <button
          onClick={() => {
            if (leaving) return;
            setLeaving(true);
            setTimeout(() => router.push("/"), 550);
          }}
          className="pointer-events-auto absolute bottom-9 right-10 rounded-full border border-white/15 bg-black/30 px-4 py-2 font-mono text-xs text-[#eef1f6] backdrop-blur-sm transition-colors hover:border-white/30"
        >
          ← back to site
        </button>
      </div>
      {leaving && (
        <div className="fixed inset-0 z-[60] bg-[#05060a] opacity-0 [animation:leave-fade_550ms_ease-in_forwards]">
          <style>{`@keyframes leave-fade { to { opacity: 1; } }`}</style>
        </div>
      )}

      <div
        ref={labelRef}
        className="pointer-events-none fixed z-[6] -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-md border border-white/10 bg-black/75 px-2.5 py-1.5 font-mono text-xs opacity-0 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={scrimRef}
        onClick={() => closeFlightRef.current?.()}
        className="pointer-events-none fixed inset-0 z-[4] bg-black/30 opacity-0 transition-opacity duration-500"
      />

      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-10 w-[420px] max-w-[88vw] translate-x-full overflow-y-auto border-l border-white/10 bg-[#080a10]/92 px-9 pb-10 pt-[70px] backdrop-blur-xl transition-[translate] duration-500"
      >
        <button
          onClick={() => closeFlightRef.current?.()}
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#eef1f6] transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          ✕
        </button>
        <div ref={tagRef} className="mb-3.5 font-mono text-[11.5px] text-[#5fe0c8]">
          —
        </div>
        <h2 ref={titleRef} className="mb-4 text-2xl font-bold leading-tight">
          —
        </h2>
        <p ref={bodyRef} className="mb-4 text-[14.5px] leading-relaxed text-[#b7bfcc]">
          —
        </p>
        <a
          ref={linkRef}
          href="#"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 rounded-full bg-[#5fe0c8] px-4 py-2 text-[13px] font-semibold text-[#06120c]"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
