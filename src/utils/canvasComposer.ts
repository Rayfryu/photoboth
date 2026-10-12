  import { CapturedPhoto, FrameSettings, PhotoAdjustment } from '../types/photobooth';
import { applyAdjustmentsToCanvas } from './imageFilters';

interface RenderOptions {
  photos: CapturedPhoto[];
  settings: FrameSettings;
  adjustments: PhotoAdjustment;
  scale?: number; // 1 for preview, 2 for export high-res
}

/**
 * Load an image from dataURL or URL into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Center-crop and draw an image into a specified rectangle with rounded corners
 */
function drawCroppedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement | HTMLImageElement,
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
  radius: number
) {
  ctx.save();

  // Create rounded rectangle clipping path
  ctx.beginPath();
  if (radius > 0) {
    ctx.roundRect(x, y, targetWidth, targetHeight, radius);
  } else {
    ctx.rect(x, y, targetWidth, targetHeight);
  }
  ctx.clip();

  const imgW = 'naturalWidth' in img ? img.naturalWidth : img.width;
  const imgH = 'naturalHeight' in img ? img.naturalHeight : img.height;

  // Calculate center-crop coordinates
  const targetRatio = targetWidth / targetHeight;
  const sourceRatio = imgW / imgH;

  let sourceCropW = imgW;
  let sourceCropH = imgH;
  let sourceCropX = 0;
  let sourceCropY = 0;

  if (sourceRatio > targetRatio) {
    // Source is wider than target
    sourceCropW = imgH * targetRatio;
    sourceCropX = (imgW - sourceCropW) / 2;
  } else {
    // Source is taller than target
    sourceCropH = imgW / targetRatio;
    sourceCropY = (imgH - sourceCropH) / 2;
  }

  ctx.drawImage(
    img,
    sourceCropX,
    sourceCropY,
    sourceCropW,
    sourceCropH,
    x,
    y,
    targetWidth,
    targetHeight
  );

  ctx.restore();
}

/**
 * Helper to draw 35mm film sprocket holes along the edges
 */
function drawFilmSprockets(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  margin: number
) {
  ctx.save();
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  const holeW = margin * 0.45;
  const holeH = margin * 0.7;
  const holeRadius = 4;
  const step = holeH * 1.6;

  ctx.fillStyle = '#ffffff';

  // Left sprocket holes
  const leftX = (margin - holeW) / 2;
  for (let y = step * 0.6; y < height - holeH; y += step) {
    ctx.beginPath();
    ctx.roundRect(leftX, y, holeW, holeH, holeRadius);
    ctx.fill();
  }

  // Right sprocket holes
  const rightX = width - margin + (margin - holeW) / 2;
  for (let y = step * 0.6; y < height - holeH; y += step) {
    ctx.beginPath();
    ctx.roundRect(rightX, y, holeW, holeH, holeRadius);
    ctx.fill();
  }

  // Edge film numbers and markings
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SNAPBOOTH 400', width / 2, margin * 0.6);
  ctx.restore();
}

/**
 * Draw decorative stamps / stickers
 */
