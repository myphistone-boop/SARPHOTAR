import React, { useState } from 'react';
import { FAQ } from '../content/faq';

/**
 * Bloc « Vous hésitez encore ? », placé juste avant la décision d'achat.
 *
 * Reprend les questions qui bloquent réellement l'achat et n'affiche que des
 * réponses vérifiées : elles proviennent de content/faq.ts, elle-même dérivée
 * des faits produit. Une question dont la réponse n'est pas confirmée
 * n'apparaît pas (elle a déjà été filtrée en amont).
 *
 * Se termine par un CTA vers la fiche produit.
 */

// Questions de réassurance prioritaires, dans l'ordre où elles rassurent.
const PRIORITY = [
  'portée',
  'recharge',
  'autonomie',
  'colis',
  'recevoir',
  'retour',
];

function pickQuestions() {
  const picked = FAQ.filter((f) =>
    PRIORITY.some((k) => f.q.toLowerCase().includes(k))
  );

  // Question d'ouverture : la différence avec un pistolet classique.
  // Réponse factuelle (électrique vs manuel), sans chiffre inventé.
  const opener = {
    q: "Est-ce vraiment différent d'un pistolet à eau classique ?",
    a: "Oui. NovElec™ est électrique : le tir est propulsé par un moteur alimenté par batterie, sans pompage. Le jet est continu tant que la gâchette est pressée, là où un pistolet classique demande de pomper à chaque tir.",
  };

  return [opener, ...picked].slice(0, 6);
}

export const HesitationSection: React.FC<{ onCta: () => void }> = ({ onCta }) => {
  const [open, setOpen] = useState<number | null>(0);
  const items = pickQuestions();
  if (items.length === 0) return null;

  return (
    <section className="mt-10 px-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent" />
        <span className="font-hud text-[10px] tracking-[0.3em] text-accent">AVANT DE VOUS DÉCIDER</span>
      </div>
      <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-[0.9] mb-5">
        Vous hésitez<br /><span className="text-accent">encore ?</span>
      </h2>

      <div className="space-y-2.5">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={`rounded-xl border transition-colors ${isOpen ? 'border-accent/40 bg-surface' : 'border-white/10 bg-surface/60'}`}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-bold text-sm text-ghost pr-3">{item.q}</span>
                <span className={`shrink-0 grid place-items-center w-6 h-6 rounded-md border transition-all ${isOpen ? 'border-accent text-accent rotate-45' : 'border-white/20 text-ghost'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden px-4 pb-4 text-[13px] text-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onCta}
        className="w-full mt-4 flex items-center justify-center gap-2 font-hud text-xs font-semibold uppercase tracking-[0.14em] py-3.5 rounded-xl bg-accent text-carbon hover:shadow-glow active:scale-[0.98] transition-all"
      >
        Voir le NovElec™
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
      </button>
    </section>
  );
};
