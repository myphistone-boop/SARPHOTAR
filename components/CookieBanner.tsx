import React, { useEffect, useState } from 'react';
import { getConsent, setConsent, trackersConfigured } from '../lib/consent';

/**
 * Bandeau de consentement.
 *
 * Volontairement sobre et non bloquant : il ne recouvre pas le contenu et
 * n'empêche pas d'acheter. Les deux choix sont présentés avec le même poids
 * visuel, comme l'exige la CNIL — refuser doit être aussi simple qu'accepter.
 *
 * Il ne s'affiche que si un Pixel est réellement configuré : sans traceur,
 * il n'y a rien à consentir et le bandeau serait du bruit inutile.
 */
export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trackersConfigured() && getConsent() === null) {
      // Laisse la page s'afficher avant de solliciter le visiteur.
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const choose = (v: 'granted' | 'denied') => {
    setConsent(v);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed left-0 right-0 z-[130] px-4 animate-rise"
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom) + 10px)' }}
    >
      <div className="max-w-2xl mx-auto bg-surface border border-white/12 rounded-xl2 shadow-card edge-top p-4">
        <p className="text-[13px] text-ghost/80 leading-relaxed mb-3">
          Nous utilisons des cookies de mesure d’audience pour comprendre comment le site est utilisé.
          Vous pouvez refuser : le site fonctionne exactement de la même façon.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => choose('denied')}
            className="font-hud text-[11px] uppercase tracking-[0.14em] py-2.5 rounded-xl border border-white/15 text-ghost hover:border-accent hover:text-accent transition-colors active:scale-95"
          >
            Refuser
          </button>
          <button
            onClick={() => choose('granted')}
            className="font-hud text-[11px] uppercase tracking-[0.14em] py-2.5 rounded-xl bg-accent text-carbon hover:shadow-glow transition-all active:scale-95"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};
