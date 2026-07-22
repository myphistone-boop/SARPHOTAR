import React, { useState } from 'react';
import { Weapon } from '../data/catalog';
import { FAQ_ITEMS } from '../constants';
import { StatTriplet } from '../components/StatBars';
import { Button } from '../components/ui/Button';
import { DiscountBadge, Guarantee, CertBadges, PaymentRow } from '../components/Trust';
import { ReviewsPill } from '../components/ReviewsPill';

interface HomeScreenProps {
  weapons: Weapon[];
  onOpenWeapon: (w: Weapon) => void;
  onAddToCart: (w: Weapon) => void;
  onBuyNow: (w: Weapon) => void;
  onGoArsenal: () => void;
  onContact: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ weapons, onOpenWeapon, onAddToCart, onBuyNow, onGoArsenal, onContact }) => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [featIdx, setFeatIdx] = useState(0);
  const count = weapons.length;
  const featured = weapons[featIdx] ?? weapons[0];
  const featPrev = () => setFeatIdx((i) => (i - 1 + count) % count);
  const featNext = () => setFeatIdx((i) => (i + 1) % count);

  return (
    <div className="screen-in pb-tabbar">
      {/* HERO */}
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover brightness-[0.4] saturate-[0.8] scale-105 animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/55 to-carbon/25" />
          <div className="absolute inset-0 carbon-soft" />
          <div className="absolute inset-0 tech-grid opacity-30 animate-grid-pan" />
        </div>

        {/* top status */}
        <div className="app-chrome absolute top-0 inset-x-0 z-20 pt-safe">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-5 h-14">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-ghost text-carbon font-display font-black italic text-lg leading-none">S</span>
              <span className="text-base font-black italic tracking-tight font-display text-ghost">SARPHOTAR™</span>
            </div>
            <span className="flex items-center gap-1.5 font-hud text-[9px] tracking-[0.28em] text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" /> ONLINE
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 pb-10 z-10 max-w-2xl mx-auto animate-rise">
          <span className="inline-flex items-center gap-2 mb-4 py-1.5 px-3 rounded-full border border-accent/30 bg-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-hud text-[10px] uppercase tracking-[0.3em] text-accent">Édition Carbon · 2026</span>
          </span>
          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.82] text-ghost mb-4">
            RÉALISME<br />QUALITÉ<br /><span className="text-glow text-accent">FUN</span>
          </h1>
          <p className="text-base text-ghost/70 mb-6 max-w-md leading-relaxed">
            L'arsenal électrique de la bataille d'eau. Précision, batterie haute capacité, châssis carbone furtif.
          </p>
          <div className="flex gap-3">
            <Button variant="accent" onClick={onGoArsenal} className="flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              Déployer
            </Button>
            <Button variant="outline" onClick={() => onOpenWeapon(featured)} className="flex-1">Inspecter</Button>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-5 -mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-muted">PIÈCE MAÎTRESSE</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="relative w-full bg-surface border border-white/10 rounded-xl2 overflow-hidden shadow-card edge-top">
          {/* image + navigation */}
          <div className="relative aspect-[4/3]">
            <img key={featured.id} src={featured.image} alt={featured.name} loading="lazy" decoding="async" onClick={() => onOpenWeapon(featured)} className="absolute inset-0 w-full h-full object-cover cursor-pointer animate-fade" />
            <span className="absolute top-3 left-3 font-hud text-[9px] font-semibold tracking-[0.25em] px-2 py-1 rounded backdrop-blur-sm" style={{ color: featured.meta.rarityColor, background: `${featured.meta.rarityColor}22`, border: `1px solid ${featured.meta.rarityColor}55` }}>{featured.meta.rarity}</span>
            <DiscountBadge price={featured.price} original={featured.originalPrice} className="absolute top-3 right-3" />

            <button onClick={featPrev} aria-label="Précédent" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur border border-white/15 text-ghost grid place-items-center hover:border-accent active:scale-90 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={featNext} aria-label="Suivant" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur border border-white/15 text-ghost grid place-items-center hover:border-accent active:scale-90 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {weapons.map((_, i) => (
                <button key={i} onClick={() => setFeatIdx(i)} aria-label={`Arme ${i + 1}`} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === featIdx ? 28 : 8, background: i === featIdx ? '#CAD2DA' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>

          {/* body */}
          <div className="p-5">
            <button onClick={() => onOpenWeapon(featured)} className="block w-full text-left">
              <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-none mb-1">{featured.name}</h2>
              <p className="font-hud text-[10px] tracking-[0.2em] text-muted uppercase mb-4">{featured.tagline}</p>
              <StatTriplet specs={featured.specs} />
            </button>
            <div className="flex items-baseline gap-2 mt-4 mb-3">
              <span className="text-2xl font-black font-display text-ghost">{featured.price}€</span>
              {featured.originalPrice && <span className="text-sm text-muted line-through decoration-danger">{featured.originalPrice}€</span>}
              <span className="ml-auto flex items-center gap-1.5 font-hud text-[9px] tracking-widest text-good"><span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse-dot" /> EN STOCK</span>
            </div>
            <div className="grid grid-cols-[1fr_1.5fr] gap-2.5">
              <button onClick={() => onAddToCart(featured)} className="font-hud text-[11px] uppercase tracking-[0.14em] py-3 rounded-xl border border-white/15 text-ghost hover:border-accent hover:text-accent transition-colors active:scale-95">+ Panier</button>
              <button onClick={() => onBuyNow(featured)} className="font-hud text-xs uppercase tracking-[0.14em] py-3 rounded-xl bg-accent text-carbon hover:shadow-glow transition-all active:scale-95">Acheter</button>
            </div>
            <Guarantee className="mt-3 justify-center" />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mt-6 px-5 max-w-2xl mx-auto">
        <ReviewsPill />
      </section>

      {/* QUICK ARSENAL */}
      <section className="mt-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="text-xl font-black italic uppercase font-display text-ghost">L'Arsenal</h3>
          <button onClick={onGoArsenal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">TOUT VOIR →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
          {weapons.map((w) => (
            <button key={w.id} onClick={() => onOpenWeapon(w)} className="snap-start shrink-0 w-40 bg-surface border border-white/10 rounded-xl overflow-hidden text-left active:scale-[0.98] transition-transform edge-top">
              <div className="relative aspect-square">
                <img src={w.image} alt={w.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2 left-2 font-hud text-[8px] tracking-[0.2em] px-1.5 py-0.5 rounded backdrop-blur-sm" style={{ color: w.meta.rarityColor, background: `${w.meta.rarityColor}22` }}>{w.meta.klass}</span>
              </div>
              <div className="p-3">
                <div className="text-sm font-black italic uppercase font-display text-ghost leading-tight truncate">{w.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-hud text-sm text-accent">{w.price}€</span>
                  <span onClick={(e) => { e.stopPropagation(); onAddToCart(w); }} className="grid place-items-center w-7 h-7 rounded-md bg-white/5 border border-white/10 text-ghost hover:border-accent hover:text-accent transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mt-8 px-5 max-w-2xl mx-auto grid grid-cols-3 gap-2.5">
        {[
          { t: 'LIVRAISON', d: 'Offerte FR', icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /></> },
          { t: 'EXPÉDITION', d: 'Sous 24h', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
          { t: 'PAIEMENT', d: 'Stripe sécurisé', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
        ].map((it, i) => (
          <div key={i} className="bg-surface border border-white/8 rounded-xl p-3 flex flex-col items-center text-center edge-top">
            <span className="text-accent mb-1.5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg></span>
            <span className="font-hud text-[9px] tracking-[0.15em] text-ghost">{it.t}</span>
            <span className="text-[10px] text-muted">{it.d}</span>
          </div>
        ))}
      </section>

      {/* QUALITÉ & PAIEMENT */}
      <section className="mt-8 px-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-accent">QUALITÉ &amp; GARANTIES</span>
        </div>
        <CertBadges />
        <div className="mt-5 bg-surface border border-white/8 rounded-2xl p-5 edge-top">
          <PaymentRow />
        </div>
      </section>

      {/* TECH */}
      <section className="mt-10 px-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-accent">INGÉNIERIE</span>
        </div>
        <h3 className="text-3xl font-black italic uppercase font-display text-ghost leading-[0.9] mb-5">Zéro pompage.<br /><span className="text-accent">100% électrique.</span></h3>
        <div className="space-y-2.5">
          {[
            { t: 'MOTEUR HIGH-TORQUE', d: 'Pression constante du premier au dernier tir. Cadence impitoyable.' },
            { t: 'LITHIUM CORE USB-C', d: 'Autonomie longue durée, recharge rapide. Zéro pile jetable.' },
            { t: 'JOINT ÉTANCHE IPX4', d: 'Électronique isolée par joint silicone industriel.' },
          ].map((f, i) => (
            <div key={i} className="bg-surface border border-white/8 rounded-xl p-4 flex items-start gap-3 edge-top">
              <span className="font-hud text-accent text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="text-sm font-black italic uppercase font-display text-ghost">{f.t}</div>
                <div className="text-[13px] text-muted leading-relaxed mt-0.5">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10 px-5 max-w-2xl mx-auto">
        <h3 className="text-2xl font-black italic uppercase font-display text-ghost mb-4 text-center">FAQ</h3>
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div key={i} className={`rounded-xl border transition-colors ${open ? 'border-accent/40 bg-surface' : 'border-white/10 bg-surface/60'}`}>
                <button onClick={() => setFaqOpen(open ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-bold text-sm text-ghost pr-3">{item.q}</span>
                  <span className={`shrink-0 grid place-items-center w-6 h-6 rounded-md border transition-all ${open ? 'border-accent text-accent rotate-45' : 'border-white/20 text-ghost'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-4 pb-4 text-[13px] text-muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 px-5 py-8 max-w-2xl mx-auto text-center border-t border-white/8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="grid place-items-center w-7 h-7 rounded-md bg-ghost text-carbon font-display font-black italic text-base leading-none">S</span>
          <span className="text-xl font-black italic font-display text-ghost">SARPHOTAR™</span>
        </div>
        <p className="text-xs text-muted mb-4">Réalisme et qualité · Édition Carbon</p>
        <button onClick={onContact} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">SUPPORT · sarphotar.pro@gmail.com</button>
        <p className="font-hud text-[9px] tracking-[0.2em] text-muted/60 mt-4">© 2026 SARPHOTAR™ INC.</p>
      </footer>
    </div>
  );
};
