import React, { useState, useEffect, useRef } from 'react';
import { Weapon } from '../data/catalog';
import { getReviewsForProduct } from '../constants';
import { WeaponViewer } from '../components/WeaponViewer';
import { StatBar, STAT_META } from '../components/StatBars';

interface WeaponScreenProps {
  weapon: Weapon;
  weapons: Weapon[];
  onBack: () => void;
  onSwitch: (w: Weapon) => void;
  onAddToCart: (w: Weapon) => void;
  onBuyNow: (w: Weapon) => void;
}

export const WeaponScreen: React.FC<WeaponScreenProps> = ({ weapon, weapons, onBack, onSwitch, onAddToCart, onBuyNow }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [switcher, setSwitcher] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loads, setLoads] = useState(0);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgIndex(0);
    setReviews(getReviewsForProduct(weapon.id, 4, 0));
    setLoads(0);
  }, [weapon.id]);

  const stars = (n: number) => (
    <div className="flex gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      ))}
    </div>
  );

  const acc = weapon.meta.rarityColor;

  return (
    <div className="fixed inset-0 z-50 bg-carbon flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar push-in">
      {/* header */}
      <div className="app-chrome sticky top-0 z-30 pt-safe bg-carbon/70 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 h-14">
          <button onClick={onBack} className="grid place-items-center w-9 h-9 rounded-full bg-surface/80 border border-white/10 text-ghost hover:border-accent transition-colors active:scale-90">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="relative flex-1">
            <button onClick={() => setSwitcher(!switcher)} className="w-full flex items-center justify-between bg-surface/70 border border-white/10 rounded-xl px-3 py-2 hover:border-accent/50 transition-colors">
              <span className="flex flex-col items-start text-left leading-none">
                <span className="font-hud text-[8px] tracking-[0.3em] text-accent mb-0.5">ARME ÉQUIPÉE</span>
                <span className="text-sm font-black italic uppercase font-display text-ghost">{weapon.name}</span>
              </span>
              <svg className={`w-4 h-4 text-accent transition-transform ${switcher ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {switcher && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl shadow-card overflow-hidden z-40 animate-rise">
                {weapons.map((w) => (
                  <button key={w.id} onClick={() => { onSwitch(w); setSwitcher(false); }} className={`w-full flex items-center gap-3 p-2.5 text-left border-b border-white/5 last:border-0 ${w.id === weapon.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <div className="w-11 h-11 bg-black/40 rounded-lg p-1 grid place-items-center border border-white/5"><img src={w.image} alt={w.name} loading="lazy" className="w-full h-full object-contain" /></div>
                    <div className="min-w-0"><div className="text-sm font-black italic uppercase font-display text-ghost truncate">{w.name}</div><div className="font-hud text-[9px] text-muted tracking-wider">{w.meta.klass}</div></div>
                    <span className="ml-auto font-hud text-sm text-accent">{w.price}€</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* viewer */}
      <div className="relative h-[46vh] min-h-[300px] carbon-soft border-b border-white/8" style={{ background: `radial-gradient(70% 55% at 50% 45%, ${acc}14, transparent 70%)` }}>
        <div className="absolute inset-0 tech-grid opacity-25" />
        <WeaponViewer images={weapon.gallery} name={weapon.name} index={imgIndex} onIndexChange={setImgIndex} introKey={weapon.id} accent={acc} />
      </div>

      {/* panel */}
      <div className="max-w-2xl mx-auto px-5 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-3 animate-rise">
          <span className="font-hud text-[10px] font-semibold tracking-[0.25em] px-2.5 py-1 rounded" style={{ color: acc, background: `${acc}1A`, border: `1px solid ${acc}44` }}>{weapon.meta.rarity}</span>
          <span className="font-hud text-[10px] tracking-[0.2em] text-muted">{weapon.meta.klass} · WEAPON LVL {String(weapons.findIndex(w=>w.id===weapon.id)+1).padStart(2,'0')}</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase font-display tracking-tighter text-ghost leading-[0.85] mb-1 animate-rise">{weapon.name}</h1>
        <p className="font-hud text-xs tracking-[0.2em] uppercase text-muted mb-5">{weapon.tagline}</p>

        {/* price card */}
        <div className="bg-surface border border-white/10 rounded-xl2 p-5 mb-6 brackets edge-top">
          <div className="flex items-end justify-between pb-4 mb-4 border-b border-white/8">
            <div>
              <span className="font-hud text-[10px] uppercase text-muted tracking-[0.2em] block mb-1">Prix unitaire</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl font-black font-display text-ghost leading-none">{weapon.price}€</span>
                {weapon.originalPrice && <span className="text-base text-muted line-through decoration-danger decoration-2">{weapon.originalPrice}€</span>}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-good/10 border border-good/30 px-2 py-1 rounded text-good">
              <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse-dot" /><span className="font-hud text-[9px] tracking-widest">EN STOCK</span>
            </span>
          </div>
          <div className="grid grid-cols-[1fr_1.6fr] gap-2.5">
            <button onClick={() => onAddToCart(weapon)} className="font-hud text-xs uppercase tracking-[0.14em] py-3.5 rounded-xl border border-white/15 text-ghost hover:border-accent hover:text-accent transition-colors active:scale-95">Panier</button>
            <button onClick={() => onBuyNow(weapon)} className="font-hud text-sm uppercase tracking-[0.14em] py-3.5 rounded-xl bg-accent text-carbon hover:shadow-glow transition-all active:scale-95">Acheter</button>
          </div>
        </div>

        {/* stats */}
        <div className="mb-6">
          <h3 className="font-hud text-[11px] font-semibold uppercase tracking-[0.25em] text-accent mb-3 flex items-center gap-2"><span className="w-6 h-px bg-accent" /> Statistiques</h3>
          <div className="space-y-2.5">
            {(['range', 'rate', 'capacity'] as const).map((k) => (
              <div key={k} className="bg-surface2 border border-white/5 p-3 rounded-lg">
                <StatBar label={STAT_META[k].label} value={weapon.specs[k]} start={STAT_META[k].start} end={STAT_META[k].end} segments={26} size="md" animateEntry />
              </div>
            ))}
          </div>
        </div>

        {/* rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black italic font-display text-ghost">{weapon.rating}</span>
            {stars(Math.round(weapon.rating))}
          </div>
          <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="font-hud text-[10px] text-muted uppercase tracking-wider underline hover:text-ghost transition-colors">{weapon.reviewCount} rapports</button>
        </div>

        {/* briefing */}
        <div className="mb-8">
          <h3 className="font-hud text-[11px] font-semibold uppercase tracking-[0.25em] text-accent mb-4 flex items-center gap-2"><span className="w-6 h-px bg-accent" /> Briefing</h3>
          <p className="text-lg font-medium leading-relaxed text-ghost mb-3">{weapon.story.line1}</p>
          <p className="text-[15px] leading-relaxed text-muted mb-5">{weapon.story.line2} Conçu avec des polymères haute densité et une électronique étanche, c'est l'outil ultime pour dominer l'été.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {weapon.bullets.map((b, i) => (
              <div key={i} className="bg-surface2 border border-white/5 p-3 rounded-lg">
                <div className="font-hud text-[9px] uppercase text-muted tracking-wider mb-1">{b.label}</div>
                <div className="text-sm font-black italic font-display text-ghost">{b.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* reviews */}
        <div ref={reviewsRef} className="border-t border-white/8 pt-6">
          <h3 className="text-xl font-black italic uppercase font-display text-ghost mb-4">Field Reports <span className="font-hud text-sm not-italic text-accent ml-1">({weapon.reviewCount})</span></h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-surface border border-white/8 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2"><span className="font-bold text-ghost text-sm">{r.name}</span>{r.verified && <span className="font-hud text-[9px] bg-good/10 text-good px-2 py-0.5 rounded-full tracking-wide border border-good/20">VÉRIFIÉ</span>}</div>
                  <span className="font-hud text-[10px] text-muted">{r.date}</span>
                </div>
                <div className="mb-2">{stars(r.rating)}</div>
                <p className="text-sm text-ghost/70 leading-relaxed">"{r.content}"</p>
                {r.image && <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-w-[180px]"><img src={r.image} alt="Rapport" loading="lazy" className="w-full h-auto object-cover" /></div>}
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            {loads < 10 ? (
              <button onClick={() => { setReviews((p) => [...p, ...getReviewsForProduct(weapon.id, 4, reviews.length)]); setLoads((c) => c + 1); }} className="font-hud text-[11px] uppercase tracking-[0.2em] border border-white/15 px-7 py-3 rounded-xl text-ghost hover:border-accent hover:text-accent transition-all">Charger plus</button>
            ) : <span className="font-hud text-[10px] text-muted uppercase tracking-[0.2em]">Tous les rapports affichés</span>}
          </div>
        </div>
      </div>

      </div>{/* /scroll */}

      {/* buy bar — in-flow footer of the fixed shell (stays pinned, immune to transform) */}
      <div className="app-chrome shrink-0 pb-safe bg-carbon2/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
          <div className="flex flex-col shrink-0">
            <span className="font-hud text-[9px] text-muted uppercase tracking-wider truncate max-w-[90px]">{weapon.name}</span>
            <div className="flex items-baseline gap-1.5"><span className="text-xl font-black font-display text-ghost">{weapon.price}€</span>{weapon.originalPrice && <span className="text-[11px] text-muted line-through decoration-danger">{weapon.originalPrice}€</span>}</div>
          </div>
          <div className="flex-1 grid grid-cols-[1fr_1.6fr] gap-2">
            <button onClick={() => onAddToCart(weapon)} className="font-hud text-[10px] uppercase tracking-[0.14em] py-3 rounded-xl border border-white/15 text-ghost active:scale-95 transition-transform">Panier</button>
            <button onClick={() => onBuyNow(weapon)} className="font-hud text-xs uppercase tracking-[0.14em] py-3 rounded-xl bg-accent text-carbon active:scale-95 transition-transform">Acheter</button>
          </div>
        </div>
      </div>
    </div>
  );
};
