import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Download,
  Eye,
  X,
  Camera,
  Cloud,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { SavedSession } from '../../types/photobooth';
import {
  deleteSessionFromStorage,
  getSavedSessions,
} from '../../utils/storage';

interface GalleryViewProps {
  onStartNewSession: () => void;
  openCloudModal: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  onStartNewSession,
  openCloudModal,
}) => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SavedSession | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  const loadSessions = () => {
    setSessions(getSavedSessions());
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = (id: string) => {
    deleteSessionFromStorage(id);
    loadSessions();
    setDeleteCandidate(null);
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
  };

  const handleDownloadSession = (session: SavedSession) => {
    const link = document.createElement('a');
    link.href = session.previewUrl;
    link.download = `snapbooth-${session.title.toLowerCase().replace(/\s+/g, '-')}-${session.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
            <span>Memory Archive</span>
            <span aria-hidden="true">·</span>
            <span>Local & Cloud</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 font-display mt-1">
            Photo Session Gallery
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Review, download, and manage your preserved photobooth prints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCloudModal}
            className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Cloud className="w-4 h-4 text-stone-400" />
            Cloud Storage Settings
          </button>
          <button
            onClick={onStartNewSession}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Camera className="w-4 h-4" />
            New Photobooth
          </button>
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">
            Your Gallery is Empty
          </h3>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            You haven't preserved any photobooth strips yet. Step inside the studio to snap and customize your first strip.
          </p>
          <button
            onClick={onStartNewSession}
            className="mt-6 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Open Photobooth Studio
          </button>
        </div>
      ) : (
        /* Sessions Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              
              {/* Thumbnail Container */}
              <div
                onClick={() => setSelectedSession(session)}
                className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center cursor-pointer border border-stone-100"
              >
                <img
                  src={session.previewUrl}
                  alt={session.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-102"
                />

                {/* Cloud Sync Icon */}
                {session.isCloudSynced && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-xs text-emerald-400 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    Synced
                  </div>
                )}

                {/* Quick Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Strip
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-display">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1 font-mono-num">
                    <span>
                      {new Date(session.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{session.layout.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownloadSession(session)}
                    title="Download strip"
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(session.id)}
                    title="Delete session"
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h4 className="text-base font-bold text-stone-900 font-display">
              Delete This Memory?
            </h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              This photo strip session will be permanently deleted from your saved gallery history.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteCandidate)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-stone-900 rounded-3xl p-6 text-stone-100 shadow-2xl flex flex-col items-center">
            
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold font-display text-white">
                {selectedSession.title}
              </h3>
              <p className="text-xs text-stone-400 font-mono-num mt-0.5">
                Saved on {new Date(selectedSession.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Large Image Preview */}
            <div className="max-h-[65vh] overflow-hidden flex items-center justify-center p-2 bg-stone-950 rounded-2xl">
              <img
                src={selectedSession.previewUrl}
                alt={selectedSession.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain rounded-xs shadow-2xl"
              />
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => handleDownloadSession(selectedSession)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Print
              </button>
              <button
                onClick={() => setDeleteCandidate(selectedSession.id)}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-rose-400 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
