import React from 'react';

export const DiscountBadge: React.FC<{ price: number; original?: number; className?: string }> = ({ price, original, className = '' }) => {
  if (!original || original <= price) return null;
  const pct = Math.round((1 - price / original) * 100);
  return (
    <span className={`font-hud text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-danger text-white ${className}`}>
      −{pct}%
    </span>
  );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-hud text-[9px] font-semibold tracking-wide text-ghost/80 bg-white/8 border border-white/12 rounded px-1.5 py-0.5 leading-none">
    {children}
  </span>
);

export const PaymentRow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-good"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    <span className="font-hud text-[9px] tracking-wide text-muted">Paiement 100% sécurisé</span>
    <Chip>VISA</Chip>
    <Chip>Mastercard</Chip>
    <Chip>CB</Chip>
    <Chip>Apple&nbsp;Pay</Chip>
    <Chip>Google&nbsp;Pay</Chip>
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
