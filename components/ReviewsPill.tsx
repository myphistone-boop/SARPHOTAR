import React, { useState } from 'react';
import { REVIEWS, averageRating, reviewCount, formatReviewDate, type Review } from '../content/reviews';

const Stars: React.FC<{ n?: number; size?: number }> = ({ n = 5, size = 14 }) => (
  <div className="flex gap-0.5 text-accent2" aria-label={`${n} sur 5`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= n ? '#FFB020' : 'none'} stroke="#FFB020" strokeWidth="2" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

export const ReviewCard: React.FC<{ review: Review }> = ({ review: r }) => (
  <div className="bg-surface border border-white/8 rounded-xl p-4 edge-top">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="grid place-items-center w-8 h-8 rounded-full bg-white/8 border border-white/10 font-hud text-[11px] text-ghost shrink-0">
        {r.firstName.charAt(0)}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-ghost text-sm">{r.firstName}</span>
          {r.verifiedPurchase && (
            <span className="font-hud text-[9px] bg-good/10 text-good px-1.5 py-0.5 rounded-full tracking-wide border border-good/20">
              ACHAT VÉRIFIÉ
            </span>
          )}
        </div>
        <span className="font-hud text-[10px] text-muted">{formatReviewDate(r.date)}</span>
      </div>
      <div className="ml-auto shrink-0"><Stars n={r.rating} size={12} /></div>
    </div>
    <p className="text-sm text-ghost/75 leading-relaxed">“{r.content}”</p>
    {r.photo && (
      <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-w-[190px]">
        <img src={r.photo} alt="Photo envoyée par un client" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
      </div>
    )}
  </div>
);

/**
 * Pastille de preuve sociale, dépliable.
 *
 * Ne s'affiche QUE s'il existe des avis réels dans content/reviews.ts.
 * La note et le compteur sont calculés sur ces avis — ils ne peuvent pas
 * être décorrélés de ce qui est réellement affiché en dessous.
 */
export const ReviewsPill: React.FC<{ productId?: string }> = ({ productId }) => {
  const [open, setOpen] = useState(false);

  const list = productId ? REVIEWS.filter((r) => r.productId === productId) : REVIEWS;
  const avg = averageRating(productId);
  const count = reviewCount(productId);

  // Aucun avis réel collecté : on n'affiche rien plutôt qu'une note inventée.
  if (avg === null || count === 0) return null;

  const verifiedCount = list.filter((r) => r.verifiedPurchase).length;
  const label = verifiedCount === count
    ? `${count} avis client${count > 1 ? 's' : ''} vérifié${count > 1 ? 's' : ''}`
    : `${count} avis client${count > 1 ? 's' : ''}`;

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 bg-surface border border-white/10 rounded-2xl px-4 py-3 edge-top hover:border-accent2/40 transition-colors active:scale-[0.99]"
      >
        <span className="text-3xl font-black italic font-display text-ghost leading-none">
          {avg.toString().replace('.', ',')}
        </span>
        <div className="flex flex-col items-start">
          <Stars n={Math.round(avg)} />
          <span className="font-hud text-[10px] tracking-wide text-muted mt-1">{label}</span>
        </div>
        <span className={`ml-auto grid place-items-center w-8 h-8 rounded-full border transition-all ${open ? 'border-accent2 text-accent2 rotate-180' : 'border-white/15 text-ghost'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'max-h-[1600px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3">
          {list.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      </div>
    </div>
  );
};
