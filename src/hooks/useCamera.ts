import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraDeviceInfo, CameraStatus } from '../types/photobooth';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [devices, setDevices] = useState<CameraDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Enumerate video input devices
  const updateDeviceList = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate media devices:', err);
    }
  }, [selectedDeviceId]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('idle');
  }, []);

  // Start real webcam stream
  const startCamera = useCallback(async (deviceIdToUse?: string) => {
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('unavailable');
      setErrorMessage('Browser mediaDevices API is not supported in this environment.');
      return;
    }

    setStatus('initializing');
    setErrorMessage('');

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const deviceId = deviceIdToUse || selectedDeviceId;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: deviceId
        ? {
            deviceId: { exact: deviceId },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          }
        : {
            facingMode: 'user',
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setStatus('ready');
        };
      } else {
        setStatus('ready');
      }

      setIsSimulated(false);
      await updateDeviceList();
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      console.error('Camera access error:', error);

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatus('denied');
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setStatus('unavailable');
        setErrorMessage('No camera device was detected on your system. You can switch to Simulated Mode below to test.');
      } else {
        setStatus('error');
        setErrorMessage(`Camera error: ${error.message || 'Could not start camera video stream.'}`);
      }
    }
  }, [selectedDeviceId, updateDeviceList]);

  // Switch to simulated / test camera (useful for testing on headless machines or sandboxes)
  const enableSimulatedMode = useCallback(() => {
    stopCamera();
    setIsSimulated(true);
    setStatus('ready');
  }, [stopCamera]);

  // Change camera device
  const switchCamera = useCallback(
    async (newDeviceId: string) => {
      setSelectedDeviceId(newDeviceId);
      if (status === 'ready' || status === 'initializing') {
        await startCamera(newDeviceId);
      }
    },
    [startCamera, status]
  );

  // Capture current video frame to base64 DataURL
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;

    // A. Real camera capture
    if (!isSimulated && video && video.readyState >= 2) {
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.save();
      if (isMirrored) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      return canvas.toDataURL('image/jpeg', 0.95);
    }

    // B. Simulated test frame fallback
    if (isSimulated) {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 960;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw aesthetic warm studio simulated photo
      const grad = ctx.createLinearGradient(0, 0, 1280, 960);
      grad.addColorStop(0, '#fde047');
      grad.addColorStop(0.5, '#f43f5e');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 960);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(640, 420, 180, 0, Math.PI * 2);
      ctx.fill();

      // Smiley face
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(580, 390, 18, 0, Math.PI * 2);
      ctx.arc(700, 390, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 14;
      ctx.strokeStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(640, 430, 80, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`TEST SNAPSHOT #${Date.now().toString().slice(-4)}`, 640, 760);

      return canvas.toDataURL('image/jpeg', 0.95);
    }

    return null;
  }, [isMirrored, isSimulated]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    status,
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
  };
}
