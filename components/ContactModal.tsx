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
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  if (!isOpen && !animateIn) return null;

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className={`relative bg-white dark:bg-[#111] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-300 ${animateIn ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
            <h2 className="text-xl font-black italic uppercase font-display text-black dark:text-white">
                Nous Contacter
            </h2>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-black dark:text-white"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
            {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-float-up">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-xl font-black italic uppercase text-black dark:text-white mb-2">Message Reçu</h3>
                    <p className="text-textMuted dark:text-gray-400">Notre équipe tactique vous répondra sous 24h.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Prénom</label>
                            <input required type="text" className="bg-surface dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Nom</label>
                            <input required type="text" className="bg-surface dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Numéro de Commande (Client)</label>
                        <input type="text" placeholder="Ex: NOV-12345" className="bg-surface dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white placeholder-gray-500" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Email</label>
                        <input required type="email" className="bg-surface dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-white" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Message</label>
                        <textarea required rows={4} className="bg-surface dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none dark:text-white"></textarea>
                    </div>

                    <Button type="submit" variant="primary" fullWidth className="mt-2">
                        Envoyer
                    </Button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};