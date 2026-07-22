import React, { useState } from 'react';
import { getReviewsForProduct } from '../constants';

const Stars: React.FC<{ n?: number; size?: number }> = ({ n = 5, size = 14 }) => (
  <div className="flex gap-0.5 text-accent2">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= n ? '#FFB020' : 'none'} stroke="#FFB020" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

interface ReviewsPillProps {
  rating?: number;
  count?: number;
}

/** Cliquable : déplie 5 avis clients avec photos. */
export const ReviewsPill: React.FC<ReviewsPillProps> = ({ rating = 4.8, count = 255 }) => {
  const [open, setOpen] = useState(false);
  // les 5 premiers avis du pistolet portent de vraies photos
  const reviews = getReviewsForProduct('pistol-novelec', 5, 0);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 bg-surface border border-white/10 rounded-2xl px-4 py-3 edge-top hover:border-accent2/40 transition-colors active:scale-[0.99]"
      >
        <span className="text-3xl font-black italic font-display text-ghost leading-none">{rating.toString().replace('.', ',')}</span>
        <div className="flex flex-col items-start">
          <Stars n={5} />
          <span className="font-hud text-[10px] tracking-wide text-muted mt-1">{count} avis clients vérifiés</span>
        </div>
        <span className={`ml-auto grid place-items-center w-8 h-8 rounded-full border transition-all ${open ? 'border-accent2 text-accent2 rotate-180' : 'border-white/15 text-ghost'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'max-h-[1600px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-surface border border-white/8 rounded-xl p-4 edge-top">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="grid place-items-center w-8 h-8 rounded-full bg-white/8 border border-white/10 font-hud text-[11px] text-ghost">{r.name.charAt(0)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ghost text-sm">{r.name}</span>
                    {r.verified && <span className="font-hud text-[9px] bg-good/10 text-good px-1.5 py-0.5 rounded-full tracking-wide border border-good/20">VÉRIFIÉ</span>}
                  </div>
                  <span className="font-hud text-[10px] text-muted">{r.date}</span>
                </div>
                <div className="ml-auto"><Stars n={r.rating} size={12} /></div>
              </div>
              <p className="text-sm text-ghost/75 leading-relaxed">"{r.content}"</p>
              {r.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-w-[190px]">
                  <img src={r.image} alt="Photo client" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
