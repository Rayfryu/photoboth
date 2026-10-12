import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Type,
  Smile,
  Layers,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Check,
} from 'lucide-react';
import {
  FilterPreset,
  FrameSettings,
  FrameStyle,
  LayoutType,
  PhotoAdjustment,
} from '../../types/photobooth';
import {
  COLOR_PALETTES,
  DEFAULT_ADJUSTMENTS,
  FRAME_PRESETS,
  LAYOUT_DEFINITIONS,
} from '../../utils/presets';
import { FILTER_PRESET_NAMES } from '../../utils/imageFilters';

interface StudioControlsProps {
  settings: FrameSettings;
  adjustments: PhotoAdjustment;
  onUpdateSettings: (updater: (prev: FrameSettings) => FrameSettings) => void;
  onUpdateAdjustments: (updater: (prev: PhotoAdjustment) => PhotoAdjustment) => void;
  onResetAdjustments: () => void;
  onApplyPreset: (style: FrameStyle) => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  settings,
  adjustments,
  onUpdateSettings,
  onUpdateAdjustments,
  onResetAdjustments,
  onApplyPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'frame' | 'filters' | 'text' | 'stickers'>('layout');

  const STICKER_OPTIONS: Array<{ id: FrameSettings['sticker']; label: string; icon: string }> = [
    { id: null, label: 'None', icon: '∅' },
    { id: 'heart', label: 'Heart', icon: '♡' },
    { id: 'stars', label: 'Star', icon: '★' },
    { id: 'tape', label: 'Tape', icon: 'Tape' },
    { id: 'peace', label: 'Peace', icon: '☮' },
    { id: 'kiss', label: 'Kiss', icon: '💋' },
    { id: 'camera', label: 'Camera', icon: '📷' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col">
      
      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'layout'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Layout
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'frame'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Frame & Color
        </button>

        <button
          onClick={() => setActiveTab('filters')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'filters'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Filters & Grain
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'text'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Text & Date
        </button>

        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'stickers'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          Stickers
        </button>
      </div>

      {/* Tab 1: Layout Selection */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Choose Composition Layout
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(LAYOUT_DEFINITIONS) as LayoutType[]).map((layoutKey) => {
              const def = LAYOUT_DEFINITIONS[layoutKey];
              const isSelected = settings.layout === layoutKey;

              return (
                <button
                  key={layoutKey}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      layout: layoutKey,
                    }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/50 text-stone-900 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display">{def.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    {def.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Frame & Color */}
      {activeTab === 'frame' && (
        <div className="space-y-6">
          
          {/* Preset Styles */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
              Frame Presets
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(FRAME_PRESETS) as FrameStyle[]).map((styleKey) => {
                const preset = FRAME_PRESETS[styleKey];
                const isSelected = settings.style === styleKey;

                return (
                  <button
                    key={styleKey}
                    onClick={() => onApplyPreset(styleKey)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Frame Background Color
              </p>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    backgroundColor: e.target.value,
                  }))
                }
                className="w-6 h-6 rounded-md border border-stone-200 cursor-pointer"
                title="Custom color picker"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = settings.backgroundColor.toLowerCase() === palette.hex.toLowerCase();
                return (
                  <button
                    key={palette.hex}
                    onClick={() =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        backgroundColor: palette.hex,
                        textColor: palette.textHex,
                      }))
                    }
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                      isSelected ? 'border-rose-600 scale-110 shadow-sm' : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: palette.hex }}
                    title={palette.name}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="w-3.5 h-3.5"
                          style={{ color: palette.textHex }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spacing & Borders Sliders */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Frame Border Width</span>
                <span className="font-mono-num">{settings.borderWidth}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="60"
                value={settings.borderWidth}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    borderWidth: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Photo Gap</span>
                <span className="font-mono-num">{settings.photoGap}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                value={settings.photoGap}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    photoGap: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Photo Corner Radius</span>
                <span className="font-mono-num">{settings.borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.borderRadius}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    borderRadius: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Filters & Adjustments */}
      {activeTab === 'filters' && (
        <div className="space-y-6">
          
          {/* Preset Filter Thumbnails */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Filter Presets
              </p>
              <button
                onClick={onResetAdjustments}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(FILTER_PRESET_NAMES) as FilterPreset[]).map((presetKey) => {
                const info = FILTER_PRESET_NAMES[presetKey];
                const isSelected = adjustments.filterPreset === presetKey;

                return (
                  <button
                    key={presetKey}
                    onClick={() =>
                      onUpdateAdjustments((prev) => ({
                        ...prev,
                        filterPreset: presetKey,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{info.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Sliders */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Brightness</span>
                <span className="font-mono-num">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.brightness}
                onChange={(e) =>
                  onUpdateAdjustments((prev) => ({
                    ...prev,
                    brightness: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Contrast</span>
                <span className="font-mono-num">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.contrast}
                onChange={(e) =>
                  onUpdateAdjustments((prev) => ({
                    ...prev,
                    contrast: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Saturation</span>
                <span className="font-mono-num">{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.saturation}
                onChange={(e) =>
                  onUpdateAdjustments((prev) => ({
                    ...prev,
                    saturation: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Vignette Falloff</span>
                <span className="font-mono-num">{adjustments.vignette}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.vignette}
                onChange={(e) =>
                  onUpdateAdjustments((prev) => ({
                    ...prev,
                    vignette: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Analog Film Grain</span>
                <span className="font-mono-num">{adjustments.grain}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.grain}
                onChange={(e) =>
                  onUpdateAdjustments((prev) => ({
                    ...prev,
                    grain: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Text & Date */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Main Caption
            </label>
            <input
              type="text"
              value={settings.caption}
              placeholder="e.g. Snapbooth Memories"
              onChange={(e) =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  caption: e.target.value,
                }))
              }
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Sub-Caption / Studio Tag
            </label>
            <input
              type="text"
              value={settings.subCaption}
              placeholder="e.g. PHOTOBOOTH STUDIO № 01"
              onChange={(e) =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  subCaption: e.target.value,
                }))
              }
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Date Label Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Display Date
              </label>
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    showDate: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-rose-600 cursor-pointer"
              />
            </div>
            {settings.showDate && (
              <input
                type="text"
                value={settings.dateText}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    dateText: e.target.value,
                  }))
                }
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 font-mono-num"
              />
            )}
          </div>

          {/* Font Family Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Typography Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', label: 'Modern Sans', style: 'font-sans' },
                { id: 'serif', label: 'Editorial Serif', style: 'font-serif' },
                { id: 'mono', label: 'Vintage Mono', style: 'font-mono' },
              ].map((font) => (
                <button
                  key={font.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      fontFamily: font.id as 'sans' | 'serif' | 'mono',
                    }))
                  }
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                    settings.fontFamily === font.id
                      ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className={font.style}>{font.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Stickers */}
      {activeTab === 'stickers' && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Decorative Corner Stamp / Sticker
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {STICKER_OPTIONS.map((item) => {
              const isSelected = settings.sticker === item.id;
              return (
                <button
                  key={item.label}
                  onClick={() =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      sticker: item.id,
                    }))
                  }
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
