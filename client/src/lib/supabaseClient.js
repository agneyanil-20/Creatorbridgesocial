import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cmrcubdcazblpudsrphl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcmN1YmRjYXpibHB1ZHNycGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjc3MTMsImV4cCI6MjA5MDk0MzcxM30.XCBm9o40Mv5W0utR8aTikWmYuDtfUi-SlYkcWfL6X6Q';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not defined. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey
);
