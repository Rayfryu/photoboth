import React from 'react';
import {
  Camera,
  RefreshCw,
  FlipHorizontal,
  VideoOff,
  Video,
  Timer,
  AlertCircle,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { CameraDeviceInfo, CameraStatus, CaptureMode } from '../../types/photobooth';

interface CameraBoothProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraStatus: CameraStatus;
  errorMessage: string;
  devices: CameraDeviceInfo[];
  selectedDeviceId: string;
  isMirrored: boolean;
  isSimulated: boolean;
  isCapturing: boolean;
  countdownValue: number | null;
  countdownDuration: number;
  captureMode: CaptureMode;
  currentShotIndex: number;
  totalShotsInSession: number;
  showFlash: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onSwitchCamera: (deviceId: string) => void;
  onToggleMirror: () => void;
  onEnableSimulatedMode: () => void;
  onSetCountdownDuration: (duration: number) => void;
  onSetCaptureMode: (mode: CaptureMode) => void;
  onTriggerCapture: () => void;
  onCancelCapture: () => void;
}

export const CameraBooth: React.FC<CameraBoothProps> = ({
  videoRef,
  cameraStatus,
  errorMessage,
  devices,
  selectedDeviceId,
  isMirrored,
  isSimulated,
  isCapturing,
  countdownValue,
  countdownDuration,
  captureMode,
  currentShotIndex,
  totalShotsInSession,
  showFlash,
  onStartCamera,
  onStopCamera,
  onSwitchCamera,
  onToggleMirror,
  onEnableSimulatedMode,
  onSetCountdownDuration,
  onSetCaptureMode,
  onTriggerCapture,
  onCancelCapture,
}) => {
  return (
    <div className="bg-stone-900 rounded-3xl p-4 sm:p-6 text-stone-100 shadow-2xl border border-stone-800 flex flex-col justify-between">
      
      {/* Top Viewfinder Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800/80">
        
        {/* Mode Selector Segmented Control */}
        <div className="flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl text-xs">
          <button
            disabled={isCapturing}
            onClick={() => onSetCaptureMode('strip3')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              captureMode === 'strip3'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            3-Strip
          </button>
          <button
            disabled={isCapturing}
            onClick={() => onSetCaptureMode('strip4')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              captureMode === 'strip4'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            4-Strip
          </button>
          <button
            disabled={isCapturing}
            onClick={() => onSetCaptureMode('single')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              captureMode === 'single'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Single
          </button>
          <button
            disabled={isCapturing}
            onClick={() => onSetCaptureMode('burst')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              captureMode === 'burst'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Burst (4)
          </button>
        </div>

        {/* Camera Quick Controls */}
        <div className="flex items-center gap-2">
          
          {/* Timer Selector */}
          <div className="flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl text-xs">
            <Timer className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5" />
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                disabled={isCapturing}
                onClick={() => onSetCountdownDuration(sec)}
                className={`px-2 py-1 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  countdownDuration === sec
                    ? 'bg-stone-700 text-white font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Mirror Flip Toggle */}
          <button
            onClick={onToggleMirror}
            title={isMirrored ? 'Mirrored preview enabled' : 'Mirror preview disabled'}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              isMirrored
                ? 'bg-stone-800 text-rose-400'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {/* Camera Devices Dropdown (if multiple) */}
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              disabled={isCapturing}
              onChange={(e) => onSwitchCamera(e.target.value)}
              className="bg-stone-800 text-stone-200 text-xs px-2.5 py-1.5 rounded-xl border border-stone-700 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || 'Camera'}
                </option>
              ))}
            </select>
          )}

          {/* Camera On / Off Toggle */}
          {cameraStatus === 'ready' ? (
            <button
              onClick={onStopCamera}
              disabled={isCapturing}
              title="Turn camera off"
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer"
            >
              <VideoOff className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartCamera}
              title="Start camera"
              className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

      {/* Viewfinder Main Screen */}
      <div className="relative mt-4 aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-stone-800 shadow-inner">
        
        {/* Real Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isMirrored ? 'scale-x-[-1]' : ''
          } ${cameraStatus === 'ready' && !isSimulated ? 'opacity-100' : 'opacity-0 absolute'}`}
        />

        {/* Simulated Camera Feed (Mock/Test Mode) */}
        {isSimulated && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
              <Camera className="w-12 h-12 text-rose-400" />
            </div>
            <p className="text-base font-bold text-white">Simulated Camera Mode</p>
            <p className="text-xs text-stone-400 max-w-sm mt-1">
              Live hardware simulation active. Test snapshots will generate authentic photobooth portraits.
            </p>
            <button
              onClick={onStartCamera}
              className="mt-4 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition-colors"
            >
              Switch to Real Camera
            </button>
          </div>
        )}

        {/* Camera Idle State */}
        {cameraStatus === 'idle' && !isSimulated && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-800/80 flex items-center justify-center mb-4 text-rose-400">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Ready to Pose?</h3>
            <p className="text-xs text-stone-400 max-w-sm mt-1.5 leading-relaxed">
              Click below to grant camera access and activate the photobooth viewfinder.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={onStartCamera}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Enable Camera
              </button>
              <button
                onClick={onEnableSimulatedMode}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Use Sample Mode
              </button>
            </div>
          </div>
        )}

        {/* Initializing State */}
        {cameraStatus === 'initializing' && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mb-3" />
            <p className="text-sm font-medium text-stone-200">Starting Camera...</p>
            <p className="text-xs text-stone-500 mt-1">Please confirm browser permission prompt if shown</p>
          </div>
        )}

        {/* Error / Denied / Unavailable States */}
        {(cameraStatus === 'denied' || cameraStatus === 'unavailable' || cameraStatus === 'error') && !isSimulated && (
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
            <h4 className="text-base font-bold text-white">Camera Access Issue</h4>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              {errorMessage || 'Unable to access video stream.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStartCamera}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Retry Camera
              </button>
              <button
                onClick={onEnableSimulatedMode}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Use Simulated Camera
              </button>
            </div>
          </div>
        )}

        {/* Visual Flash Overlay */}
        {showFlash && (
          <div className="absolute inset-0 camera-flash-overlay pointer-events-none z-30" />
        )}

        {/* Giant Countdown Overlay */}
        {countdownValue !== null && countdownValue > 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center z-20 animate-in fade-in">
            <span className="text-7xl sm:text-9xl font-black text-white font-mono-num drop-shadow-2xl animate-bounce">
              {countdownValue}
            </span>
            <div className="mt-4 px-4 py-1.5 bg-black/60 rounded-full text-xs font-semibold tracking-wider text-stone-200 uppercase font-mono-num">
              Shot {currentShotIndex} of {totalShotsInSession}
            </div>
          </div>
        )}

        {/* Viewfinder Rule-of-Thirds Grid Reticle */}
        {cameraStatus === 'ready' && !countdownValue && (
          <div className="absolute inset-0 pointer-events-none opacity-20 grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-white" />
            <div className="border-r border-white" />
            <div />
          </div>
        )}

        {/* Live Shot Counter Badge */}
        {isCapturing && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            CAPTURING: SHOT {currentShotIndex} / {totalShotsInSession}
          </div>
        )}

      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-stone-800/80">
        
        {/* Status Hint */}
        <div className="text-xs text-stone-400 hidden sm:block">
          {cameraStatus === 'ready' ? (
            <span className="text-emerald-400 font-medium">● Viewfinder Live</span>
          ) : (
            <span>Camera Standby</span>
          )}
        </div>

        {/* Main Physical Shutter Trigger Button */}
        <div className="flex-1 sm:flex-initial flex justify-center">
          {isCapturing ? (
            <button
              onClick={onCancelCapture}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold rounded-2xl transition-all border border-stone-700 cursor-pointer"
            >
              Cancel Session
            </button>
          ) : (
            <button
              onClick={onTriggerCapture}
              disabled={cameraStatus !== 'ready' && !isSimulated}
              className={`group relative flex items-center gap-3 px-8 py-3.5 rounded-2xl text-base font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${
                cameraStatus === 'ready' || isSimulated
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
              </div>
              <span>
                {captureMode === 'single'
                  ? 'Take Photo'
                  : `Start ${captureMode === 'strip3' ? '3-Shot' : '4-Shot'} Strip`}
              </span>
            </button>
          )}
        </div>

        {/* Audio feedback hint */}
        <div className="text-xs text-stone-400 hidden sm:flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-stone-500" />
          <span>Sound Effects On</span>
        </div>

      </div>

    </div>
  );
};
