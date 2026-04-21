-- ============================================================
-- Migration: Fix Subscription RLS
-- 사용자가 자신의 구독 정보를 직접 업데이트할 수 있도록 허용 (테스트용)
-- ============================================================

-- 기존 정책 확인 후 추가 (INSERT/UPDATE 권한 부여)
CREATE POLICY "subscriptions: 본인 삽입"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions: 본인 수정"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
