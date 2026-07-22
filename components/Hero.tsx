import React from 'react';
import { Button } from './ui/Button';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full h-[82vh] min-h-[560px] overflow-hidden bg-ink scanlines">
      {/* Background atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop"
          alt=""
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom brightness-[0.45] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
        <div className="absolute inset-0 tech-grid opacity-40 animate-grid-pan" />
      </div>

      {/* HUD corner frame */}
      <div className="pointer-events-none absolute inset-5 md:inset-8 z-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-hud/50" />
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-hud/50" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-hud/50" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-hud/50" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-20 max-w-[90rem] mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6 py-1.5 px-3 border border-hud/30 rounded-full bg-hud/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-hud animate-pulse" />
            <span className="font-hud text-[10px] uppercase tracking-[0.3em] text-hud">Nouvelle Collection · Été 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.82] mb-6 text-white font-display drop-shadow-2xl">
            RÉALISME<br />QUALITÉ<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-hud to-white text-glow">FUN</span>
          </h1>

          <p className="text-base md:text-xl font-medium text-white/70 mb-8 max-w-xl leading-relaxed">
            La puissance électrique entre vos mains. Précision chirurgicale, batterie haute capacité, design furtif. L'été ne sera plus jamais le même.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onShopClick} variant="accent" className="!rounded-md !py-4 !px-9">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              Déployer l'arsenal
            </Button>
            <Button
              onClick={() => document.querySelector('#specs')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="!rounded-md !py-4 !px-9 backdrop-blur-md"
            >
              Briefing
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1 text-white/40">
        <span className="font-hud text-[9px] tracking-[0.3em]">SCROLL</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    </section>
  );
};
