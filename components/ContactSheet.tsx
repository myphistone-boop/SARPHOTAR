import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { SUPPORT } from '../content/facts';

interface ContactSheetProps { isOpen: boolean; onClose: () => void; }

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Formulaire de contact.
 *
 * L'ancienne version affichait « Message reçu » sans rien envoyer : le
 * client croyait avoir écrit, la boutique ne recevait rien. Le formulaire
 * poste désormais réellement vers /api/contact, et n'annonce le succès
 * qu'après confirmation du serveur.
 */
export const ContactSheet: React.FC<ContactSheetProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setStatus('idle');
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      const t = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const field = 'bg-surface2 border border-white/10 rounded-lg p-3 text-sm text-ghost placeholder-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50';
  const label = 'font-hud text-[10px] font-medium uppercase tracking-[0.2em] text-muted';

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      orderNumber: fd.get('orderNumber'),
      message: fd.get('message'),
      website: fd.get('website'), // piège à robots
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setError(data.error ?? "L'envoi a échoué.");
        return;
      }
      setStatus('sent');
      setTimeout(onClose, 2200);
    } catch {
      setStatus('error');
      setError('Connexion impossible. Vérifiez votre réseau.');
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl bg-surface border-t border-white/10 rounded-t-xl3 max-h-[90vh] overflow-y-auto no-scrollbar pb-safe ${isOpen ? 'sheet-in' : ''}`}>
        <div className="sticky top-0 bg-surface/95 backdrop-blur flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-xl font-black italic uppercase font-display text-ghost">Nous contacter</h2>
          <button onClick={onClose} aria-label="Fermer" className="p-2 hover:bg-white/10 rounded-full text-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="p-6">
          {status === 'sent' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center screen-in">
              <div className="w-16 h-16 bg-good/10 border border-good/30 rounded-full grid place-items-center text-good mb-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-xl font-black italic uppercase text-ghost mb-2">Message envoyé</h3>
              <p className="text-muted text-sm">{SUPPORT.responseTime}.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className={label} htmlFor="c-first">Prénom</label>
                  <input id="c-first" name="firstName" required autoComplete="given-name" disabled={status === 'sending'} className={field} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={label} htmlFor="c-last">Nom</label>
                  <input id="c-last" name="lastName" autoComplete="family-name" disabled={status === 'sending'} className={field} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={label} htmlFor="c-order">N° de commande <span className="normal-case tracking-normal text-muted/60">(facultatif)</span></label>
                <input id="c-order" name="orderNumber" placeholder="SAR-20260101-1234" disabled={status === 'sending'} className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={label} htmlFor="c-email">Email</label>
                <input id="c-email" name="email" required type="email" autoComplete="email" disabled={status === 'sending'} className={field} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={label} htmlFor="c-msg">Message</label>
                <textarea id="c-msg" name="message" required rows={4} maxLength={4000} disabled={status === 'sending'} className={`${field} resize-none`} />
              </div>

              {/* Piège à robots — invisible et hors du parcours clavier. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {status === 'error' && error && (
                <div role="alert" className="flex items-start gap-2 bg-danger/10 border border-danger/30 rounded-lg p-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-danger shrink-0 mt-0.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p className="text-[13px] text-ghost/85 leading-relaxed">
                    {error} Vous pouvez aussi écrire à{' '}
                    <a href={`mailto:${SUPPORT.email}`} className="text-accent underline">{SUPPORT.email}</a>.
                  </p>
                </div>
              )}

              <Button type="submit" variant="accent" fullWidth className="mt-1" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi en cours' : 'Envoyer'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
