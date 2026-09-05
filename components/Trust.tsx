import React from 'react';
import { previousPriceFor } from '../content/offer';
import { SHIPPING, RETURNS, WARRANTY, SUPPORT, QUALITY, PRODUCT_FACTS } from '../content/facts';
import { Icon } from './Icon';
import { euro } from '../lib/format';

/**
 * Badge de réduction.
 *
 * Ne s'affiche que si une offre RÉELLE est en cours et qu'un prix de
 * référence réel est déclaré pour ce produit (content/offer.ts).
 * L'ancienne version calculait un pourcentage « arrondi à la dizaine »
 * à partir de prix barrés inventés dans le catalogue.
 */
export const DiscountBadge: React.FC<{ productId: string; price: number; className?: string }> = ({ productId, price, className = '' }) => {
  const previous = previousPriceFor(productId);
  if (previous === null || previous <= price) return null;

  const pct = Math.round((1 - price / previous) * 100);
  if (pct <= 0) return null;

  return (
    <span className={`font-hud text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-danger text-white ${className}`}>
      −{pct}%
    </span>
  );
};

/** Prix de référence barré — réel uniquement, sinon rien. */
export const PreviousPrice: React.FC<{ productId: string; price: number; className?: string }> = ({ productId, price, className = '' }) => {
  const previous = previousPriceFor(productId);
  if (previous === null || previous <= price) return null;
  return <span className={`text-muted line-through decoration-danger ${className}`}>{euro(previous)}</span>;
};

/* ---------------- Logos de paiement (inchangés) ---------------- */

const Visa = () => (
  <svg viewBox="0 0 48 30" className="h-6 w-auto" role="img" aria-label="Visa">
    <rect width="48" height="30" rx="4" fill="#fff" />
    <text x="24" y="21" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="15" fill="#1434CB" textAnchor="middle">VISA</text>
  </svg>
);
const Mastercard = () => (
  <svg viewBox="0 0 48 30" className="h-6 w-auto" role="img" aria-label="Mastercard">
    <rect width="48" height="30" rx="4" fill="#fff" />
    <circle cx="20" cy="15" r="8.5" fill="#EB001B" />
    <circle cx="28" cy="15" r="8.5" fill="#F79E1B" />
    <path d="M24 8.6a8.5 8.5 0 0 0 0 12.8 8.5 8.5 0 0 0 0-12.8Z" fill="#FF5F00" />
  </svg>
);
const CB = () => (
  <svg viewBox="0 0 48 30" className="h-6 w-auto" role="img" aria-label="Carte Bancaire">
    <rect width="48" height="30" rx="4" fill="#fff" />
    <text x="24" y="21" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="15" textAnchor="middle">
      <tspan fill="#20386F">C</tspan><tspan fill="#5AA02C">B</tspan>
    </text>
  </svg>
);
const StripeLogo = () => (
  <svg viewBox="0 0 62 30" className="h-6 w-auto" role="img" aria-label="Stripe">
    <rect width="62" height="30" rx="4" fill="#635BFF" />
    <text x="31" y="20" fontFamily="Arial, sans-serif" fontWeight="800" fontStyle="italic" fontSize="14" fill="#fff" textAnchor="middle">stripe</text>
  </svg>
);

export const PaymentRow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <div className="flex items-center gap-1.5 font-hud text-[9px] tracking-wide text-muted">
      <Icon name="lock" size={12} strokeWidth={2} className="text-good" />
      Paiement sécurisé par Stripe
    </div>
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <Visa /><Mastercard /><CB /><StripeLogo />
    </div>
  </div>
);

/**
 * Micro-réassurance sous les boutons d'achat.
 * Chaque mention est vérifiable :
 *  — la livraison est réellement offerte (aucun shipping_options dans Stripe) ;
 *  — les 14 jours de rétractation sont un droit légal (art. L221-18).
 */
