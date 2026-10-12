import { SavedSession } from '../types/photobooth';

const STORAGE_KEY = 'snapbooth_saved_sessions_v1';

const INITIAL_SAMPLES: SavedSession[] = [
  {
    id: 'sample-session-1',
    title: 'Laughing Moments',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    layout: 'strip-3',
    frameStyle: 'pink-retro',
    previewUrl: '/images/demo_photobooth_laugh.jpg',
    photosCount: 3,
  },
  {
    id: 'sample-session-2',
    title: 'Editorial Portrait',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    layout: 'strip-3',
    frameStyle: 'editorial-black',
    previewUrl: '/images/demo_photobooth_vintage.jpg',
    photosCount: 3,
  },
  {
    id: 'sample-session-3',
    title: 'Retro Vibes 90s',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    layout: 'single-frame',
    frameStyle: 'film-strip',
    previewUrl: '/images/demo_photobooth_duo.jpg',
    photosCount: 1,
  },
];

export function getSavedSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample sessions on first visit
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLES));
      return INITIAL_SAMPLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SAMPLES;
  } catch {
    return INITIAL_SAMPLES;
  }
}

export function saveSessionToStorage(session: SavedSession): void {
  try {
    const current = getSavedSessions();
    const updated = [session, ...current.filter((s) => s.id !== session.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save session to storage:', err);
  }
}

export function deleteSessionFromStorage(id: string): void {
  try {
    const current = getSavedSessions();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete session from storage:', err);
  }
}

export function clearAllSavedSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear sessions:', err);
  }
}
