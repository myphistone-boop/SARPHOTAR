import React, { useState, useEffect } from 'react';
import { Weapon } from '../data/catalog';
import { FAQ } from '../content/faq';
import { campaign, ctaAlt, GIFT_LINE } from '../content/campaign';
import { SUPPORT, SHIPPING } from '../content/facts';
import { StatTriplet } from '../components/StatBars';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/Icon';
import { DiscountBadge, PreviousPrice, CertBadges, PaymentRow, Guarantee, ReassuranceGrid } from '../components/Trust';
import { ReviewsPill } from '../components/ReviewsPill';
import { OfferBanner } from '../components/OfferBanner';
import { BenefitsSection } from '../components/BenefitsSection';
import { DemoSection } from '../components/DemoSection';
import { ComparisonSection } from '../components/ComparisonSection';
import { SpecsSection } from '../components/SpecsSection';
import { HesitationSection } from '../components/HesitationSection';
import { AB_HERO_CTA, getVariant, trackImpression } from '../lib/ab';
import { resetConsent } from '../lib/consent';

interface HomeScreenProps {
  weapons: Weapon[];
  giftMode?: boolean;
  onOpenWeapon: (w: Weapon) => void;
  onAddToCart: (w: Weapon) => void;
  onBuyNow: (w: Weapon) => void;
  onGoArsenal: () => void;
  onGoHome: () => void;
  onContact: () => void;
  onOpenLegal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weapons, giftMode = false, onOpenWeapon, onAddToCart, onBuyNow, onGoArsenal, onGoHome, onContact, onOpenLegal,
}) => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [featIdx, setFeatIdx] = useState(0);
  const count = weapons.length;
  const featured = weapons[featIdx] ?? weapons[0];
  const featPrev = () => setFeatIdx((i) => (i - 1 + count) % count);
  const featNext = () => setFeatIdx((i) => (i + 1) % count);

  // CTA principal du hero : variante A/B (désactivée par défaut, voir lib/ab.ts).
  const heroVariant = getVariant('hero_cta', AB_HERO_CTA);
  const heroCtaLabel = heroVariant === 'B' ? ctaAlt : campaign.ctaPrimary;
  useEffect(() => {
    if (AB_HERO_CTA) trackImpression('hero_cta', heroVariant);
  }, [heroVariant]);

  // Mode cadeau : le hero met l'accent sur l'idée cadeau, sans changer le design.
  const heroBadge = giftMode ? 'Idée cadeau' : campaign.badge;
  const heroBadgeIcon = giftMode ? 'gift' : campaign.badgeIcon;

  return (
    <div className="screen-in pb-tabbar">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop" alt="" fetchPriority="high" className="w-full h-full object-cover brightness-[0.4] saturate-[0.8] scale-105 animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/55 to-carbon/25" />
          <div className="absolute inset-0 carbon-soft" />
          <div className="absolute inset-0 tech-grid opacity-30 animate-grid-pan" />
        </div>

        {/* barre de statut */}
        <header className="app-chrome absolute top-0 inset-x-0 z-20 pt-safe">
          <div className="max-w-2xl mx-auto flex items-center justify-between px-5 h-14">
            <button onClick={onGoHome} aria-label="Accueil Sarphotar" className="flex items-center gap-2.5 active:scale-95 transition-transform">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-ghost text-carbon font-display font-black italic text-lg leading-none">S</span>
              <span className="text-base font-black italic tracking-tight font-display text-ghost">SARPHOTAR™</span>
            </button>
            <span className="flex items-center gap-1.5 font-hud text-[9px] tracking-[0.28em] text-accent">
              <Icon name="truck" size={12} strokeWidth={2} /> LIVRAISON OFFERTE
            </span>
          </div>
        </header>

        <div className="absolute bottom-0 inset-x-0 p-6 pb-9 z-10 max-w-2xl mx-auto animate-rise">
          {/* badge de campagne (ou badge cadeau en mode cadeau) */}
          <span className="inline-flex items-center gap-2 mb-3.5 py-1.5 px-3 rounded-full border border-accent/30 bg-accent/5">
            <Icon name={heroBadgeIcon} size={11} strokeWidth={2.2} className="text-accent" />
            <span className="font-hud text-[10px] uppercase tracking-[0.3em] text-accent">{heroBadge}</span>
          </span>

          {/* Titre : bloc monumental + fin de phrase — le tout dans un seul h1,
              afin que le mot-clé « pistolet à eau électrique » reste dans le titre. */}
          <h1 className="mb-3.5">
            <span className="block text-[3.25rem] leading-[0.85] md:text-7xl font-black italic uppercase tracking-tighter text-ghost font-display">
              {campaign.h1Lines.map((l) => <span key={l} className="block">{l}</span>)}
              <span className="block text-glow text-accent">{campaign.h1Accent}</span>
            </span>
            <span className="block text-[15px] font-medium text-ghost/70 mt-3 max-w-md leading-snug">
              {campaign.h1Tail}
            </span>
          </h1>

          <p className="text-[14px] text-ghost/60 mb-4 max-w-md leading-relaxed">{campaign.subtitle}</p>

          {/* Note cadeau, en mode cadeau uniquement */}
          {giftMode && (
            <p className="flex items-center gap-1.5 text-[13px] text-accent/90 mb-4 max-w-md leading-snug">
              <Icon name="gift" size={14} strokeWidth={2} className="shrink-0" />
              {GIFT_LINE}
            </p>
          )}

          {/* bénéfices clés */}
          <ul className="flex items-center gap-x-4 gap-y-1.5 flex-wrap mb-5">
            {campaign.benefits.map((b) => (
              <li key={b.label} className="flex items-center gap-1.5 font-hud text-[10px] uppercase tracking-[0.12em] text-ghost/75">
                <Icon name={b.icon} size={13} strokeWidth={2} className="text-accent" />
                {b.label}
              </li>
            ))}
          </ul>

          {/* Renvoi de l'astérisque des bénéfices chiffrés */}
          {campaign.benefits.some((b) => b.label.includes('*')) && (
            <p className="font-hud text-[8px] tracking-wide text-ghost/35 -mt-3 mb-4">
              * Portée maximale mesurée en conditions optimales.
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="accent" onClick={onGoArsenal} className="flex-1 !py-3.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              {heroCtaLabel}
            </Button>
            <Button variant="outline" onClick={() => onBuyNow(featured)} className="flex-1 !py-3.5">{campaign.ctaSecondary}</Button>
          </div>

          {/* réassurance immédiate sous les CTA */}
          <div className="flex items-center gap-3 flex-wrap mt-3 font-hud text-[9px] tracking-wide text-ghost/50">
            <span className="flex items-center gap-1"><Icon name="lock" size={11} strokeWidth={2} /> Paiement sécurisé</span>
            <span className="flex items-center gap-1"><Icon name="truck" size={11} strokeWidth={2} /> Livraison offerte · {SHIPPING.deliveryEstimate}</span>
            <span className="flex items-center gap-1"><Icon name="return" size={11} strokeWidth={2} /> Retours sous conditions</span>
          </div>
        </div>
      </section>

      {/* ─────────────── OFFRE EN COURS (si réelle) ─────────────── */}
      <section className="px-5 mt-4 max-w-2xl mx-auto empty:mt-0">
        <OfferBanner />
      </section>

      {/* ─────────────────── PIÈCE MAÎTRESSE ─────────────────── */}
      <section className="px-5 mt-4 relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-muted">PIÈCE MAÎTRESSE</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="relative w-full bg-surface border border-white/10 rounded-xl2 overflow-hidden shadow-card edge-top">
          <div className="relative aspect-[4/3]">
            <img key={featured.id} src={featured.image} alt={featured.name} loading="lazy" decoding="async" onClick={() => onOpenWeapon(featured)} className="absolute inset-0 w-full h-full object-cover cursor-pointer animate-fade" />
            <span className="absolute top-3 left-3 font-hud text-[9px] font-semibold tracking-[0.25em] px-2 py-1 rounded backdrop-blur-sm" style={{ color: featured.meta.rarityColor, background: `${featured.meta.rarityColor}22`, border: `1px solid ${featured.meta.rarityColor}55` }}>{featured.meta.rarity}</span>
            <DiscountBadge productId={featured.id} price={featured.price} className="absolute top-3 right-3" />

            <button onClick={featPrev} aria-label="Modèle précédent" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur border border-white/15 text-ghost grid place-items-center hover:border-accent active:scale-90 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={featNext} aria-label="Modèle suivant" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-carbon/65 backdrop-blur border border-white/15 text-ghost grid place-items-center hover:border-accent active:scale-90 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {weapons.map((w, i) => (
                <button key={w.id} onClick={() => setFeatIdx(i)} aria-label={`Voir ${w.name}`} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === featIdx ? 28 : 8, background: i === featIdx ? '#CAD2DA' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>

          <div className="p-5">
            <button onClick={() => onOpenWeapon(featured)} className="block w-full text-left">
              <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-none mb-1">{featured.name}</h2>
              <p className="font-hud text-[10px] tracking-[0.2em] text-muted uppercase mb-4">{featured.tagline}</p>
              <StatTriplet specs={featured.specs} showValue={false} />
              <p className="font-hud text-[9px] text-muted/60 tracking-wide mt-2">Indice comparatif entre les modèles de la gamme.</p>
            </button>
            <div className="flex items-baseline gap-2 mt-4 mb-3">
              <span className="text-2xl font-black font-display text-ghost">{featured.price}€</span>
              <PreviousPrice productId={featured.id} price={featured.price} className="text-sm" />
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

      {/* ─────────────────── RÉASSURANCE ─────────────────── */}
      <section className="mt-8 px-5 max-w-2xl mx-auto">
        <ReassuranceGrid />
      </section>

      {/* ─────────── AVIS CLIENTS (masqué tant qu'il n'y en a pas) ─────────── */}
      <section className="mt-6 px-5 max-w-2xl mx-auto empty:mt-0">
        <ReviewsPill />
      </section>

      {/* ─────────────────── BÉNÉFICES ─────────────────── */}
      <BenefitsSection />

      {/* ─────────────────── DÉMONSTRATION ─────────────────── */}
      <DemoSection />

      {/* ─────────────────── L'ARSENAL ─────────────────── */}
      <section className="mt-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-xl font-black italic uppercase font-display text-ghost">L'Arsenal</h2>
          <button onClick={onGoArsenal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">TOUT VOIR →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
          {weapons.map((w) => (
            <div key={w.id} className="snap-start shrink-0 w-40 bg-surface border border-white/10 rounded-xl overflow-hidden edge-top">
              <button onClick={() => onOpenWeapon(w)} className="block w-full text-left active:scale-[0.98] transition-transform">
                <div className="relative aspect-square">
                  <img src={w.image} alt={w.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 font-hud text-[8px] tracking-[0.2em] px-1.5 py-0.5 rounded backdrop-blur-sm" style={{ color: w.meta.rarityColor, background: `${w.meta.rarityColor}22` }}>{w.meta.klass}</span>
                </div>
                <div className="px-3 pt-3">
                  <div className="text-sm font-black italic uppercase font-display text-ghost leading-tight truncate">{w.name}</div>
                </div>
              </button>
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <span className="font-hud text-sm text-accent">{w.price}€</span>
                <button onClick={() => onAddToCart(w)} aria-label={`Ajouter ${w.name} au panier`} className="grid place-items-center w-7 h-7 rounded-md bg-white/5 border border-white/10 text-ghost hover:border-accent hover:text-accent transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── COMPARAISON ─────────────────── */}
      <ComparisonSection />

      {/* ─────────────────── CARACTÉRISTIQUES ─────────────────── */}
      <SpecsSection productId={featured.id} className="mt-10" title={`Caractéristiques · ${featured.name}`} />

      {/* ─────────────────── QUALITÉ & PAIEMENT ─────────────────── */}
      <section className="mt-10 px-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-accent">QUALITÉ &amp; GARANTIES</span>
        </div>
        <CertBadges />
        <div className="mt-5 bg-surface border border-white/8 rounded-2xl p-5 edge-top">
          <PaymentRow />
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="mt-10 px-5 max-w-2xl mx-auto">
        <h2 className="text-2xl font-black italic uppercase font-display text-ghost mb-4 text-center">Questions fréquentes</h2>
        <div className="space-y-2.5">
          {FAQ.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div key={item.q} className={`rounded-xl border transition-colors ${open ? 'border-accent/40 bg-surface' : 'border-white/10 bg-surface/60'}`}>
                <button onClick={() => setFaqOpen(open ? null : i)} aria-expanded={open} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-bold text-sm text-ghost pr-3">{item.q}</span>
                  <span className={`shrink-0 grid place-items-center w-6 h-6 rounded-md border transition-all ${open ? 'border-accent text-accent rotate-45' : 'border-white/20 text-ghost'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className="overflow-hidden px-4 pb-4 text-[13px] text-muted leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────── VOUS HÉSITEZ ? ─────────────────── */}
      <HesitationSection onCta={() => onOpenWeapon(featured)} />

      {/* ─────────────────── CTA FINAL ─────────────────── */}
      <section className="mt-12 px-5 max-w-2xl mx-auto">
        <div className="bg-surface border border-white/10 rounded-xl3 p-7 text-center edge-top shadow-card">
          <h2 className="text-2xl font-black italic uppercase font-display text-ghost leading-tight mb-2">{campaign.finalCta.title}</h2>
          <p className="text-[14px] text-muted leading-relaxed mb-5 max-w-sm mx-auto">{campaign.finalCta.subtitle}</p>
          <Button variant="accent" onClick={onGoArsenal} fullWidth>{campaign.finalCta.button}</Button>
          <Guarantee className="mt-4 justify-center" />
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="mt-12 px-5 py-8 max-w-2xl mx-auto text-center border-t border-white/8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="grid place-items-center w-7 h-7 rounded-md bg-ghost text-carbon font-display font-black italic text-base leading-none">S</span>
          <span className="text-xl font-black italic font-display text-ghost">SARPHOTAR™</span>
        </div>
        <p className="text-xs text-muted mb-5">Pistolets à eau électriques rechargeables</p>

        <nav className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap mb-4">
          <button onClick={onContact} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">CONTACT</button>
          <button onClick={onOpenLegal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">MENTIONS LÉGALES</button>
          <button onClick={onOpenLegal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">CGV</button>
          <button onClick={onOpenLegal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">LIVRAISON &amp; RETOURS</button>
          <button onClick={onOpenLegal} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">CONFIDENTIALITÉ</button>
          <button onClick={() => { resetConsent(); location.reload(); }} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">COOKIES</button>
        </nav>

        <div className="mb-5"><PaymentRow /></div>

        <a href={`mailto:${SUPPORT.email}`} className="font-hud text-[10px] tracking-[0.2em] text-muted hover:text-accent transition-colors">{SUPPORT.email}</a>
        <p className="font-hud text-[9px] tracking-[0.2em] text-muted/60 mt-4">© {new Date().getFullYear()} SARPHOTAR™</p>
      </footer>
    </div>
  );
};