function drawSticker(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);

  if (type === 'heart') {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      -size / 2,
      -topCurveHeight / 2,
      -size / 2,
      topCurveHeight * 1.5,
      0,
      size
    );
    // Right curve
    ctx.bezierCurveTo(
      size / 2,
      topCurveHeight * 1.5,
      size / 2,
      -topCurveHeight / 2,
      0,
      topCurveHeight
    );
    ctx.fill();
  } else if (type === 'stars') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      let px = Math.cos(rot) * outerRadius;
      let py = Math.sin(rot) * outerRadius;
      ctx.lineTo(px, py);
      rot += step;

      px = Math.cos(rot) * innerRadius;
      py = Math.sin(rot) * innerRadius;
      ctx.lineTo(px, py);
      rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'tape') {
    // Masking tape strip on corner
    ctx.rotate(-0.15);
    ctx.fillStyle = 'rgba(255, 243, 205, 0.75)';
    ctx.fillRect(-size * 0.8, -size * 0.3, size * 1.6, size * 0.6);
    ctx.strokeStyle = 'rgba(210, 190, 140, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-size * 0.8, -size * 0.3, size * 1.6, size * 0.6);
  } else if (type === 'peace') {
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(0, size / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.35, size * 0.35);
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.35, size * 0.35);
    ctx.stroke();
  } else if (type === 'kiss') {
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(-size * 0.2, 0, size * 0.25, size * 0.15, -0.2, 0, Math.PI * 2);
    ctx.ellipse(size * 0.2, 0, size * 0.25, size * 0.15, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'camera') {
    ctx.fillStyle = '#475569';
    ctx.fillRect(-size * 0.5, -size * 0.35, size, size * 0.7);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-size * 0.2, -size * 0.5, size * 0.4, size * 0.2);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Master Photobooth Composer
 */
export async function renderCompositionToCanvas(
  targetCanvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { photos, settings, adjustments, scale = 1 } = options;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // 1. Prepare loaded and adjusted source images
  const processedImages: HTMLCanvasElement[] = [];
  for (const photo of photos) {
    const rawImg = await loadImage(photo.dataUrl);
    const filterCanvas = document.createElement('canvas');
    filterCanvas.width = rawImg.naturalWidth || 800;
    filterCanvas.height = rawImg.naturalHeight || 800;
    applyAdjustmentsToCanvas(filterCanvas, rawImg, adjustments);
    processedImages.push(filterCanvas);
  }

  // 2. Determine base canvas dimensions according to layout
  const baseMargin = settings.borderWidth * scale;
  const gap = settings.photoGap * scale;
  const borderRadius = settings.borderRadius * scale;

  let canvasW = 600 * scale;
  let canvasH = 1800 * scale;
  let photoWidth = 500 * scale;
  let photoHeight = 400 * scale;
  let rows = 3;
  let cols = 1;
  let footerHeight = 160 * scale;

  if (settings.layout === 'strip-3') {
    rows = 3;
    cols = 1;
    photoWidth = 520 * scale;
    photoHeight = 390 * scale; // 4:3 ratio
    footerHeight = 160 * scale;
    canvasW = photoWidth + baseMargin * 2;
    canvasH = baseMargin + (photoHeight * 3) + (gap * 2) + footerHeight;
  } else if (settings.layout === 'strip-4') {
    rows = 4;
    cols = 1;
    photoWidth = 480 * scale;
    photoHeight = 360 * scale;
    footerHeight = 150 * scale;
    canvasW = photoWidth + baseMargin * 2;
    canvasH = baseMargin + (photoHeight * 4) + (gap * 3) + footerHeight;
  } else if (settings.layout === 'grid-2x2') {
    rows = 2;
    cols = 2;
    photoWidth = 440 * scale;
    photoHeight = 440 * scale; // 1:1 square
    footerHeight = 140 * scale;
    canvasW = (photoWidth * 2) + gap + (baseMargin * 2);
    canvasH = baseMargin + (photoHeight * 2) + gap + footerHeight;
  } else if (settings.layout === 'single-frame') {
    rows = 1;
    cols = 1;
    photoWidth = 640 * scale;
    photoHeight = 640 * scale;
    footerHeight = 180 * scale;
    canvasW = photoWidth + (baseMargin * 2);
    canvasH = baseMargin + photoHeight + footerHeight;
  } else if (settings.layout === 'duo-horizontal') {
    rows = 1;
    cols = 2;
    photoWidth = 460 * scale;
    photoHeight = 460 * scale;
    footerHeight = 140 * scale;
    canvasW = (photoWidth * 2) + gap + (baseMargin * 2);
    canvasH = baseMargin + photoHeight + footerHeight;
  }

  // Adjust canvas size
  targetCanvas.width = canvasW;
  targetCanvas.height = canvasH;

  // 3. Render Background & Frame Style
  ctx.fillStyle = settings.backgroundColor;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Special frame styles
  if (settings.style === 'film-strip') {
    const sprocketMargin = Math.max(baseMargin * 0.9, 36 * scale);
    drawFilmSprockets(ctx, canvasW, canvasH, sprocketMargin);
  } else if (settings.style === 'party-confetti') {
    // Draw subtle celebratory confetti dots
    ctx.save();
    const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#34d399'];
    for (let i = 0; i < 45; i++) {
      const cx = (i * 137.5) % canvasW;
      const cy = (i * 97.3) % canvasH;
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(cx, cy, (2 + (i % 3)) * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (settings.style === 'classic-white') {
    // Delicate inner border line
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(6 * scale, 6 * scale, canvasW - 12 * scale, canvasH - 12 * scale);
    ctx.restore();
  }

  // 4. Place each photo in slot
  const totalSlots = rows * cols;
  for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
    const imgToDraw = processedImages[slotIndex % Math.max(1, processedImages.length)];
    if (!imgToDraw) continue;

    const rowIndex = Math.floor(slotIndex / cols);
    const colIndex = slotIndex % cols;

    const x = baseMargin + colIndex * (photoWidth + gap);
    const y = baseMargin + rowIndex * (photoHeight + gap);

    drawCroppedImage(ctx, imgToDraw, x, y, photoWidth, photoHeight, borderRadius);

    // Subtle hairline photo border
    if (settings.style !== 'film-strip') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      if (borderRadius > 0) {
        ctx.roundRect(x, y, photoWidth, photoHeight, borderRadius);
      } else {
        ctx.rect(x, y, photoWidth, photoHeight);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // 5. Render Footer Typography
  const footerStartY = canvasH - footerHeight;
  ctx.save();
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = 'center';

  let fontFam = "'Plus Jakarta Sans', sans-serif";
  if (settings.fontFamily === 'serif') {
    fontFam = "'Playfair Display', Georgia, serif";
  } else if (settings.fontFamily === 'mono') {
    fontFam = "'Space Mono', monospace";
  }

  // A. Primary Caption
  if (settings.caption) {
    ctx.font = `600 ${22 * scale}px ${fontFam}`;
    ctx.fillText(settings.caption, canvasW / 2, footerStartY + 55 * scale);
  }

  // B. Subcaption or Brand Tag
  if (settings.subCaption) {
    ctx.font = `500 ${13 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.letterSpacing = `${2 * scale}px`;
    ctx.fillStyle = settings.textColor;
    ctx.globalAlpha = 0.75;
    ctx.fillText(settings.subCaption.toUpperCase(), canvasW / 2, footerStartY + 88 * scale);
    ctx.globalAlpha = 1;
  }

  // C. Date Label
  if (settings.showDate && settings.dateText) {
    ctx.font = `400 ${12 * scale}px 'Space Mono', monospace`;
    ctx.fillStyle = settings.textColor;
    ctx.globalAlpha = 0.6;
    ctx.fillText(settings.dateText, canvasW / 2, footerStartY + 115 * scale);
    ctx.globalAlpha = 1;
  }

  // 6. Optional Corner Sticker
  if (settings.sticker) {
    const stickerSize = 44 * scale;
    // Place at top-right corner of the first photo
    const stickerX = canvasW - baseMargin - 12 * scale;
    const stickerY = baseMargin + 16 * scale;
    drawSticker(ctx, settings.sticker, stickerX, stickerY, stickerSize);
  }

  ctx.restore();
}

/**
 * Export canvas as Blob
 */
export function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob from canvas'));
        }
      },
      format,
      quality
    );
  });
}
