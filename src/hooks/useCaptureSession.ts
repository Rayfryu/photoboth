import { useState, useCallback, useRef } from 'react';
import { CapturedPhoto, CaptureMode } from '../types/photobooth';
import { soundEffects } from '../utils/audio';

interface UseCaptureSessionProps {
  captureFrame: () => string | null;
}

export function useCaptureSession({ captureFrame }: UseCaptureSessionProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [countdownDuration, setCountdownDuration] = useState<number>(3); // 3, 5, 10s
  const [captureMode, setCaptureMode] = useState<CaptureMode>('strip3');
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [totalShotsInSession, setTotalShotsInSession] = useState<number>(3);
  const [showFlash, setShowFlash] = useState<boolean>(false);

  // Ref to cancel ongoing countdown if user aborts
  const abortControllerRef = useRef<boolean>(false);

  // Trigger flash effect
  const triggerFlash = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 450);
  }, []);

  // Sleep utility with abort check
  const sleep = (ms: number) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        if (Date.now() - start >= ms || abortControllerRef.current) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
    });
  };

  // Perform a single countdown and snap
  const executeSingleSnap = useCallback(async (): Promise<string | null> => {
    // Run countdown ticks
    for (let count = countdownDuration; count > 0; count--) {
      if (abortControllerRef.current) return null;
      setCountdownValue(count);
      soundEffects.playCountdownTick(count === 1);
      await sleep(1000);
    }

    if (abortControllerRef.current) return null;
    setCountdownValue(0);

    // Flash & Shutter
    triggerFlash();
    soundEffects.playShutterSound();

    // Small delay to capture cleanly
    const dataUrl = captureFrame();
    await sleep(250);
    setCountdownValue(null);

    return dataUrl;
  }, [captureFrame, countdownDuration, triggerFlash]);

  // Start complete photobooth session
  const startSession = useCallback(async (customTotal?: number) => {
    abortControllerRef.current = false;
    setIsCapturing(true);

    let shotsCount = 3;
    if (captureMode === 'single') shotsCount = 1;
    else if (captureMode === 'strip3') shotsCount = 3;
    else if (captureMode === 'strip4') shotsCount = 4;
    else if (captureMode === 'burst') shotsCount = 4;

    if (customTotal) {
      shotsCount = customTotal;
    }

    setTotalShotsInSession(shotsCount);
    const newPhotos: CapturedPhoto[] = [];

    for (let shot = 0; shot < shotsCount; shot++) {
      if (abortControllerRef.current) break;
      setCurrentShotIndex(shot + 1);

      const capturedUrl = await executeSingleSnap();
      if (!capturedUrl || abortControllerRef.current) break;

      const newPhotoItem: CapturedPhoto = {
        id: `photo-${Date.now()}-${shot}`,
        dataUrl: capturedUrl,
        timestamp: Date.now(),
        width: 1280,
        height: 720,
      };

      newPhotos.push(newPhotoItem);
      setPhotos([...newPhotos]);

      // Pause between shots if there are more
      if (shot < shotsCount - 1) {
        await sleep(1200);
      }
    }

    setIsCapturing(false);
    setCountdownValue(null);
    setCurrentShotIndex(0);

    if (newPhotos.length > 0) {
      soundEffects.playCelebrationChime();
    }
  }, [captureMode, executeSingleSnap]);

  // Cancel in-flight session
  const cancelSession = useCallback(() => {
    abortControllerRef.current = true;
    setIsCapturing(false);
    setCountdownValue(null);
  }, []);

  // Retake a specific photo by index
  const retakeSinglePhoto = useCallback(
    async (index: number) => {
      abortControllerRef.current = false;
      setIsCapturing(true);
      setCurrentShotIndex(index + 1);

      const capturedUrl = await executeSingleSnap();
      if (capturedUrl) {
        setPhotos((prev) => {
          const next = [...prev];
          next[index] = {
            id: `photo-${Date.now()}-${index}`,
            dataUrl: capturedUrl,
            timestamp: Date.now(),
            width: 1280,
            height: 720,
          };
          return next;
        });
        soundEffects.playCelebrationChime();
      }

      setIsCapturing(false);
      setCountdownValue(null);
      setCurrentShotIndex(0);
    },
    [executeSingleSnap]
  );

  // Delete specific photo
  const deletePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Set photos manually (e.g. loading samples)
  const replacePhotos = useCallback((newPhotos: CapturedPhoto[]) => {
    setPhotos(newPhotos);
  }, []);

  return {
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
  };
}
