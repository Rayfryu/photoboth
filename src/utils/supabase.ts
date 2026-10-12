import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedSession } from '../types/photobooth';

const CONFIG_STORAGE_KEY = 'snapbooth_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  // Check env vars first
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  // Fallback to localStorage configuration
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  return { url: '', anonKey: '' };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore
  }
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey && config.url.startsWith('https://'));
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    return null;
  }
}

/**
 * Upload a captured session to Supabase Storage and database
 */
export async function uploadSessionToSupabase(session: SavedSession): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    // 1. Convert base64 previewUrl to Blob
    const res = await fetch(session.previewUrl);
    const blob = await res.blob();
    const filePath = `sessions/${session.id}_${Date.now()}.png`;

    // 2. Upload to 'photobooth-photos' bucket
    const { error: uploadError } = await client.storage
      .from('photobooth-photos')
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage bucket upload issue (verify bucket exists and is public/authenticated):', uploadError);
    }

    // 3. Insert record into photo_sessions table
    const { error: dbError } = await client.from('photo_sessions').insert([
      {
        id: session.id,
        title: session.title,
        layout_type: session.layout,
        frame_type: session.frameStyle,
        storage_path: filePath,
        created_at: session.createdAt,
      },
    ]);

    if (dbError) {
      console.warn('Database insert error:', dbError);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * SQL migration script for Supabase
 */
export const SUPABASE_SQL_SCHEMA = `-- SNAPBOOTH POSTGRESQL SCHEMA FOR SUPABASE

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Photo Sessions Table
CREATE TABLE IF NOT EXISTS public.photo_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  title TEXT NOT NULL,
  layout_type TEXT NOT NULL,
  frame_type TEXT NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Individual Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.photo_sessions(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_format TEXT DEFAULT 'image/png',
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 5. Public / Guest Permissive Policies (Adjust as needed for strict auth)
CREATE POLICY "Allow public read access for photo_sessions" 
  ON public.photo_sessions FOR SELECT USING (true);

CREATE POLICY "Allow public insert for photo_sessions" 
  ON public.photo_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for photos" 
  ON public.photos FOR SELECT USING (true);

CREATE POLICY "Allow public insert for photos" 
  ON public.photos FOR INSERT WITH CHECK (true);

-- 6. Storage Bucket Setup
-- Create a bucket named "photobooth-photos" in the Supabase Storage dashboard
-- with Public access enabled or RLS policies for uploads.
`;
