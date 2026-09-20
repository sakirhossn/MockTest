-- ==============================================================================
-- MockMaster AI / MockTest - Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create table for storing test attempt results
CREATE TABLE IF NOT EXISTS public.test_results (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_title TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  total_score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  cleared_cutoff BOOLEAN DEFAULT false,
  result_data JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index for fast user-specific lookup
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON public.test_results (user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON public.test_results (completed_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies ensuring each user can only read/write their own data
CREATE POLICY "Users can select their own test results"
  ON public.test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results"
  ON public.test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results"
  ON public.test_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test results"
  ON public.test_results FOR DELETE
  USING (auth.uid() = user_id);
