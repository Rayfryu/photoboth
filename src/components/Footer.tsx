import React from 'react';
import { Camera, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'studio' | 'gallery' | 'showcase') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-white border-t border-stone-200/80 py-12 mt-16 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-100">
          
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4 text-rose-300" />
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900 font-display">
                Snapbooth
              </p>
              <p className="text-[11px] text-stone-500">
                Modern Digital Photobooth & Strip Studio
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 font-medium text-stone-600">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('studio')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Photobooth Studio
            </button>
            <button
              onClick={() => setCurrentTab('showcase')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Frame Styles
            </button>
            <button
              onClick={() => setCurrentTab('gallery')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Saved Gallery
            </button>
          </nav>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>
              100% Client-Side Privacy: Camera feed and captures are processed directly in your browser.
            </span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} Snapbooth. All moments preserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
