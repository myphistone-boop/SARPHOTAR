import React, { useEffect, useRef } from 'react';

interface HeroWeaponProps {
  src: string;
  alt?: string;
  accent?: string;
  className?: string;
}

/**
 * Auto-rotating "pseudo-3D" hero showcase.
 * Continuous turntable sway + float + holographic gloss, with pointer parallax.
 * Works from a single transparent PNG/WebP — no real 3D asset required.
 */
export const HeroWeapon: React.FC<HeroWeaponProps> = ({ src, alt = '', accent = '#CAD2DA', className = '' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const px = useRef(0); // pointer parallax targets (-1..1)
  const py = useRef(0);
  const cx = useRef(0); // eased current
  const cy = useRef(0);
  const t0 = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (!t0.current) t0.current = now;
      const t = (now - t0.current) / 1000;

      cx.current += (px.current - cx.current) * 0.06;
      cy.current += (py.current - cy.current) * 0.06;

      const ry = Math.sin(t * 0.5) * 22 + cx.current * 16;   // turntable sway + parallax
      const rx = -5 + Math.sin(t * 0.42 + 1) * 4 - cy.current * 10;
      const floatY = Math.sin(t * 0.9) * 12;

      if (objRef.current) {
        objRef.current.style.transform =
          `translate3d(0, ${floatY}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      if (glossRef.current) {
        const gx = 50 + Math.sin(t * 0.5) * 30 + cx.current * 25;
        const gy = 42 - cy.current * 20;
        glossRef.current.style.background =
          `radial-gradient(240px circle at ${gx}% ${gy}%, rgba(255,255,255,0.30), ${accent}22 42%, transparent 68%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [accent]);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    px.current = ((e.clientX - r.left) / r.width - 0.5) * 2;
    py.current = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onLeave = () => { px.current = 0; py.current = 0; };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative select-none ${className}`}
      style={{ perspective: '1400px' }}
    >
      {/* glow behind */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(50% 45% at 50% 46%, ${accent}22, transparent 70%)` }} />

      <div ref={objRef} className="relative w-full h-full will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        <img src={src} alt={alt} draggable={false} loading="eager" decoding="async"
          className="w-full h-full object-contain pointer-events-none"
          style={{ filter: 'drop-shadow(0 30px 45px rgba(0,0,0,0.65))' }} />
        <div ref={glossRef} className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70" />
      </div>

      {/* contact shadow */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[55%] h-7 rounded-[50%] bg-black/60 blur-2xl pointer-events-none" />

      {/* rotating ring hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 font-hud text-[9px] tracking-[0.25em] text-white/45 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: accent }} /> 360° LIVE
      </div>
    </div>
  );
};
