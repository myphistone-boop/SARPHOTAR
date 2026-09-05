import React from 'react';

/**
 * « Pourquoi passer à l'électrique ? »
 *
 * Comparaison factuelle entre un pistolet à eau électrique et un modèle
 * manuel classique. Aucune marque concurrente n'est citée et rien n'est
 * dénigré : on décrit deux fonctionnements, l'un demande de pomper,
 * l'autre non. C'est une différence réelle et vérifiable.
 */
const ROWS: { label: string; novelec: string; classic: string }[] = [
  { label: 'Propulsion', novelec: 'Tir électrique, sans pompage', classic: 'Fonctionnement manuel' },
  { label: 'Tir', novelec: 'Jet continu tant que la gâchette est pressée', classic: 'Un jet par pompage' },
  { label: 'Énergie', novelec: 'Batterie rechargeable', classic: 'Effort du joueur' },
  { label: 'Expérience', novelec: 'Pensé pour les défis', classic: 'Expérience classique' },
];

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-good shrink-0 mt-0.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Dot = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted shrink-0 mt-0.5" aria-hidden="true">
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);

export const ComparisonSection: React.FC = () => (
  <section className="mt-10 px-5 max-w-2xl mx-auto">
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-accent" />
      <span className="font-hud text-[10px] tracking-[0.3em] text-accent">COMPARAISON</span>
    </div>
    <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-[0.9] mb-5">
      Pourquoi passer<br /><span className="text-accent">à l'électrique ?</span>
    </h2>

    <div className="grid grid-cols-2 gap-2.5">
      {/* NovElec */}
      <div className="bg-surface border border-accent/30 rounded-xl2 p-4 edge-top">
        <div className="font-hud text-[10px] tracking-[0.2em] text-accent mb-3">NOVELEC™</div>
        <ul className="space-y-2.5">
          {ROWS.map((r) => (
            <li key={r.label} className="flex gap-2">
              <Check />
              <span className="text-[13px] text-ghost/85 leading-snug">{r.novelec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pistolet classique */}
      <div className="bg-surface/60 border border-white/8 rounded-xl2 p-4 edge-top">
        <div className="font-hud text-[10px] tracking-[0.2em] text-muted mb-3">PISTOLET CLASSIQUE</div>
        <ul className="space-y-2.5">
          {ROWS.map((r) => (
            <li key={r.label} className="flex gap-2">
              <Dot />
              <span className="text-[13px] text-muted leading-snug">{r.classic}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
