import { FrameSettings, FrameStyle, LayoutType, PhotoAdjustment } from '../types/photobooth';

export const SAMPLE_PHOTOS = [
  {
    id: 'sample-1',
    dataUrl: '/src/assets/images/demo_photobooth_laugh_1791782061334.jpg',
    timestamp: Date.now() - 300000,
    width: 1024,
    height: 1024,
  },
  {
    id: 'sample-2',
    dataUrl: '/src/assets/images/demo_photobooth_vintage_1791782074122.jpg',
    timestamp: Date.now() - 200000,
    width: 1024,
    height: 1024,
  },
  {
    id: 'sample-3',
    dataUrl: '/src/assets/images/demo_photobooth_duo_1791782085669.jpg',
    timestamp: Date.now() - 100000,
    width: 1024,
    height: 1024,
  },
];

export const DEFAULT_ADJUSTMENTS: PhotoAdjustment = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  vignette: 15,
  grain: 10,
  filterPreset: 'warm-film',
};

export const COLOR_PALETTES = [
  { name: 'Pure White', hex: '#FFFFFF', textHex: '#18181B' },
  { name: 'Warm Paper', hex: '#FBF9F5', textHex: '#27272A' },
  { name: 'Blush Pink', hex: '#FCE7F3', textHex: '#831843' },
  { name: 'Editorial Noir', hex: '#121214', textHex: '#F4F4F5' },
  { name: 'Butter Cream', hex: '#FEF9C3', textHex: '#713F12' },
  { name: 'Sage Linen', hex: '#ECFDF5', textHex: '#064E3B' },
  { name: 'Sky Ice', hex: '#F0F9FF', textHex: '#0C4A6E' },
  { name: 'Lavender Mist', hex: '#F5F3FF', textHex: '#4C1D95' },
];

export const FRAME_PRESETS: Record<FrameStyle, { name: string; settings: Partial<FrameSettings> }> = {
  'classic-white': {
    name: 'Classic Cardstock',
    settings: {
      style: 'classic-white',
      backgroundColor: '#FFFFFF',
      textColor: '#18181B',
      borderWidth: 32,
      photoGap: 18,
      borderRadius: 4,
      fontFamily: 'sans',
      caption: 'Snapbooth Moments',
      subCaption: 'Studio Photobooth № 01',
      showDate: true,
    },
  },
  'editorial-black': {
    name: 'Editorial Noir',
    settings: {
      style: 'editorial-black',
      backgroundColor: '#0F0F11',
      textColor: '#F4F4F5',
      borderWidth: 36,
      photoGap: 16,
      borderRadius: 0,
      fontFamily: 'serif',
      caption: 'The Edit · Paris',
      subCaption: 'SNAPBOOTH EDITORIAL',
      showDate: true,
    },
  },
  'pink-retro': {
    name: 'Millennial Blush',
    settings: {
      style: 'pink-retro',
      backgroundColor: '#FCE7F3',
      textColor: '#831843',
      borderWidth: 32,
      photoGap: 18,
      borderRadius: 12,
      fontFamily: 'serif',
      caption: 'Sweet Memories ♡',
      subCaption: 'LIMITED EDITION',
      showDate: true,
      sticker: 'heart',
    },
  },
  'film-strip': {
    name: '35mm Film Negative',
    settings: {
      style: 'film-strip',
      backgroundColor: '#0B0B0C',
      textColor: '#FAFAFA',
      borderWidth: 42,
      photoGap: 14,
      borderRadius: 2,
      fontFamily: 'mono',
      caption: 'KODAK FILM 400',
      subCaption: 'FRAME EXP 24',
      showDate: true,
    },
  },
  'vintage-cream': {
    name: 'Warm Nostalgia',
    settings: {
      style: 'vintage-cream',
      backgroundColor: '#F5EFEB',
      textColor: '#44403C',
      borderWidth: 34,
      photoGap: 20,
      borderRadius: 6,
      fontFamily: 'serif',
      caption: 'Golden Days',
      subCaption: 'PORTRAIT SESSIONS',
      showDate: true,
    },
  },
  'cyber-silver': {
    name: 'Minimal Platinum',
    settings: {
      style: 'cyber-silver',
      backgroundColor: '#E2E8F0',
      textColor: '#0F172A',
      borderWidth: 28,
      photoGap: 14,
      borderRadius: 0,
      fontFamily: 'mono',
      caption: 'STUDIO 2026',
      subCaption: 'SERIES IV / CHROME',
      showDate: true,
    },
  },
  'party-confetti': {
    name: 'Party Confetti',
    settings: {
      style: 'party-confetti',
      backgroundColor: '#FAF5FF',
      textColor: '#581C87',
      borderWidth: 32,
      photoGap: 18,
      borderRadius: 14,
      fontFamily: 'sans',
      caption: 'Celebrate Today!',
      subCaption: 'SPECIAL EDITION PARTY',
      showDate: true,
      sticker: 'stars',
    },
  },
};

export const LAYOUT_DEFINITIONS: Record<
  LayoutType,
  { label: string; photoCount: number; description: string }
> = {
  'strip-3': {
    label: 'Vertical 3-Strip',
    photoCount: 3,
    description: 'Classic vertical photobooth strip with 3 sequential shots',
  },
  'strip-4': {
    label: 'Vertical 4-Strip',
    photoCount: 4,
    description: 'Traditional 4-photo arcade photobooth bookmark strip',
  },
  'grid-2x2': {
    label: '2x2 Square Collage',
    photoCount: 4,
    description: 'Balanced modern square grid collage, ideal for social sharing',
  },
  'single-frame': {
    label: 'Single Polaroid',
    photoCount: 1,
    description: 'Timeless instant film polaroid frame with generous chin',
  },
  'duo-horizontal': {
    label: 'Duo Side-by-Side',
    photoCount: 2,
    description: 'Clean two-frame horizontal diptych comparison',
  },
};

export function getDefaultFrameSettings(layout: LayoutType = 'strip-3'): FrameSettings {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  return {
    layout,
    style: 'classic-white',
    backgroundColor: '#FFFFFF',
    textColor: '#18181B',
    borderWidth: 32,
    photoGap: 18,
    borderRadius: 6,
    showDate: true,
    dateText: formattedDate,
    caption: 'Snapbooth Studio',
    subCaption: 'PHOTOBOOTH SESSION',
    fontFamily: 'sans',
    sticker: null,
  };
}
