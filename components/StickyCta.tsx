import React, { useEffect, useState } from 'react';
import { campaign } from '../content/campaign';

/**
 * CTA persistant mobile.
 *
 * Apparaît une fois le hero dépassé, et se place AU-DESSUS de la barre
 * d'onglets pour ne jamais la masquer (contrainte mobile du brief).
 * Il disparaît en bas de page pour laisser respirer le CTA final et le
 * pied de page.
 */
export const StickyCta: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = y + window.innerHeight > document.body.scrollHeight - 720;
      setVisible(y > window.innerHeight * 0.75 && !atBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-30 px-4 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom) + 10px)' }}
    >
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 font-hud text-xs font-semibold uppercase tracking-[0.14em] py-3.5 rounded-xl bg-accent text-carbon shadow-card hover:shadow-glow active:scale-[0.98] transition-all"
        >
          NovElec™ — {campaign.ctaPrimary}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
