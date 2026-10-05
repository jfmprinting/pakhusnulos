ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS gemini_keys JSONB DEFAULT '[]'::jsonb;
