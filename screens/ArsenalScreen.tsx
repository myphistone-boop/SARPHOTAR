import React, { useMemo, useState } from 'react';
import { Weapon } from '../data/catalog';
import { StatTriplet } from '../components/StatBars';

interface ArsenalScreenProps {
  weapons: Weapon[];
  onOpenWeapon: (w: Weapon) => void;
  onAddToCart: (w: Weapon) => void;
}

export const ArsenalScreen: React.FC<ArsenalScreenProps> = ({ weapons, onOpenWeapon, onAddToCart }) => {
  const classes = useMemo(() => ['TOUS', ...Array.from(new Set(weapons.map((w) => w.meta.klass)))], [weapons]);
  const [filter, setFilter] = useState('TOUS');
  const list = filter === 'TOUS' ? weapons : weapons.filter((w) => w.meta.klass === filter);

  return (
    <div className="screen-in pb-tabbar min-h-screen">
      {/* header */}
      <div className="app-chrome sticky top-0 z-30 pt-safe bg-carbon/85 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-2xl mx-auto px-5 pt-3 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-hud text-[9px] tracking-[0.3em] text-accent mb-0.5">SÉLECTION DE L'ÉQUIPEMENT</div>
              <h1 className="text-2xl font-black italic uppercase font-display text-ghost leading-none">Arsenal</h1>
            </div>
            <span className="font-hud text-[10px] tracking-[0.2em] text-muted">{list.length} MODÈLES</span>
          </div>
          {/* filter chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {classes.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`shrink-0 font-hud text-[10px] tracking-[0.15em] px-3.5 py-2 rounded-full border transition-colors ${filter === c ? 'bg-accent text-carbon border-accent' : 'bg-white/[0.03] text-muted border-white/10 hover:text-ghost'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* list */}
      <div className="max-w-2xl mx-auto px-5 pt-4 space-y-4">
        {list.map((w, idx) => (
          <div key={w.id} className="bg-surface border border-white/10 rounded-xl2 overflow-hidden shadow-card edge-top animate-rise" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className="flex items-center justify-between px-4 pt-3.5">
              <span className="font-hud text-[9px] font-semibold tracking-[0.25em] px-2 py-1 rounded" style={{ color: w.meta.rarityColor, background: `${w.meta.rarityColor}1A`, border: `1px solid ${w.meta.rarityColor}44` }}>{w.meta.rarity}</span>
              <span className="font-hud text-[9px] tracking-[0.2em] text-muted">{w.meta.klass} · NIV {String(idx + 1).padStart(2, '0')}</span>
            </div>

            <button onClick={() => onOpenWeapon(w)} className="relative w-full aspect-[16/9] dot-grid mt-1 block">
              <div className="absolute inset-0" style={{ background: `radial-gradient(55% 60% at 50% 55%, ${w.meta.rarityColor}1F, transparent 70%)` }} />
              <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20" />
              <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20" />
              <img src={w.image} alt={w.name} loading="lazy" decoding="async" className="mask-orb absolute inset-0 w-full h-full object-contain p-5" />
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 font-hud text-[9px] tracking-[0.2em] text-accent">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg> INSPECTER 3D
              </span>
            </button>

            <div className="px-4 pt-3">
              <h2 className="text-2xl font-black italic uppercase font-display text-ghost leading-none">{w.name}</h2>
              <p className="font-hud text-[10px] tracking-[0.2em] text-muted uppercase mt-1">{w.tagline}</p>
            </div>

            <div className="px-4 pt-4"><StatTriplet specs={w.specs} /></div>

            <div className="px-4 py-4">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-black font-display text-ghost">{w.price}€</span>
                {w.originalPrice && <span className="text-sm text-muted line-through decoration-danger decoration-2">{w.originalPrice}€</span>}
                <span className="ml-auto flex items-center gap-1.5 font-hud text-[9px] tracking-widest text-good"><span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse-dot" /> EN STOCK</span>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] gap-2">
                <button onClick={() => onAddToCart(w)} className="font-hud text-[11px] uppercase tracking-[0.14em] py-3 rounded-xl border border-white/15 text-ghost hover:border-accent hover:text-accent transition-colors active:scale-95">+ Panier</button>
                <button onClick={() => onOpenWeapon(w)} className="font-hud text-[11px] uppercase tracking-[0.14em] py-3 rounded-xl bg-ghost text-carbon hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] transition-all active:scale-95">Inspecter</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
