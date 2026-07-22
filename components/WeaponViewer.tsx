import React, { useEffect, useRef, useState, useCallback } from 'react';

interface WeaponViewerProps {
  images: string[];
  name: string;
  index: number;
  onIndexChange: (i: number) => void;
  /** Cinematic zoom-in when the viewer (re)mounts / product switches */
  introKey?: string | number;
  className?: string;
}

/**
 * Premium "pseudo-3D" weapon inspector.
 * - Drag  -> rotate the object on a turntable (rotateX / rotateY, spring back to idle)
 * - Pinch / double-tap / wheel -> zoom + pan
 * - Pointer move (desktop) -> parallax tilt + holographic gloss
 * - Idle  -> gentle sway + float so the object always feels "alive"
 * No extra assets required — works with the existing flat product photos.
 */
export const WeaponViewer: React.FC<WeaponViewerProps> = ({
  images,
  name,
  index,
  onIndexChange,
  introKey,
  className = '',
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);

  // animated state (kept in refs; rAF eases toward targets)
  const cur = useRef({ rx: 0, ry: 0, z: 1, px: 0, py: 0, gx: 50, gy: 40 });
  const tgt = useRef({ rx: 0, ry: 0, z: 1, px: 0, py: 0, gx: 50, gy: 40 });

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const pinchStart = useRef({ dist: 0, z: 1 });
  const lastTap = useRef(0);
  const idle = useRef(true);
  const t0 = useRef(0);

  const [zoomed, setZoomed] = useState(false);
  const [hint, setHint] = useState(true);
  const [intro, setIntro] = useState(false);

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  // cinematic intro on product switch only
  useEffect(() => {
    setIntro(true);
    const t = setTimeout(() => setIntro(false), 620);
    tgt.current.rx = 0; tgt.current.ry = 0; tgt.current.z = 1; tgt.current.px = 0; tgt.current.py = 0;
    setZoomed(false);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introKey]);

  // gentle reset of rotation/zoom when switching between views of the same weapon
  useEffect(() => {
    tgt.current.z = 1; tgt.current.px = 0; tgt.current.py = 0;
    setZoomed(false); idle.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const tHint = setTimeout(() => setHint(false), 4200);
    return () => clearTimeout(tHint);
  }, []);

  // main animation loop
  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (!t0.current) t0.current = now;
      const t = (now - t0.current) / 1000;

      // idle sway when the user is not interacting and not zoomed
      if (idle.current && !dragging.current && tgt.current.z <= 1.02) {
        tgt.current.ry = Math.sin(t * 0.55) * 7;
        tgt.current.rx = Math.sin(t * 0.4 + 1) * 3.2 - 2;
      }

      const c = cur.current, g = tgt.current;
      const e = 0.12;                    // easing
      c.rx += (g.rx - c.rx) * e;
      c.ry += (g.ry - c.ry) * e;
      c.z  += (g.z  - c.z)  * e;
      c.px += (g.px - c.px) * e;
      c.py += (g.py - c.py) * e;
      c.gx += (g.gx - c.gx) * 0.18;
      c.gy += (g.gy - c.gy) * 0.18;

      const floatY = idle.current && !dragging.current ? Math.sin(t * 0.9) * 8 : 0;

      if (objRef.current) {
        objRef.current.style.transform =
          `translate3d(${c.px}px, ${c.py + floatY}px, 0) scale(${c.z}) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
      }
      if (glossRef.current) {
        glossRef.current.style.background =
          `radial-gradient(220px circle at ${c.gx}% ${c.gy}%, rgba(255,255,255,0.28), rgba(56,225,240,0.10) 40%, transparent 68%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    idle.current = false;
    setHint(false);

    // double-tap / double-click to toggle zoom
    const now = Date.now();
    if (now - lastTap.current < 280 && pointers.current.size === 1) {
      const nz = tgt.current.z > 1.2 ? 1 : 2.1;
      tgt.current.z = nz; tgt.current.px = 0; tgt.current.py = 0;
      tgt.current.rx = 0; tgt.current.ry = 0;
      setZoomed(nz > 1.2);
    }
    lastTap.current = now;

    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      pinchStart.current = { dist: dist(pts[0], pts[1]), z: tgt.current.z };
    } else {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // hover parallax + gloss (desktop, no button pressed)
    if (!dragging.current && pointers.current.size === 0 && stageRef.current) {
      const r = stageRef.current.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      tgt.current.gx = nx * 100; tgt.current.gy = ny * 100;
      if (tgt.current.z <= 1.02) {
        idle.current = false;
        tgt.current.ry = (nx - 0.5) * 26;
        tgt.current.rx = -(ny - 0.5) * 16;
      }
      return;
    }

    // pinch zoom
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const d = dist(pts[0], pts[1]);
      const z = clamp(pinchStart.current.z * (d / (pinchStart.current.dist || 1)), 1, 3);
      tgt.current.z = z;
      setZoomed(z > 1.2);
      return;
    }

    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };

    if (tgt.current.z > 1.2) {
      // panning while zoomed
      const lim = 120 * tgt.current.z;
      tgt.current.px = clamp(tgt.current.px + dx, -lim, lim);
      tgt.current.py = clamp(tgt.current.py + dy, -lim, lim);
      tgt.current.gx = clamp(tgt.current.gx + dx * 0.1, 0, 100);
    } else {
      // rotate the turntable
      tgt.current.ry = clamp(tgt.current.ry + dx * 0.55, -55, 55);
      tgt.current.rx = clamp(tgt.current.rx - dy * 0.45, -32, 32);
      tgt.current.gx = clamp(50 + tgt.current.ry, 0, 100);
      tgt.current.gy = clamp(40 - tgt.current.rx, 0, 100);
    }
  }, []);

  const endPointer = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      dragging.current = false;
      // resume idle after a short delay if not zoomed
      window.setTimeout(() => {
        if (pointers.current.size === 0 && tgt.current.z <= 1.02) idle.current = true;
      }, 900);
    }
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const z = clamp(tgt.current.z - e.deltaY * 0.0016, 1, 3);
    tgt.current.z = z; setZoomed(z > 1.2);
    if (z <= 1.02) { tgt.current.px = 0; tgt.current.py = 0; }
  }, []);

  const reset = () => {
    tgt.current.rx = 0; tgt.current.ry = 0; tgt.current.z = 1; tgt.current.px = 0; tgt.current.py = 0;
    setZoomed(false); idle.current = true;
  };

  const go = (dir: number) => {
    const n = (index + dir + images.length) % images.length;
    onIndexChange(n);
  };

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* Stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => { if (tgt.current.z <= 1.02) idle.current = true; }}
        onWheel={onWheel}
        className="absolute inset-0 flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        style={{ perspective: '1400px' }}
      >
        <div
          ref={objRef}
          className={`relative w-[86%] h-[78%] max-w-[640px] will-change-transform ${intro ? 'animate-[introZoom_0.6s_cubic-bezier(0.16,1,0.3,1)_both]' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* crossfade stack of gallery images */}
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${name} — vue ${i + 1}`}
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-out pointer-events-none"
              style={{
                opacity: i === index ? 1 : 0,
                filter: 'drop-shadow(0 30px 45px rgba(0,0,0,0.65))',
              }}
            />
          ))}
          {/* holographic gloss that tracks the pointer */}
          <div ref={glossRef} className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70" />
        </div>

        {/* contact shadow / turntable disc */}
        <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-[62%] h-8 rounded-[50%] bg-black/60 blur-2xl pointer-events-none" />
      </div>

      {/* HUD corner brackets */}
      <div className="pointer-events-none absolute inset-4 md:inset-6">
        <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-hud/60" />
        <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-hud/60" />
        <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-hud/60" />
        <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-hud/60" />
      </div>

      {/* Bottom-left readout (kept clear of the top nav) */}
      <div className="pointer-events-none absolute bottom-5 left-5 md:bottom-7 md:left-7 flex items-center gap-2 font-hud text-[10px] tracking-[0.25em] text-hud/90">
        <span className="w-1.5 h-1.5 rounded-full bg-hud animate-pulse" />
        INSPECT&nbsp;·&nbsp;3D
      </div>

      {/* Zoom / reset control */}
      <button
        onClick={reset}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 bg-panel/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[10px] font-hud tracking-widest text-white/80 hover:border-hud/60 hover:text-hud transition-colors"
        aria-label="Réinitialiser la vue"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
        {zoomed ? 'RESET' : 'RECAL'}
      </button>

      {/* Rotate hint */}
      <div className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-16 md:bottom-20 flex items-center gap-2 text-[10px] font-hud tracking-[0.2em] text-white/55 transition-opacity duration-500 ${hint ? 'opacity-100' : 'opacity-0'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 0 1 9-9"/><path d="M21 12a9 9 0 0 1-9 9"/><path d="M8 3.5 3 3l.5 5"/><path d="M16 20.5l5 .5-.5-5"/></svg>
        GLISSEZ POUR PIVOTER · PINCEZ POUR ZOOMER
      </div>

      {/* Prev / next views */}
      {images.length > 1 && (
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
          <button onClick={() => go(-1)} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-panel/80 backdrop-blur border border-white/10 hover:border-hud/60 text-white flex items-center justify-center transition-all active:scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => go(1)} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-panel/80 backdrop-blur border border-white/10 hover:border-hud/60 text-white flex items-center justify-center transition-all active:scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              aria-label={`Vue ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-hud shadow-[0_0_10px_#38E1F0]' : 'w-2 bg-white/25'}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes introZoom {
          0%   { opacity: 0; transform: scale(0.82) translateY(18px); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
};
