import React from 'react';
import { specsFor, PRODUCT_FACTS } from '../content/facts';

/**
 * Caractéristiques produit.
 *
 * Alimentée exclusivement par content/facts.ts : une donnée non confirmée
 * (`null`) n'apparaît pas. Si aucune donnée n'est renseignée pour un
 * produit, la section entière disparaît plutôt que d'afficher un tableau vide.
 */
export const SpecsSection: React.FC<{ productId: string; title?: string; className?: string }> = ({
  productId,
  title = 'Caractéristiques',
  className = '',
}) => {
  const specs = specsFor(productId);
  const facts = PRODUCT_FACTS[productId];
  if (specs.length === 0 && !facts?.boxContents && !facts?.care) return null;

  // Les notes de bas de page (« mesuré en conditions optimales ») sont
  // regroupées sous le tableau, référencées par un astérisque numéroté.
  const notes = specs.filter((s) => s.note).map((s) => s.note!);

  return (
    <section className={`px-5 max-w-2xl mx-auto ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent" />
        <span className="font-hud text-[10px] tracking-[0.3em] text-accent">{title.toUpperCase()}</span>
      </div>

      {specs.length > 0 && (
        <div className="bg-surface border border-white/8 rounded-xl2 overflow-hidden edge-top">
          {specs.map((s, i) => {
            const noteIndex = s.note ? notes.indexOf(s.note) + 1 : 0;
            return (
              <div
                key={s.label}
                className={`flex items-baseline justify-between gap-4 px-4 py-3.5 ${i > 0 ? 'border-t border-white/6' : ''}`}
              >
                <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-muted shrink-0">{s.label}</span>
                <span className="text-sm font-black italic font-display text-ghost text-right">
                  {s.value}
                  {noteIndex > 0 && <sup className="font-hud not-italic text-[9px] text-muted ml-0.5">{noteIndex}</sup>}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {facts?.boxContents && (
        <div className="mt-3 bg-surface border border-white/8 rounded-xl2 p-4 edge-top">
          <div className="font-hud text-[10px] uppercase tracking-[0.18em] text-muted mb-2.5">Contenu du colis</div>
          <ul className="space-y-1.5">
            {facts.boxContents.map((c) => (
              <li key={c} className="flex items-start gap-2 text-[13px] text-ghost/85">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-1" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {facts?.care && (
        <div className="mt-3 bg-surface border border-white/8 rounded-xl2 p-4 edge-top">
          <div className="font-hud text-[10px] uppercase tracking-[0.18em] text-muted mb-2.5">Utilisation & entretien</div>
          <ul className="space-y-1.5">
            {facts.care.map((c) => (
              <li key={c} className="text-[13px] text-muted leading-relaxed">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {notes.length > 0 && (
        <ol className="mt-3 space-y-1">
          {notes.map((n, i) => (
            <li key={n} className="font-hud text-[9px] text-muted/70 leading-relaxed">
              <sup>{i + 1}</sup> {n}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
