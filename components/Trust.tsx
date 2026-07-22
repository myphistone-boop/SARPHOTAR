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

/* ---------------- Certifications (labels de production) ---------------- */

const CERTS: { code: string; label: string }[] = [
  { code: 'CE', label: 'Conformité EU' },
  { code: 'EN71', label: 'Sécurité jouets' },
  { code: 'RoHS', label: 'Sans substances nocives' },
  { code: 'IPX4', label: 'Résistant éclaboussures' },
  { code: 'BPA-FREE', label: 'Sans BPA' },
  { code: 'ISO 9001', label: 'Qualité de production' },
];

export const CertBadges: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`}>
    {CERTS.map((c) => (
      <div key={c.code} className="flex items-center gap-2.5 bg-surface border border-white/8 rounded-xl px-3 py-2.5 edge-top">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-good shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
        </span>
        <div className="min-w-0">
          <div className="font-hud text-[11px] font-semibold tracking-wide text-ghost leading-none">{c.code}</div>
          <div className="text-[10px] text-muted leading-tight mt-0.5 truncate">{c.label}</div>
        </div>
      </div>
    ))}
  </div>
);
