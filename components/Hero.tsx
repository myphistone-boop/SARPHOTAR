import React from 'react';
import { Button } from './ui/Button';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-black selection:bg-white selection:text-black mt-0">
      
      {/* Background Image - Lifestyle / Urban Night Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop" 
          alt="Atmosphère Sarphotar" 
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom brightness-75"
        />
        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      </div>

      {/* Content Container - Bottom Left Aligned (Nike Style) */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10 flex flex-col items-start max-w-[90rem] mx-auto">
        
        {/* Animated Entrance for Text */}
        <div className="animate-fade-in-up">
            <span className="inline-block py-1.5 px-3 mb-6 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
                Nouvelle Collection
            </span>

            {/* Main Title - Huge & Condensed */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 text-white font-display drop-shadow-2xl">
                REALISME<br/>QUALITE<br/>FUN
            </h1>

            {/* Subtitle - Readable & Concise */}
            <p className="text-base md:text-xl font-medium text-gray-200 mb-10 max-w-xl leading-relaxed drop-shadow-md">
                La puissance électrique entre vos mains. Précision chirurgicale, batterie haute capacité, design furtif. L'été ne sera plus jamais le même.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap gap-4">
                <Button 
                    onClick={onShopClick} 
                    variant="primary"
                    className="!rounded-full !py-4 !px-10 text-sm md:text-base !bg-white !text-black hover:!bg-gray-200 border-none shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
                >
                    Acheter
                </Button>
                
                <Button 
                    onClick={() => {
                        const element = document.querySelector('#specs');
                        element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    variant="secondary"
                    className="!rounded-full !py-4 !px-10 text-sm md:text-base !bg-white/10 backdrop-blur-md !text-white border border-white/30 hover:!bg-white hover:!text-black transition-all hover:scale-105"
                >
                    Découvrir
                </Button>
            </div>
        </div>
      </div>

      {/* Custom Keyframe for Slow Zoom effect on image */}
      <style>{`
        @keyframes slow-zoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
            animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};