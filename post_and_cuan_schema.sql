-- POST & CUAN SCHEMA FOR SUPABASE
-- INTEGRATED INTO PAK HUSNUL UNIFIED OPERATING SYSTEM

-- 1. PLATFORMS
CREATE TABLE IF NOT EXISTS public.platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Video',
  daily_target INTEGER NOT NULL DEFAULT 1,
  frequency TEXT NOT NULL DEFAULT 'daily',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  lock_hour INTEGER NOT NULL DEFAULT 20,
  daily_net_target NUMERIC NOT NULL DEFAULT 500000,
  monthly_net_target NUMERIC NOT NULL DEFAULT 15000000,
  affiliate_rate NUMERIC NOT NULL DEFAULT 0.40,
  monthly_fixed_cost NUMERIC NOT NULL DEFAULT 742000,
  weekly_gross_target NUMERIC NOT NULL DEFAULT 0,
  gemini_keys JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER XP
CREATE TABLE IF NOT EXISTS public.user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. USER BADGES
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. REVENUE SOURCES
CREATE TABLE IF NOT EXISTS public.revenue_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '💰',
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. DAILY LOGS
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  date DATE NOT NULL,
  posts JSONB NOT NULL DEFAULT '{}'::jsonb,
  revenue NUMERIC NOT NULL DEFAULT 0,
  revenue_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  missed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- 7. CONTENT CALENDAR
CREATE TABLE IF NOT EXISTS public.content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  scheduled_date DATE NOT NULL,
  platform_id UUID,
  caption TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  posted BOOLEAN NOT NULL DEFAULT false,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. FOCUS SESSIONS
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  theme TEXT DEFAULT 'deep_focus',
  goal_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false,
  xp_earned INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. GOALS & MILESTONES
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT 'f1b1244e-5fa1-4214-9cc7-fffa3973f644',
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'personal',
  target_value INTEGER NOT NULL DEFAULT 1,
  current_value INTEGER NOT NULL DEFAULT 0,
  deadline DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY AND PERMISSIVE POLICIES
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all platforms" ON public.platforms FOR ALL USING (true);
CREATE POLICY "Allow all user_settings" ON public.user_settings FOR ALL USING (true);
CREATE POLICY "Allow all user_xp" ON public.user_xp FOR ALL USING (true);
CREATE POLICY "Allow all user_badges" ON public.user_badges FOR ALL USING (true);
CREATE POLICY "Allow all revenue_sources" ON public.revenue_sources FOR ALL USING (true);
CREATE POLICY "Allow all daily_logs" ON public.daily_logs FOR ALL USING (true);
CREATE POLICY "Allow all content_calendar" ON public.content_calendar FOR ALL USING (true);
CREATE POLICY "Allow all focus_sessions" ON public.focus_sessions FOR ALL USING (true);
CREATE POLICY "Allow all goals" ON public.goals FOR ALL USING (true);
