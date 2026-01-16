import { createClient } from '@supabase/supabase-js';

// Declarar el tipo de window.ENV
declare global {
  interface Window {
    ENV?: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

// Intentar leer desde window.ENV primero (Hostinger), luego desde import.meta.env (Vercel)
const supabaseUrl = 
  (typeof window !== 'undefined' && window.ENV?.VITE_SUPABASE_URL) || 
  (import.meta as any).env.VITE_SUPABASE_URL;

const supabaseAnonKey = 
  (typeof window !== 'undefined' && window.ENV?.VITE_SUPABASE_ANON_KEY) || 
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
