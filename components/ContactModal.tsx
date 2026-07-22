import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setAnimateIn(true));
      setSubmitted(false);
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (!isOpen && !animateIn) return null;

  const field = 'bg-panel2 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-muted focus:border-hud focus:ring-1 focus:ring-hud outline-none transition-all';
  const label = 'font-hud text-[10px] font-medium uppercase tracking-[0.2em] text-muted';

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-panel border border-white/10 w-full max-w-lg rounded-2xl shadow-panel overflow-hidden flex flex-col transition-transform duration-300 ${animateIn ? 'scale-100 translate-y-0' : 'scale-95 translate-y-6'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-black italic uppercase font-display text-white">Support Tactique</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="p-7">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-float-up">
              <div className="w-16 h-16 bg-hud/10 border border-hud/30 rounded-full grid place-items-center text-hud mb-4">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white mb-2">Message Reçu</h3>
              <p className="text-muted text-sm">Notre équipe vous répondra sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2"><label className={label}>Prénom</label><input required type="text" className={field} /></div>
                <div className="flex flex-col gap-2"><label className={label}>Nom</label><input required type="text" className={field} /></div>
              </div>
              <div className="flex flex-col gap-2"><label className={label}>N° de commande</label><input type="text" placeholder="SAR-20260101-1234" className={field} /></div>
              <div className="flex flex-col gap-2"><label className={label}>Email</label><input required type="email" className={field} /></div>
              <div className="flex flex-col gap-2"><label className={label}>Message</label><textarea required rows={4} className={`${field} resize-none`} /></div>
              <Button type="submit" variant="primary" fullWidth className="mt-1">Envoyer</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
