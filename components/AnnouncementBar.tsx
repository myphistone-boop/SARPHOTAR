import React, { useEffect, useState } from 'react';
import { announcement as activeAnnouncement, campaign } from '../content/campaign';
import { Icon } from './Icon';
import type { IconName } from '../content/campaign';

/**
 * Barre d'annonce en haut de page.
 *
 * Information saisonnière, jamais une fausse urgence : pas de compteur, pas de
 * « plus que X ». Le texte vient de content/campaign.ts (ANNOUNCEMENTS) et
 * change avec la campagne active, sans toucher au design.
 *
 * En flux normal (elle pousse le hero de quelques pixels, sans le recouvrir).
 * Fermable : une fois fermée, elle ne réapparaît pas pendant la visite.
 */
const KEY = 'sarphotar_announcement_closed';

export const AnnouncementBar: React.FC<{ text?: string; icon?: IconName }> = ({
  text = activeAnnouncement,
  icon = campaign.badgeIcon,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) !== '1') setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible || !text) return null;

  const close = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* mode privé */ }
    setVisible(false);
  };

  return (
    <div className="relative z-30 bg-carbon2 border-b border-white/8">
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 px-9 py-2 text-center">
        <Icon name={icon} size={12} strokeWidth={2} className="text-accent shrink-0" />
        <span className="font-hud text-[10px] tracking-[0.18em] uppercase text-ghost/85 leading-tight">{text}</span>
        <button
          onClick={close}
          aria-label="Fermer l'annonce"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted hover:text-ghost hover:bg-white/10 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
};