export const Guarantee: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 flex-wrap font-hud text-[9px] tracking-wide text-muted ${className}`}>
    <span className="flex items-center gap-1">
      <Icon name="return" size={12} strokeWidth={2} className="text-good" />
      Rétractation {RETURNS.withdrawalDays} jours
    </span>
    <span className="flex items-center gap-1">
      <Icon name="truck" size={12} strokeWidth={2} className="text-good" />
      {SHIPPING.free ? 'Livraison offerte · ' : 'Livraison '}
      {SHIPPING.deliveryEstimate}
    </span>
  </div>
);

/* ---------------- Labels qualité — confirmés uniquement ---------------- */

type Seal = { title: string; sub: string; ring: string; icon: React.ReactNode };

/**
 * Les labels invérifiables de l'ancienne version ont été retirés :
 * « N°1 DES VENTES · Été 2026 », « TESTÉ EN LABO », « QUALITÉ PREMIUM ».
 * Un classement de ventes non sourcé est une allégation trompeuse.
 *
 * Ceux qui restent sont soit factuels (étanchéité IPX4 documentée), soit
 * légaux (garantie de conformité de 2 ans prévue par la loi), soit
 * conditionnés à une confirmation dans content/facts.ts.
 */
function buildSeals(): Seal[] {
  const seals: Seal[] = [];
  const waterproof = PRODUCT_FACTS['pistol-novelec']?.waterResistance;

  if (waterproof) {
    seals.push({
      title: "RÉSISTANT À L'EAU",
      sub: waterproof.value,
      ring: '#2C90FF',
      icon: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5 12 2.5C11.5 5 10 7.4 8 9.5 6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />,
    });
  }

  seals.push({
    title: `GARANTIE LÉGALE ${WARRANTY.legalConformityYears} ANS`,
    sub: 'Garantie de conformité',
    ring: '#CAD2DA',
    icon: (<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" /><path d="m9 12 2 2 4-4" /></>),
  });

  if (SHIPPING.free) {
    seals.push({
      title: 'LIVRAISON OFFERTE',
      sub: `Réception sous ${SHIPPING.deliveryEstimate}`,
      ring: '#37E29A',
      icon: (<><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
    });
  }

  seals.push({
    title: 'PAIEMENT SÉCURISÉ',
    sub: 'Traité par Stripe',
    ring: '#635BFF',
    icon: (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  });

  // S'activent dès que confirmés dans content/facts.ts.
  if (QUALITY.nonToxic) {
    seals.push({
      title: 'NON-TOXIQUE',
      sub: 'Matériaux sans BPA',
      ring: '#37E29A',
      icon: (<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></>),
    });
  }

  if (QUALITY.ceMarking) {
    seals.push({
      title: 'CONFORMITÉ CE',
      sub: 'Directive jouets 2009/48/CE',
      ring: '#38E1F0',
      icon: (<><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></>),
    });
  }

  if (QUALITY.testedBeforeShipping) {
    seals.push({
      title: 'CONTRÔLÉ AVANT ENVOI',
      sub: 'Vérifié à la préparation',
      ring: '#38E1F0',
      icon: (<><path d="M10 2v6.3L4.6 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.7-3L14 8.3V2" /><path d="M8.5 2h7" /><path d="M7 15h10" /></>),
    });
  }

  return seals;
}

export const CertBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  const seals = buildSeals();
  if (seals.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`}>
      {seals.map((s) => (
        <div key={s.title} className="flex items-center gap-3 bg-surface border border-white/8 rounded-xl px-3 py-2.5 edge-top">
          <span className="relative grid place-items-center w-10 h-10 rounded-full shrink-0" style={{ background: `${s.ring}14`, boxShadow: `inset 0 0 0 1.5px ${s.ring}66, 0 0 12px ${s.ring}22` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.ring} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
          </span>
          <div className="min-w-0">
            <div className="font-hud text-[11px] font-semibold tracking-wide text-ghost leading-none">{s.title}</div>
            <div className="text-[10px] text-muted leading-tight mt-0.5 truncate">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Bloc de réassurance en quatre points (brief §8).
 * Les formulations restent prudentes : on ne promet ni « livraison rapide »,
 * ni « retour gratuit », ni suivi systématique tant que ce n'est pas établi.
 */
export const ReassuranceGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const items = [
    {
      icon: 'lock' as const,
      title: 'Paiement sécurisé',
      body: 'Vos paiements sont traités de manière sécurisée par Stripe.',
    },
    {
      icon: 'truck' as const,
      title: SHIPPING.free ? 'Livraison offerte' : 'Livraison',
      body: [
        `Réception sous ${SHIPPING.deliveryEstimate} en moyenne.`,
        SHIPPING.trackingAlways
          ? 'Un numéro de suivi vous est transmis dès l’expédition.'
          : 'Suivez votre commande lorsqu’un suivi est disponible.',
      ].join(' '),
    },
    {
      icon: 'return' as const,
      title: 'Retours',
      body: `Vous disposez de ${RETURNS.withdrawalDays} jours pour changer d’avis. Consultez notre politique de retour pour connaître les conditions applicables.`,
    },
    {
      icon: 'chat' as const,
      title: 'Service client',
      body: `Une question ? Notre équipe est disponible pour vous aider. ${SUPPORT.responseTime}.`,
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${className}`}>
      {items.map((it) => (
        <div key={it.title} className="bg-surface border border-white/8 rounded-xl p-4 flex items-start gap-3 edge-top">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-accent shrink-0">
            <Icon name={it.icon} size={17} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-black italic uppercase font-display text-ghost leading-tight">{it.title}</div>
            <div className="text-[12px] text-muted leading-relaxed mt-1">{it.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
