import React from 'react';
import { campaign } from '../content/campaign';
import { Icon } from './Icon';

/**
 * « Plus qu'un pistolet à eau. »
 *
 * Repositionne NovElec™ hors de la seule saison estivale : produit de fun,
 * idée cadeau, expérience. C'est ce qui permet au site de continuer à vendre
 * en octobre sans avoir l'air d'une boutique hors saison.
 *
 * Les intitulés proviennent de la campagne active, plus un bénéfice cadeau
 * permanent — aucun chiffre, donc rien à confirmer.
 */
const GIFT_BENEFIT = {
  icon: 'gift' as const,
  label: 'Idée cadeau',
  detail: 'Un cadeau original pour ceux qui aiment jouer et relever des défis.',
};

export const BenefitsSection: React.FC = () => {
  const seen = new Set<string>();
  const benefits = [...campaign.benefits, GIFT_BENEFIT].filter((b) => {
    if (seen.has(b.label)) return false;
    seen.add(b.label);
    return true;
  });

  return (
    <section className="mt-10 px-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent" />
        <span className="font-hud text-[10px] tracking-[0.3em] text-accent">L'EXPÉRIENCE</span>
      </div>
      <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-[0.9] mb-3">
        Plus qu'un<br /><span className="text-accent">pistolet à eau.</span>
      </h2>
      <p className="text-[15px] text-muted leading-relaxed mb-5">
        NovElec™ transforme une simple bataille d'eau en véritable défi. Électrique, rechargeable et pensé
        pour rendre chaque partie plus intense.
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {benefits.map((b) => (
          <div key={b.label} className="bg-surface border border-white/8 rounded-xl p-4 edge-top">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-accent mb-3">
              <Icon name={b.icon} size={17} />
            </span>
            <div className="text-sm font-black italic uppercase font-display text-ghost leading-tight">{b.label}</div>
            {b.detail && <div className="text-[12px] text-muted leading-relaxed mt-1.5">{b.detail}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};
