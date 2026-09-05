import React, { useRef, useState } from 'react';
import { demoVideo } from '../content/media';

/**
 * « NovElec™ en action » — preuve par la démonstration.
 *
 * Masquée tant qu'aucune vidéo réelle n'est renseignée dans content/media.ts.
 * La vidéo n'est chargée qu'au clic (preload="none" + poster) : la section
 * ne coûte donc rien au temps de chargement de la page.
 */
export const DemoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!demoVideo) return null;

  const play = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section className="mt-10 px-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent" />
        <span className="font-hud text-[10px] tracking-[0.3em] text-accent">EN ACTION</span>
      </div>
      <h2 className="text-3xl font-black italic uppercase font-display text-ghost leading-[0.9] mb-2">
        Regardez NovElec™<br /><span className="text-accent">en action.</span>
      </h2>
      <p className="text-[15px] text-muted leading-relaxed mb-5">Un aperçu suffit pour comprendre la différence.</p>

      <div className="relative rounded-xl2 overflow-hidden border border-white/10 shadow-card edge-top bg-black">
        <video
          ref={videoRef}
          src={demoVideo.src}
          poster={demoVideo.poster}
          preload="none"
          playsInline
          controls={playing}
          onPause={() => setPlaying(false)}
          aria-label={demoVideo.description}
          className="w-full h-auto block"
        />
        {!playing && (
          <button
            onClick={play}
            aria-label="Lire la vidéo de démonstration"
            className="absolute inset-0 grid place-items-center bg-carbon/35 hover:bg-carbon/20 transition-colors group"
          >
            <span className="grid place-items-center w-16 h-16 rounded-full bg-accent text-carbon shadow-glow group-active:scale-90 transition-transform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="7 4 20 12 7 20" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
