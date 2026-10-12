/**
 * Snapbooth Types and Configurations
 */

export type CaptureMode = 'single' | 'strip3' | 'strip4' | 'burst';

export type LayoutType = 
  | 'strip-3'       // Classic 3-photo vertical strip
  | 'strip-4'       // Classic 4-photo vertical strip
  | 'grid-2x2'      // 2x2 square collage
  | 'single-frame'  // Single framed portrait / polaroid
  | 'duo-horizontal'; // 2-photo side-by-side

export type FrameStyle = 
  | 'classic-white'   // Clean photobooth paper white
  | 'editorial-black' // Sleek high-contrast jet black
  | 'pink-retro'      // Nostalgic blush pink
  | 'film-strip'      // 35mm film negative with sprocket holes
  | 'vintage-cream'   // Aged warm cream paper
  | 'cyber-silver'    // Minimalist metallic cool silver
  | 'party-confetti'; // Festive playful pastel dots/stars

export type FilterPreset = 
  | 'none'
  | 'bw-classic'
  | 'warm-film'
  | 'cool-nordic'
  | 'vintage-sepia'
  | 'soft-glow'
  | 'noir-high'
  | 'rose-tint';

export interface PhotoAdjustment {
  brightness: number; // -50 to 50
  contrast: number;   // -50 to 50
  saturation: number; // -50 to 50
  vignette: number;   // 0 to 100
  grain: number;      // 0 to 100
  filterPreset: FilterPreset;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  width: number;
  height: number;
}

export interface FrameSettings {
  layout: LayoutType;
  style: FrameStyle;
  backgroundColor: string;
  textColor: string;
  borderWidth: number; // in pixels (base scale)
  photoGap: number;    // in pixels
  borderRadius: number;// in pixels
  showDate: boolean;
  dateText: string;
  caption: string;
  subCaption: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  sticker: 'heart' | 'stars' | 'tape' | 'peace' | 'kiss' | 'camera' | null;
}

export interface SavedSession {
  id: string;
  title: string;
  createdAt: string;
  layout: LayoutType;
  frameStyle: FrameStyle;
  previewUrl: string;
  downloadUrl?: string;
  photosCount: number;
  isCloudSynced?: boolean;
}

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
}

export type CameraStatus = 
  | 'idle' 
  | 'initializing' 
  | 'ready' 
  | 'countdown' 
  | 'capturing' 
  | 'denied' 
  | 'unavailable' 
  | 'error';
