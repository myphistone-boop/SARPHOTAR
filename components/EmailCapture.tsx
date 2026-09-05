import React, { useEffect, useState } from 'react';
import { campaign } from '../content/campaign';
import { Button } from './ui/Button';

/**
 * Capture d'e-mail — un seul popup sur tout le site.
 *
 * Règles d'apparition, volontairement peu intrusives :
 *  • jamais à l'arrivée : il faut au minimum 40 secondes de présence,
 *    ou avoir parcouru 55 % de la page ;
 *  • une intention de sortie sur desktop peut le déclencher plus tôt ;
 *  • il ne s'affiche qu'UNE fois : refusé ou soumis, on ne le revoit plus ;
 *  • jamais pendant qu'une autre couche est ouverte (panier, fiche produit,
 *    consentement), pour ne jamais s'interposer dans un achat en cours.
 *
 * Le texte suit la campagne active (content/campaign.ts).
 */

const SEEN_KEY = 'sarphotar_email_capture_seen';

export const EmailCapture: React.FC<{ blocked?: boolean }> = ({ blocked = false }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blocked) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setOpen(true);
    };

    const timer = window.setTimeout(trigger, 40_000);

    const onScroll = () => {
      const progress = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (progress > 0.55) trigger();
    };

    // Intention de sortie : uniquement sur pointeur fin (souris), donc desktop.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const isDesktop = window.matchMedia('(pointer: fine)').matches;

    window.addEventListener('scroll', onScroll, { passive: true });
    if (isDesktop) document.addEventListener('mouseout', onLeave);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [blocked]);

  const dismiss = () => {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* mode privé */ }
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: campaign.id, website: '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error ?? "L'inscription a échoué.");
        return;
      }
      setStatus('done');
      try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* mode privé */ }
      setTimeout(() => setOpen(false), 2000);
    } catch {
      setStatus('error');
      setError('Connexion impossible.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[125] flex items-end sm:items-center justify-center p-4" role="dialog" aria-label="Inscription aux offres">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-sm bg-surface border border-white/12 rounded-xl3 shadow-card edge-top p-6 animate-rise mb-20 sm:mb-0">
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-3 right-3 p-2 rounded-full text-muted hover:text-ghost hover:bg-white/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {status === 'done' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-good/10 border border-good/30 grid place-items-center text-good mx-auto mb-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-lg font-black italic uppercase font-display text-ghost">C'est noté</p>
            <p className="text-[13px] text-muted mt-1">Vous serez informé de nos prochaines offres.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-black italic uppercase font-display text-ghost leading-tight mb-2 pr-6">
              {campaign.emailCapture.title}
            </h2>
            <p className="text-[13px] text-muted leading-relaxed mb-4">{campaign.emailCapture.subtitle}</p>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              autoComplete="email"
              disabled={status === 'sending'}
              className="w-full bg-surface2 border border-white/10 rounded-lg p-3 text-sm text-ghost placeholder-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all mb-3"
            />

            {/* Consentement décoché par défaut — exigence RGPD. */}
            <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-[#CAD2DA]"
              />
              <span className="text-[11px] text-muted leading-relaxed">
                J'accepte de recevoir les offres de Sarphotar™ par e-mail. Je peux me désinscrire à tout moment.
              </span>
            </label>

            {status === 'error' && error && (
              <p role="alert" className="text-[12px] text-danger mb-3">{error}</p>
            )}

            <Button type="submit" variant="accent" fullWidth disabled={status === 'sending' || !consent}>
              {status === 'sending' ? 'Envoi en cours' : campaign.emailCapture.button}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
