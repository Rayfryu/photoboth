import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Printer,
  Bookmark,
  Share2,
  Check,
  Sparkles,
  Cloud,
  Layers,
} from 'lucide-react';
import { CapturedPhoto, FrameSettings, PhotoAdjustment, SavedSession } from '../../types/photobooth';
import { exportCanvasAsBlob, renderCompositionToCanvas } from '../../utils/canvasComposer';
import { soundEffects } from '../../utils/audio';

interface CompositionPreviewProps {
  photos: CapturedPhoto[];
  settings: FrameSettings;
  adjustments: PhotoAdjustment;
  onSaveToGallery: (previewUrl: string) => void;
  isSaving: boolean;
}

export const CompositionPreview: React.FC<CompositionPreviewProps> = ({
  photos,
  settings,
  adjustments,
  onSaveToGallery,
  isSaving,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Render composition whenever photos or settings change
  const renderPreview = useCallback(async () => {
    if (!canvasRef.current || photos.length === 0) return;
    setIsRendering(true);

    try {
      await renderCompositionToCanvas(canvasRef.current, {
        photos,
        settings,
        adjustments,
        scale: 1, // Preview scale
      });
    } catch (err) {
      console.error('Error rendering composition canvas preview:', err);
    } finally {
      setIsRendering(false);
    }
  }, [photos, settings, adjustments]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // Master High-Resolution Export
  const handleDownload = async () => {
    if (photos.length === 0) return;

    // Create high-resolution export offscreen canvas (Scale 2 for retina / print)
    const exportCanvas = document.createElement('canvas');
    await renderCompositionToCanvas(exportCanvas, {
      photos,
      settings,
      adjustments,
      scale: 2,
    });

    const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    const blob = await exportCanvasAsBlob(exportCanvas, mimeType, 0.95);

    const filename = `snapbooth-${settings.layout}-${Date.now()}.${exportFormat}`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Audio & Confetti burst
    soundEffects.playCelebrationChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#fbbf24', '#38bdf8'],
    });

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy Image to Clipboard
  const handleCopyClipboard = async () => {
    if (photos.length === 0 || !navigator.clipboard?.write) return;

    try {
      const exportCanvas = document.createElement('canvas');
      await renderCompositionToCanvas(exportCanvas, {
        photos,
        settings,
        adjustments,
        scale: 1.5,
      });

      const blob = await exportCanvasAsBlob(exportCanvas, 'image/png');
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  // Print Composition
  const handlePrint = async () => {
    if (photos.length === 0) return;
    const exportCanvas = document.createElement('canvas');
    await renderCompositionToCanvas(exportCanvas, {
      photos,
      settings,
      adjustments,
      scale: 2,
    });

    const dataUrl = exportCanvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Snapbooth Print</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
              img { max-height: 95vh; max-width: 95vw; object-fit: contain; }
              @media print {
                body { margin: 0; }
                img { max-height: 100%; max-width: 100%; page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Save to Gallery
  const handleSaveSession = () => {
    if (!canvasRef.current || photos.length === 0) return;
    const previewDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
    onSaveToGallery(previewDataUrl);
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[460px]">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-stone-900 font-display">
          Strip Canvas Preview
        </h4>
        <p className="text-xs text-stone-500 max-w-xs mt-1.5 leading-relaxed">
          Take your photos in the camera booth above, or click "Load Sample Shots" to start customizing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            Finished Photo Strip
          </h3>
          <p className="text-xs text-stone-500">
            Realtime high-resolution canvas composite
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setExportFormat('png')}
            className={`px-2.5 py-1 font-medium rounded-lg transition-colors cursor-pointer ${
              exportFormat === 'png'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setExportFormat('jpeg')}
            className={`px-2.5 py-1 font-medium rounded-lg transition-colors cursor-pointer ${
              exportFormat === 'jpeg'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            JPEG
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="my-5 flex items-center justify-center bg-stone-100/60 p-4 rounded-2xl overflow-hidden min-h-[420px] max-h-[580px]">
        <div className="relative shadow-2xl rounded-sm overflow-hidden max-h-[520px] max-w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="max-h-[500px] w-auto h-auto object-contain transition-opacity duration-200"
            style={{ opacity: isRendering ? 0.7 : 1 }}
          />
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        
        {/* Primary Download CTA */}
        <button
          onClick={handleDownload}
          className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded Successfully!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download {exportFormat.toUpperCase()} Print</span>
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          
          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-600" />
            <span>Save</span>
          </button>

          <button
            onClick={handleCopyClipboard}
            className="py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print</span>
          </button>

        </div>

      </div>

    </div>
  );
};
