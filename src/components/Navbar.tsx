import React from 'react';
import { Camera, Sparkles, Image, Cloud, Layers } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'studio' | 'gallery' | 'showcase';
  setCurrentTab: (tab: 'home' | 'studio' | 'gallery' | 'showcase') => void;
  openCloudModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCloudModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 text-stone-900 group hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 text-left focus-visible:outline-rose-500"
        >
          <span className="w-8 h-8 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center font-bold shadow-xs">
            <Camera className="w-4 h-4 text-rose-300" />
          </span>
          <span className="text-xl font-bold tracking-tight font-display text-stone-900">
            Snapbooth
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setCurrentTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'studio'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : 'hover:text-stone-900'
            }`}
          >
            Studio
          </button>

          <button
            onClick={() => setCurrentTab('showcase')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'showcase'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : 'hover:text-stone-900'
            }`}
          >
            Frame Styles
          </button>

          <button
            onClick={() => setCurrentTab('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'gallery'
                ? 'text-rose-600 font-semibold border-b-2 border-rose-600'
                : 'hover:text-stone-900'
            }`}
          >
            Gallery
          </button>

          <button
            onClick={openCloudModal}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Cloud className="w-3.5 h-3.5 text-stone-400" />
            Cloud Storage
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('studio')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-lg transition-all shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start Photobooth
          </button>
        </div>

      </div>
    </header>
  );
};
