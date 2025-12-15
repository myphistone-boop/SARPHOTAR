import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 px-6 max-w-2xl mx-auto">
      <h2 className="text-4xl font-black italic uppercase mb-12 text-center text-black dark:text-white font-display">FAQ</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="border-b border-black/10 dark:border-white/10 transition-all duration-300">
            <button 
              className="w-full flex items-center justify-between py-6 text-left"
              onClick={() => toggle(idx)}
            >
              <span className="font-bold text-lg text-black dark:text-white">{item.q}</span>
              <span className={`transform transition-transform duration-300 text-black dark:text-white ${openIndex === idx ? 'rotate-45' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </span>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
                <div className="text-textMuted dark:text-darkTextMuted text-base leading-relaxed font-medium">
                    {item.a}
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};