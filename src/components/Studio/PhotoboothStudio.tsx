import React, { useState, useEffect } from 'react';
import { CameraBooth } from './CameraBooth';
import { CapturedFilmstrip } from './CapturedFilmstrip';
import { StudioControls } from './StudioControls';
import { CompositionPreview } from './CompositionPreview';
import { useCamera } from '../../hooks/useCamera';
import { useCaptureSession } from '../../hooks/useCaptureSession';
import {
  FrameSettings,
  FrameStyle,
  LayoutType,
  PhotoAdjustment,
  SavedSession,
} from '../../types/photobooth';
import {
  DEFAULT_ADJUSTMENTS,
  FRAME_PRESETS,
  getDefaultFrameSettings,
  LAYOUT_DEFINITIONS,
  SAMPLE_PHOTOS,
} from '../../utils/presets';
import { saveSessionToStorage } from '../../utils/storage';
import { isSupabaseConfigured, uploadSessionToSupabase } from '../../utils/supabase';

interface PhotoboothStudioProps {
  initialStyle?: FrameStyle;
  initialLayout?: LayoutType;
  onNavigateToGallery: () => void;
}

export const PhotoboothStudio: React.FC<PhotoboothStudioProps> = ({
  initialStyle = 'classic-white',
  initialLayout = 'strip-3',
  onNavigateToGallery,
}) => {
  // Camera Hook
  const {
    videoRef,
    status: cameraStatus,
    errorMessage,
    devices,
    selectedDeviceId,
    isMirrored,
    isSimulated,
    setIsMirrored,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
    enableSimulatedMode,
  } = useCamera();

  // Capture Engine Hook
  const {
    photos,
    isCapturing,
    countdownValue,
    countdownDuration,
    captureMode,
    currentShotIndex,
    totalShotsInSession,
    showFlash,
    setCountdownDuration,
    setCaptureMode,
    startSession,
    cancelSession,
    retakeSinglePhoto,
    deletePhoto,
    replacePhotos,
    setPhotos,
  } = useCaptureSession({ captureFrame });

  // Settings & Adjustments State
  const [settings, setSettings] = useState<FrameSettings>(() => {
    const base = getDefaultFrameSettings(initialLayout);
    if (FRAME_PRESETS[initialStyle]) {
      return { ...base, ...FRAME_PRESETS[initialStyle].settings };
    }
    return base;
  });

  const [adjustments, setAdjustments] = useState<PhotoAdjustment>(DEFAULT_ADJUSTMENTS);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string>('');

  // Required photos count according to layout
  const requiredCount = LAYOUT_DEFINITIONS[settings.layout]?.photoCount || 3;

  // Apply a frame preset
  const handleApplyPreset = (style: FrameStyle) => {
    const preset = FRAME_PRESETS[style];
    if (preset) {
      setSettings((prev) => ({
        ...prev,
        ...preset.settings,
        style,
      }));
    }
  };

  // Reset adjustments
  const handleResetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      vignette: 0,
      grain: 0,
      filterPreset: 'none',
    });
  };

  // Load sample photos for instant testing
  const handleLoadSamples = () => {
    replacePhotos(SAMPLE_PHOTOS);
  };

  // Clear all captured shots
  const handleClearAll = () => {
    if (window.confirm('Clear all captured shots from this session?')) {
      replacePhotos([]);
    }
  };

  // Save Session to Gallery
  const handleSaveToGallery = async (previewUrl: string) => {
    setIsSaving(true);
    setSaveStatusMessage('Saving session...');

    const newSession: SavedSession = {
      id: `session-${Date.now()}`,
      title: settings.caption || 'Photobooth Session',
      createdAt: new Date().toISOString(),
      layout: settings.layout,
      frameStyle: settings.style,
      previewUrl,
      photosCount: photos.length,
      isCloudSynced: false,
    };

    // 1. Save locally
    saveSessionToStorage(newSession);

    // 2. Optionally upload to Supabase if configured
    if (isSupabaseConfigured()) {
      setSaveStatusMessage('Syncing to Supabase cloud...');
      const uploadRes = await uploadSessionToSupabase(newSession);
      if (uploadRes.success) {
        newSession.isCloudSynced = true;
        saveSessionToStorage(newSession);
      }
    }

    setIsSaving(false);
    setSaveStatusMessage('Saved to Gallery!');
    setTimeout(() => setSaveStatusMessage(''), 2500);
  };

  // Synchronize capture mode when layout changes
  useEffect(() => {
    if (settings.layout === 'single-frame') {
      setCaptureMode('single');
    } else if (settings.layout === 'strip-4' || settings.layout === 'grid-2x2') {
      setCaptureMode('strip4');
    } else {
      setCaptureMode('strip3');
    }
  }, [settings.layout, setCaptureMode]);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
            <span>Photobooth Station</span>
            <span aria-hidden="true">·</span>
            <span>Studio Mode</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display mt-0.5">
            Capture & Create
          </h2>
        </div>

        {saveStatusMessage && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl animate-in fade-in">
            {saveStatusMessage}
          </div>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Camera Viewfinder & Captured Shots (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <CameraBooth
            videoRef={videoRef}
            cameraStatus={cameraStatus}
            errorMessage={errorMessage}
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            isMirrored={isMirrored}
            isSimulated={isSimulated}
            isCapturing={isCapturing}
            countdownValue={countdownValue}
            countdownDuration={countdownDuration}
            captureMode={captureMode}
            currentShotIndex={currentShotIndex}
            totalShotsInSession={totalShotsInSession}
            showFlash={showFlash}
            onStartCamera={() => startCamera()}
            onStopCamera={stopCamera}
            onSwitchCamera={switchCamera}
            onToggleMirror={() => setIsMirrored(!isMirrored)}
            onEnableSimulatedMode={enableSimulatedMode}
            onSetCountdownDuration={setCountdownDuration}
            onSetCaptureMode={setCaptureMode}
            onTriggerCapture={() => startSession(requiredCount)}
            onCancelCapture={cancelSession}
          />

          <CapturedFilmstrip
            photos={photos}
            layout={settings.layout}
            requiredCount={requiredCount}
            isCapturing={isCapturing}
            onRetake={retakeSinglePhoto}
            onDelete={deletePhoto}
            onLoadSamples={handleLoadSamples}
            onClearAll={handleClearAll}
          />

          <StudioControls
            settings={settings}
            adjustments={adjustments}
            onUpdateSettings={setSettings}
            onUpdateAdjustments={setAdjustments}
            onResetAdjustments={handleResetAdjustments}
            onApplyPreset={handleApplyPreset}
          />

        </div>

        {/* Right Column: Live Composite Strip & Export (5 Cols Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <CompositionPreview
            photos={photos}
            settings={settings}
            adjustments={adjustments}
            onSaveToGallery={handleSaveToGallery}
            isSaving={isSaving}
          />
        </div>

      </div>

    </div>
  );
};
