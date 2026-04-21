-- ============================================================
-- Migration: 007 - Fix subscription downgrade trigger
-- canceled 상태 시 즉시 free로 다운그레이드되는 문제를 해결합니다.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_subscription_plan_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 구독이 active 또는 trialing 인 경우 users.plan 동기화
  IF NEW.status IN ('active', 'trialing') THEN
    UPDATE public.users
    SET plan = NEW.plan, updated_at = NOW()
    WHERE id = NEW.user_id;
  -- 구독이 expired 인 경우에만 free 로 다운그레이드 (canceled는 현상유지)
  ELSIF NEW.status = 'expired' THEN
    UPDATE public.users
    SET plan = 'free', updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;
