-- Per-user AI chat usage tracking (daily + monthly limits)

CREATE TABLE IF NOT EXISTS public.ai_chat_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT (timezone('utc', now()))::date,
  message_count integer NOT NULL DEFAULT 0 CHECK (message_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS ai_chat_usage_user_id_idx ON public.ai_chat_usage (user_id);
CREATE INDEX IF NOT EXISTS ai_chat_usage_user_date_idx ON public.ai_chat_usage (user_id, usage_date);

ALTER TABLE public.ai_chat_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ai usage"
  ON public.ai_chat_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_ai_chat_quota_status(
  p_daily_limit integer,
  p_monthly_limit integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_daily_count integer := 0;
  v_monthly_count integer := 0;
  v_is_admin boolean := false;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('authenticated', false);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = v_user_id AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN jsonb_build_object(
      'authenticated', true,
      'unlimited', true,
      'daily_used', 0,
      'daily_limit', p_daily_limit,
      'monthly_used', 0,
      'monthly_limit', p_monthly_limit,
      'daily_remaining', p_daily_limit,
      'monthly_remaining', p_monthly_limit
    );
  END IF;

  SELECT COALESCE(message_count, 0)
  INTO v_daily_count
  FROM public.ai_chat_usage
  WHERE user_id = v_user_id AND usage_date = (timezone('utc', now()))::date;

  SELECT COALESCE(SUM(message_count), 0)
  INTO v_monthly_count
  FROM public.ai_chat_usage
  WHERE user_id = v_user_id
    AND usage_date >= date_trunc('month', timezone('utc', now()))::date;

  RETURN jsonb_build_object(
    'authenticated', true,
    'unlimited', false,
    'daily_used', v_daily_count,
    'daily_limit', p_daily_limit,
    'monthly_used', v_monthly_count,
    'monthly_limit', p_monthly_limit,
    'daily_remaining', GREATEST(p_daily_limit - v_daily_count, 0),
    'monthly_remaining', GREATEST(p_monthly_limit - v_monthly_count, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_ai_chat_quota(
  p_daily_limit integer,
  p_monthly_limit integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_daily_count integer := 0;
  v_monthly_count integer := 0;
  v_is_admin boolean := false;
  v_today date := (timezone('utc', now()))::date;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'unauthorized');
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = v_user_id AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'unlimited', true,
      'daily_used', 0,
      'daily_limit', p_daily_limit,
      'monthly_used', 0,
      'monthly_limit', p_monthly_limit,
      'daily_remaining', p_daily_limit,
      'monthly_remaining', p_monthly_limit
    );
  END IF;

  SELECT COALESCE(message_count, 0)
  INTO v_daily_count
  FROM public.ai_chat_usage
  WHERE user_id = v_user_id AND usage_date = v_today;

  SELECT COALESCE(SUM(message_count), 0)
  INTO v_monthly_count
  FROM public.ai_chat_usage
  WHERE user_id = v_user_id
    AND usage_date >= date_trunc('month', timezone('utc', now()))::date;

  IF v_daily_count >= p_daily_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit',
      'daily_used', v_daily_count,
      'daily_limit', p_daily_limit,
      'monthly_used', v_monthly_count,
      'monthly_limit', p_monthly_limit,
      'daily_remaining', 0,
      'monthly_remaining', GREATEST(p_monthly_limit - v_monthly_count, 0)
    );
  END IF;

  IF v_monthly_count >= p_monthly_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'monthly_limit',
      'daily_used', v_daily_count,
      'daily_limit', p_daily_limit,
      'monthly_used', v_monthly_count,
      'monthly_limit', p_monthly_limit,
      'daily_remaining', GREATEST(p_daily_limit - v_daily_count, 0),
      'monthly_remaining', 0
    );
  END IF;

  INSERT INTO public.ai_chat_usage (user_id, usage_date, message_count)
  VALUES (v_user_id, v_today, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    message_count = public.ai_chat_usage.message_count + 1,
    updated_at = now()
  RETURNING message_count INTO v_daily_count;

  RETURN jsonb_build_object(
    'allowed', true,
    'unlimited', false,
    'daily_used', v_daily_count,
    'daily_limit', p_daily_limit,
    'monthly_used', v_monthly_count + 1,
    'monthly_limit', p_monthly_limit,
    'daily_remaining', GREATEST(p_daily_limit - v_daily_count, 0),
    'monthly_remaining', GREATEST(p_monthly_limit - (v_monthly_count + 1), 0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_ai_chat_quota_status(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_chat_quota(integer, integer) TO authenticated;
