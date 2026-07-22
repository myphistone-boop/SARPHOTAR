import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface ContactSheetProps { isOpen: boolean; onClose: () => void; }

export const ContactSheet: React.FC<ContactSheetProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) { setMounted(true); setSubmitted(false); document.body.style.overflow = 'hidden'; }
    else { const t = setTimeout(() => setMounted(false), 300); document.body.style.overflow = ''; return () => clearTimeout(t); }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const field = 'bg-surface2 border border-white/10 rounded-lg p-3 text-sm text-ghost placeholder-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all';
  const label = 'font-hud text-[10px] font-medium uppercase tracking-[0.2em] text-muted';

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl bg-surface border-t border-white/10 rounded-t-xl3 max-h-[90vh] overflow-y-auto no-scrollbar pb-safe ${isOpen ? 'sheet-in' : ''}`}>
        <div className="sticky top-0 bg-surface/95 backdrop-blur flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-xl font-black italic uppercase font-display text-ghost">Support Tactique</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-ghost"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center screen-in">
              <div className="w-16 h-16 bg-good/10 border border-good/30 rounded-full grid place-items-center text-good mb-4"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h3 className="text-xl font-black italic uppercase text-ghost mb-2">Message Reçu</h3>
              <p className="text-muted text-sm">Notre équipe vous répondra sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); setTimeout(onClose, 1800); }} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2"><label className={label}>Prénom</label><input required className={field} /></div>
                <div className="flex flex-col gap-2"><label className={label}>Nom</label><input required className={field} /></div>
              </div>
              <div className="flex flex-col gap-2"><label className={label}>N° de commande</label><input placeholder="SAR-20260101-1234" className={field} /></div>
              <div className="flex flex-col gap-2"><label className={label}>Email</label><input required type="email" className={field} /></div>
              <div className="flex flex-col gap-2"><label className={label}>Message</label><textarea required rows={4} className={`${field} resize-none`} /></div>
              <Button type="submit" variant="accent" fullWidth className="mt-1">Envoyer</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
