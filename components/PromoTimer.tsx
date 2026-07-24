import React, { useEffect, useState } from 'react';

const DURATION = 2 * 60 * 60 * 1000; // 2 heures
const KEY = 'sarphotar_promo_end';

// Compte à rebours persistant : chaque visiteur dispose de 2h ; à expiration, il repart.
function useCountdown() {
  const [ms, setMs] = useState(DURATION);
  useEffect(() => {
    let end = parseInt(localStorage.getItem(KEY) || '0', 10);
    if (!end || end < Date.now()) { end = Date.now() + DURATION; localStorage.setItem(KEY, String(end)); }
    const tick = () => {
      let r = end - Date.now();
      if (r <= 0) { end = Date.now() + DURATION; localStorage.setItem(KEY, String(end)); r = DURATION; }
      setMs(r);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const t = Math.max(0, Math.floor(ms / 1000));
  return { h: Math.floor(t / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

const p2 = (n: number) => n.toString().padStart(2, '0');

const Tile: React.FC<{ v: number; label: string }> = ({ v, label }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="font-hud font-bold text-xl leading-none tabular-nums text-white bg-black/40 border border-white/10 rounded-md px-2.5 py-1.5 min-w-[38px] text-center">{p2(v)}</span>
    <span className="font-hud text-[8px] tracking-[0.2em] text-white/50">{label}</span>
  </div>
);

/** Grande bannière promo flash avec compte à rebours 2h. */
export const PromoBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { h, m, s } = useCountdown();
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-danger/40 shadow-card ${className}`} style={{ background: 'linear-gradient(105deg, #3a0e0e 0%, #1c0f12 55%, #140e10 100%)' }}>
      <div className="absolute inset-0 opacity-40 pointer-events-none animate-[sheen_3.5s_ease-in-out_infinite]" style={{ background: 'linear-gradient(100deg, transparent 30%, rgba(255,106,44,0.25) 50%, transparent 70%)' }} />
      <div className="relative flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6A2C" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
            <span className="font-hud text-[10px] font-semibold tracking-[0.25em] text-ember">OFFRE FLASH · STOCK LIMITÉ</span>
          </div>
          <div className="text-2xl font-black italic uppercase font-display text-ghost leading-none">Jusqu'à <span className="text-ember">−50%</span></div>
          <div className="font-hud text-[10px] tracking-wide text-white/55 mt-1">L'offre se termine dans :</div>
        </div>
        <div className="flex items-end gap-1.5 shrink-0">
          <Tile v={h} label="HRS" /><span className="font-hud text-white/40 text-lg pb-4">:</span>
          <Tile v={m} label="MIN" /><span className="font-hud text-white/40 text-lg pb-4">:</span>
          <Tile v={s} label="SEC" />
        </div>
      </div>
    </div>
  );
};

/** Version compacte (fiche produit) : bandeau fin avec timer. */
export const PromoStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { h, m, s } = useCountdown();
  return (
    <div className={`flex items-center justify-between gap-2 rounded-xl border border-danger/40 px-3.5 py-2.5 ${className}`} style={{ background: 'linear-gradient(105deg, #3a0e0e, #1c0f12)' }}>
      <span className="flex items-center gap-1.5 font-hud text-[10px] font-semibold tracking-[0.15em] text-ember">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6A2C" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
        OFFRE FLASH
      </span>
      <span className="flex items-center gap-1.5">
        <span className="font-hud text-[10px] text-white/55 tracking-wide">Fin dans</span>
        <span className="font-hud font-bold text-sm tabular-nums text-white bg-black/40 border border-white/10 rounded px-2 py-0.5">{p2(h)}:{p2(m)}:{p2(s)}</span>
      </span>
    </div>
  );
};
