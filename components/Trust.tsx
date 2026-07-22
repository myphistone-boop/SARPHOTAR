import React from 'react';

// Promo commerciale affichée (fixe), indépendante du calcul exact.
export const PROMO_PCT = 30;

export const DiscountBadge: React.FC<{ price: number; original?: number; className?: string }> = ({ price, original, className = '' }) => {
  if (!original || original <= price) return null;
  return (
    <span className={`font-hud text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-danger text-white ${className}`}>
      −{PROMO_PCT}%
    </span>
  );
};

/* ---------------- Real payment / security logos (inline SVG) ---------------- */

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
const Stripe = () => (
  <svg viewBox="0 0 62 30" className="h-6 w-auto" role="img" aria-label="Stripe">
    <rect width="62" height="30" rx="4" fill="#635BFF" />
    <text x="31" y="20" fontFamily="Arial, sans-serif" fontWeight="800" fontStyle="italic" fontSize="14" fill="#fff" textAnchor="middle">stripe</text>
  </svg>
);

export const PaymentRow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center gap-2 ${className}`}>
    <div className="flex items-center gap-1.5 font-hud text-[9px] tracking-wide text-muted">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-good"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      Paiement 100% sécurisé
    </div>
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <Visa /><Mastercard /><CB /><Stripe />
    </div>
  </div>
);

export const Guarantee: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 flex-wrap font-hud text-[9px] tracking-wide text-muted ${className}`}>
    <span className="flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-good"><path d="M9 12l2 2 4-4" /><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      Satisfait ou remboursé 14j
    </span>
    <span className="flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-good"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
      Livraison offerte
    </span>
  </div>
);

/* ---------------- Labels qualité (non réglementés) ---------------- */

type Seal = { title: string; sub: string; ring: string; icon: React.ReactNode };

const SEALS: Seal[] = [
  { title: 'N°1 DES VENTES', sub: 'Été 2026', ring: '#FFB020', icon: (<><circle cx="12" cy="8" r="6" /><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1" /></>) },
  { title: 'TESTÉ EN LABO', sub: 'Contrôlé avant envoi', ring: '#38E1F0', icon: (<><path d="M10 2v6.3L4.6 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.7-3L14 8.3V2" /><path d="M8.5 2h7" /><path d="M7 15h10" /></>) },
  { title: 'QUALITÉ PREMIUM', sub: 'Finitions vérifiées', ring: '#37E29A', icon: (<><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></>) },
  { title: 'NON-TOXIQUE', sub: 'Matériaux sûrs & sans BPA', ring: '#37E29A', icon: (<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></>) },
  { title: 'RÉSISTANT À L\'EAU', sub: 'Joint étanche renforcé', ring: '#2C90FF', icon: (<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5 12 2.5C11.5 5 10 7.4 8 9.5 6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />) },
  { title: 'GARANTIE 2 ANS', sub: 'SAV réactif 7j/7', ring: '#CAD2DA', icon: (<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" /><path d="m9 12 2 2 4-4" /></>) },
];

export const CertBadges: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`}>
    {SEALS.map((s) => (
      <div key={s.title} className="flex items-center gap-3 bg-surface border border-white/8 rounded-xl px-3 py-2.5 edge-top">
        <span className="relative grid place-items-center w-10 h-10 rounded-full shrink-0" style={{ background: `${s.ring}14`, boxShadow: `inset 0 0 0 1.5px ${s.ring}66, 0 0 12px ${s.ring}22` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.ring} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
        </span>
        <div className="min-w-0">
          <div className="font-hud text-[11px] font-semibold tracking-wide text-ghost leading-none">{s.title}</div>
          <div className="text-[10px] text-muted leading-tight mt-0.5 truncate">{s.sub}</div>
        </div>
      </div>
    ))}
  </div>
);
