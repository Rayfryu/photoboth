import React from 'react';
import { Sparkles, ArrowRight, Palette, Layers } from 'lucide-react';
import { FrameStyle, LayoutType } from '../../types/photobooth';
import { FRAME_PRESETS, LAYOUT_DEFINITIONS } from '../../utils/presets';

interface ShowcaseViewProps {
  onSelectStyle: (style: FrameStyle, layout: LayoutType) => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({ onSelectStyle }) => {
  const STYLES_CATALOG: Array<{
    style: FrameStyle;
    layout: LayoutType;
    title: string;
    subtitle: string;
    description: string;
    bgClass: string;
    textClass: string;
    sampleImage: string;
  }> = [
    {
      style: 'classic-white',
      layout: 'strip-3',
      title: 'Classic Arcade Cardstock',
      subtitle: 'TIMELINK ORIGINAL',
      description: 'The definitive vintage photobooth aesthetic. Pristine cardstock border with centered modern typography.',
      bgClass: 'bg-white border-stone-200',
      textClass: 'text-stone-900',
      sampleImage: '/src/assets/images/demo_photobooth_laugh_1791782061334.jpg',
    },
    {
      style: 'editorial-black',
      layout: 'strip-3',
      title: 'Editorial High Noir',
      subtitle: 'STUDIO EDITORIAL',
      description: 'Bold carbon black frame paired with refined high-fashion serif typography. Perfect for artistic black-and-white portraits.',
      bgClass: 'bg-stone-950 border-stone-800',
      textClass: 'text-stone-100',
      sampleImage: '/src/assets/images/demo_photobooth_vintage_1791782074122.jpg',
    },
    {
      style: 'pink-retro',
      layout: 'strip-4',
      title: 'Millennial Blush & Heart',
      subtitle: 'SWEET NOSTALGIA',
      description: 'Romantic soft pastel pink frame with a playful corner heart sticker. Inspired by Japanese purikura booths.',
      bgClass: 'bg-rose-50 border-rose-200',
      textClass: 'text-rose-950',
      sampleImage: '/src/assets/images/demo_photobooth_laugh_1791782061334.jpg',
    },
    {
      style: 'film-strip',
      layout: 'strip-3',
      title: '35mm Film Negative',
      subtitle: 'KODAK ANALOG EXP',
      description: 'Analog negative frame with authentic sprocket holes and edge frame numbers, evoking a darkroom contact sheet.',
      bgClass: 'bg-stone-900 border-stone-800',
      textClass: 'text-stone-200',
      sampleImage: '/src/assets/images/demo_photobooth_vintage_1791782074122.jpg',
    },
    {
      style: 'vintage-cream',
      layout: 'grid-2x2',
      title: 'Warm 1970s Cream',
      subtitle: 'ANTIQUE PAPER',
      description: 'Soft cream rag paper with warm nostalgic typography and subtle vintage warmth. Perfect for memory collages.',
      bgClass: 'bg-[#F5EFEB] border-stone-300',
      textClass: 'text-stone-800',
      sampleImage: '/src/assets/images/demo_photobooth_duo_1791782085669.jpg',
    },
    {
      style: 'party-confetti',
      layout: 'single-frame',
      title: 'Festive Confetti Party',
      subtitle: 'CELEBRATION EDITION',
      description: 'Celebratory pastel frame sprinkled with cheerful confetti dots and a gold star stamp. Ideal for birthdays and events.',
      bgClass: 'bg-purple-50 border-purple-200',
      textClass: 'text-purple-950',
      sampleImage: '/src/assets/images/demo_photobooth_duo_1791782085669.jpg',
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
          <span>Curated Presets</span>
          <span aria-hidden="true">·</span>
          <span>Original Designs</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display mt-1">
          Frames & Layout Showcase
        </h2>
        <p className="text-base text-stone-600 mt-2">
          Explore built-in SVG and Canvas photobooth frames. Choose any aesthetic to launch the studio preloaded with that style.
        </p>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STYLES_CATALOG.map((item) => (
          <div
            key={item.style}
            className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Miniature Frame Simulation */}
              <div className={`p-4 rounded-2xl border ${item.bgClass} shadow-inner mb-5 flex flex-col items-center`}>
                <div className="w-32 aspect-square rounded-lg overflow-hidden shadow-xs bg-stone-200">
                  <img
                    src={item.sampleImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-[10px] font-bold tracking-wider font-mono-num uppercase ${item.textClass}`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-stone-900 font-display">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-mono-num">
                {LAYOUT_DEFINITIONS[item.layout].label}
              </span>
              <button
                onClick={() => onSelectStyle(item.style, item.layout)}
                className="px-3.5 py-2 bg-stone-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Use Style</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
