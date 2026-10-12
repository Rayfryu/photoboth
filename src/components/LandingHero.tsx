import React from 'react';
import { Camera, Sparkles, ArrowRight, Palette, Sliders, Download } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
  onExploreStyles: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
  onExploreStyles,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:py-20 lg:py-24 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-4">
              <span>Modern Web Photobooth Experience</span>
              <span aria-hidden="true">·</span>
              <span>No Account Required</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.08] font-display text-balance">
              Your Moments, <br />
              <span className="text-rose-600 font-editorial italic font-normal">
                Your Photobooth.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-xl leading-relaxed">
              Step inside a virtual vintage booth. Capture real webcam frames,
              apply analog film tones, style custom bookmark strips, and download
              instant high-res prints in seconds.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="px-6 py-3.5 text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl transition-all shadow-sm flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                Start Photobooth Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreStyles}
                className="px-5 py-3.5 text-base font-medium text-stone-700 bg-white hover:bg-stone-50 hover:text-stone-900 border border-stone-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                Browse Frame Styles
              </button>
            </div>

            {/* Quiet Feature Markers */}
            <div className="mt-10 pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-bold font-mono-num text-stone-900">4K</p>
                <p className="text-xs text-stone-500 mt-1">Crisp Canvas DPI</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-num text-stone-900">0s</p>
                <p className="text-xs text-stone-500 mt-1">Instant Guest Access</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-num text-stone-900">100%</p>
                <p className="text-xs text-stone-500 mt-1">Private & In-Browser</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Photo Strip Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative flex items-center justify-center gap-4 -rotate-2 hover:rotate-0 transition-transform duration-500 p-2">
              
              {/* Photo Strip 1: Vintage Silver B&W */}
              <div className="w-36 sm:w-44 bg-white p-2.5 sm:p-3 shadow-xl rounded-md border border-stone-200/80 -rotate-3 transition-transform hover:scale-105 duration-300">
                <div className="space-y-2">
                  <div className="aspect-square overflow-hidden bg-stone-100 rounded-xs">
                    <img
                      src="/src/assets/images/demo_photobooth_vintage_1791782074122.jpg"
                      alt="Vintage Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden bg-stone-100 rounded-xs">
                    <img
                      src="/src/assets/images/demo_photobooth_vintage_1791782074122.jpg"
                      alt="Vintage Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden bg-stone-100 rounded-xs">
                    <img
                      src="/src/assets/images/demo_photobooth_vintage_1791782074122.jpg"
                      alt="Vintage Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] font-bold tracking-widest text-stone-800 uppercase font-mono-num">
                    NOIR EDITION
                  </p>
                  <p className="text-[8px] text-stone-400 mt-0.5 font-mono-num">
                    OCT 11 · 2026
                  </p>
                </div>
              </div>

              {/* Photo Strip 2: Blush Retro Heart (Slightly taller / featured) */}
              <div className="w-40 sm:w-48 bg-rose-50/90 p-3 sm:p-3.5 shadow-2xl rounded-lg border border-rose-200/70 rotate-2 transition-transform hover:scale-105 duration-300 relative z-10">
                <div className="absolute -top-2 -right-2 text-rose-500 text-lg">
                  ♡
                </div>
                <div className="space-y-2.5">
                  <div className="aspect-square overflow-hidden bg-rose-100 rounded-sm">
                    <img
                      src="/src/assets/images/demo_photobooth_laugh_1791782061334.jpg"
                      alt="Laughing Friends Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden bg-rose-100 rounded-sm">
                    <img
                      src="/src/assets/images/demo_photobooth_duo_1791782085669.jpg"
                      alt="Retro Friends Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden bg-rose-100 rounded-sm">
                    <img
                      src="/src/assets/images/demo_photobooth_laugh_1791782061334.jpg"
                      alt="Laughing Friends Photobooth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-3.5 text-center">
                  <p className="text-[11px] font-editorial italic font-bold text-rose-950">
                    Snapbooth Memories
                  </p>
                  <p className="text-[9px] tracking-wider text-rose-700/80 font-mono-num mt-0.5">
                    PARIS · AUTUMN 2026
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
