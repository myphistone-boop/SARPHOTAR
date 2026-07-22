import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="h-px w-8 bg-hud" />
        <h2 className="text-4xl font-black italic uppercase text-white font-display">FAQ</h2>
        <span className="h-px w-8 bg-hud" />
      </div>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <div key={idx} className={`rounded-xl border transition-all duration-300 ${open ? 'border-hud/40 bg-panel' : 'border-white/10 bg-panel/60'}`}>
              <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenIndex(open ? null : idx)}>
                <span className="font-bold text-base text-white pr-4">{item.q}</span>
                <span className={`shrink-0 grid place-items-center w-7 h-7 rounded-md border transition-all duration-300 ${open ? 'border-hud text-hud rotate-45' : 'border-white/20 text-white'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-5 pb-5 text-muted text-sm leading-relaxed font-medium">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
