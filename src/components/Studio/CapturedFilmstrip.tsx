import React from 'react';
import { RotateCcw, Trash2, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CapturedPhoto, LayoutType } from '../../types/photobooth';
import { SAMPLE_PHOTOS } from '../../utils/presets';

interface CapturedFilmstripProps {
  photos: CapturedPhoto[];
  layout: LayoutType;
  requiredCount: number;
  isCapturing: boolean;
  onRetake: (index: number) => void;
  onDelete: (index: number) => void;
  onLoadSamples: () => void;
  onClearAll: () => void;
}

export const CapturedFilmstrip: React.FC<CapturedFilmstripProps> = ({
  photos,
  layout,
  requiredCount,
  isCapturing,
  onRetake,
  onDelete,
  onLoadSamples,
  onClearAll,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2">
            Captured Shots
            <span className="text-xs font-normal text-stone-500 font-mono-num">
              ({photos.length}/{requiredCount} needed)
            </span>
          </h3>
          <p className="text-xs text-stone-500">
            Hover over any shot to retake or remove individual frames.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {photos.length === 0 ? (
            <button
              onClick={onLoadSamples}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample Shots
            </button>
          ) : (
            <button
              onClick={onClearAll}
              disabled={isCapturing}
              className="text-xs font-medium text-stone-500 hover:text-rose-600 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filmstrip Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: requiredCount }).map((_, index) => {
          const photo = photos[index];

          if (photo) {
            return (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs"
              >
                <img
                  src={photo.dataUrl}
                  alt={`Capture shot ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Shot Number Indicator */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white rounded-md font-mono-num">
                  #{index + 1}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onRetake(index)}
                    disabled={isCapturing}
                    title="Retake this shot"
                    className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-lg text-xs font-medium transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    disabled={isCapturing}
                    title="Delete shot"
                    className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-lg text-xs font-medium transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-stone-700" />
                  </button>
                </div>
              </div>
            );
          }

          // Empty Slot
          return (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center p-3 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center font-bold text-xs font-mono-num mb-1">
                {index + 1}
              </div>
              <p className="text-[11px] text-stone-400">Empty Slot</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
