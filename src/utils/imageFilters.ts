import { PhotoAdjustment, FilterPreset } from '../types/photobooth';

export const FILTER_PRESET_NAMES: Record<FilterPreset, { label: string; description: string }> = {
  'none': { label: 'Original', description: 'Clean, true-to-life color' },
  'bw-classic': { label: 'B&W Classic', description: 'Timeless monochrome silver print' },
  'warm-film': { label: 'Warm Film', description: 'Golden hour nostalgic hues' },
  'cool-nordic': { label: 'Cool Nordic', description: 'Crisp, contemporary daylight tone' },
  'vintage-sepia': { label: 'Vintage Sepia', description: 'Aged 1970s print charm' },
  'soft-glow': { label: 'Soft Glow', description: 'Pastel dream and gentle roll-off' },
  'noir-high': { label: 'High Noir', description: 'Dramatic contrast and rich shadows' },
  'rose-tint': { label: 'Rose Blush', description: 'Romantic soft pink undertone' },
};

/**
 * Apply filters, color adjustments, vignette, and film grain to an offscreen canvas
 */
export function applyAdjustmentsToCanvas(
  targetCanvas: HTMLCanvasElement,
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  adjustments: PhotoAdjustment
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = targetCanvas.width;
  const height = targetCanvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw base image
  ctx.save();
  ctx.drawImage(sourceImage, 0, 0, width, height);
  ctx.restore();

  // 2. Pixel data processing for precision adjustments and presets
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Pre-calculate adjustment factors
  const brightnessOffset = (adjustments.brightness / 100) * 255; // -128 to 128
  const contrastFactor = (259 * (adjustments.contrast + 100)) / (100 * (259 - adjustments.contrast));
  const saturationMult = (adjustments.saturation + 100) / 100; // 0.5 to 1.5

  const preset = adjustments.filterPreset;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // --- A. Preset Tinting & Color Shifts ---
    if (preset === 'bw-classic') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    } else if (preset === 'noir-high') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      // High contrast curve
      const pushed = ((gray - 128) * 1.45) + 128;
      r = pushed;
      g = pushed;
      b = pushed;
    } else if (preset === 'vintage-sepia') {
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      r = tr * 0.95 + 15;
      g = tg * 0.95 + 8;
      b = tb * 0.85;
    } else if (preset === 'warm-film') {
      r = r * 1.08 + 12;
      g = g * 1.02 + 4;
      b = b * 0.92 - 4;
    } else if (preset === 'cool-nordic') {
      r = r * 0.92 - 5;
      g = g * 1.01;
      b = b * 1.12 + 10;
    } else if (preset === 'rose-tint') {
      r = r * 1.1 + 10;
      g = g * 0.98;
      b = b * 1.04 + 6;
    } else if (preset === 'soft-glow') {
      // Gentle lifted blacks
      r = r * 0.9 + 25;
      g = g * 0.9 + 22;
      b = b * 0.9 + 25;
    }

    // --- B. Brightness & Contrast ---
    if (adjustments.brightness !== 0) {
      r += brightnessOffset;
      g += brightnessOffset;
      b += brightnessOffset;
    }

    if (adjustments.contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // --- C. Saturation ---
    if (adjustments.saturation !== 0 && preset !== 'bw-classic' && preset !== 'noir-high') {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lum + (r - lum) * saturationMult;
      g = lum + (g - lum) * saturationMult;
      b = lum + (b - lum) * saturationMult;
    }

    // --- D. Film Grain Noise ---
    if (adjustments.grain > 0) {
      const grainFactor = (adjustments.grain / 100) * 35;
      const noise = (Math.random() - 0.5) * grainFactor;
      r += noise;
      g += noise;
      b += noise;
    }

    // Clamp values 0-255
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  // Put filtered image data back
  ctx.putImageData(imgData, 0, 0);

  // 3. Vignette Effect (Canvas Radial Gradient)
  if (adjustments.vignette > 0) {
    ctx.save();
    const radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.35,
      width / 2,
      height / 2,
      radius
    );
    const alpha = (adjustments.vignette / 100) * 0.85;
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${alpha * 0.4})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
