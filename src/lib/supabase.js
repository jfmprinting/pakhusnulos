import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://gaxjcaxvizhvqxxxzagq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheGpjYXh2aXpodnF4eHh6YWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDA1ODQsImV4cCI6MjEwNjY3NjU4NH0.VPakMr1XoqhnAQuvqe093G41nn_j6PuI1aCE-1sS_4E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
