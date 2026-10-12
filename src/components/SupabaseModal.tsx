import React, { useState } from 'react';
import { Cloud, X, Check, Copy, ExternalLink, ShieldAlert, Key } from 'lucide-react';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../utils/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    saveSupabaseConfig(config);
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              Supabase Cloud Storage & Database
            </h3>
            <p className="text-xs text-stone-500">
              Optional synchronization for your photobooth gallery
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-3 rounded-xl mb-5 text-xs flex items-center justify-between ${
          isConnected
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-stone-100 text-stone-600 border border-stone-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-stone-400'}`} />
            <span>
              {isConnected
                ? 'Supabase connection configured and ready for sync.'
                : 'Using Local In-Browser Storage (Offline-first)'}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={config.url}
              onChange={(e) => setConfig((prev) => ({ ...prev, url: e.target.value }))}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={config.anonKey}
              onChange={(e) => setConfig((prev) => ({ ...prev, anonKey: e.target.value }))}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 font-mono-num"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Save Credentials
            </button>
            {saveStatus && (
              <span className="text-xs text-emerald-600 font-medium">
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        {/* SQL Schema Migration Guide */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-900">
              Database Migration SQL Schema
            </span>
            <button
              onClick={handleCopySchema}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              {copiedSchema ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Schema</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-stone-900 text-stone-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Paste into your Supabase Dashboard SQL Editor to initialize <code>photo_sessions</code>, <code>photos</code>, and storage bucket security rules.
          </p>
        </div>

      </div>
    </div>
  );
};
