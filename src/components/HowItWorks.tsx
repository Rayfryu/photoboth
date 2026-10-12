import React from 'react';
import { Camera, Sparkles, Layers, Sliders, Download, ShieldCheck, Cpu, Smartphone } from 'lucide-react';

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FBF9F5] border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            Intuitive & Instant
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-display">
            How Snapbooth Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600">
            A frictionless physical photobooth experience reimagined for modern browsers,
            keeping all processing locally on your device.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base mb-6">
                01
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Pose & Snap
              </h3>
              <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                Allow camera access, select your countdown interval (3s, 5s, or 10s),
                and let the automatic shutter capture 1, 3, or 4 consecutive candid shots.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 font-mono-num">
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Auto-countdown & Shutter</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-base mb-6">
                02
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Style & Curate
              </h3>
              <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                Choose from vintage strips, 2x2 collages, and 35mm film frames.
                Fine-tune brightness, contrast, warm analog film tones, and stickers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 font-mono-num">
              <Sliders className="w-4 h-4 text-stone-700" />
              <span>Canvas pixel processing</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-base mb-6">
                03
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Download & Keep
              </h3>
              <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                Export high-resolution PNG or JPEG prints ready for Instagram, printing,
                or saving to your private gallery history.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 font-mono-num">
              <Download className="w-4 h-4 text-stone-700" />
              <span>High-resolution export</span>
            </div>
          </div>

        </div>

        {/* Privacy & Hardware Standards Strip */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Client-Side Privacy
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Photos never leave your device without your explicit permission. No sneaky AI training or hidden uploads.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Smartphone className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Multi-Camera & Mobile
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Seamlessly switches between front selfie camera, rear camera, or external USB webcams.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Cpu className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Zero Latency Synthesis
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Web Audio synthesizes genuine shutter sounds and countdown beeps with zero network overhead.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
