-- ============================================================
-- Migration: 006 - subscriptions (구독 플랜)
-- 결제 완료 후 프로/엔터프라이즈 플랜 정보 저장
-- ============================================================

-- 결제 주기 ENUM
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'annual');

-- 구독 상태 ENUM
CREATE TYPE public.subscription_status AS ENUM (
  'active',     -- 정상 구독 중
  'canceled',   -- 취소됨 (기간 만료 전까지 사용 가능)
  'expired',    -- 만료됨
  'trialing'    -- 14일 무료 체험 중
);

CREATE TABLE public.subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan                 public.subscription_plan NOT NULL DEFAULT 'free',
  status               public.subscription_status NOT NULL DEFAULT 'active',
  billing_cycle        public.billing_cycle,          -- free 플랜은 NULL
  amount_krw           INTEGER,                        -- 결제 금액 (원화)
  currency             TEXT NOT NULL DEFAULT 'KRW',
  -- 외부 결제 시스템과의 연동을 위한 참조 ID (Stripe, Toss 등)
  external_customer_id TEXT,
  external_sub_id      TEXT,
  -- 인보이스 정보 (payment-done.html 참고)
  invoice_number       TEXT UNIQUE,                    -- e.g. INV-2024-8842
  -- 구독 기간
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  trial_end            TIMESTAMPTZ,
  canceled_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_subscriptions_user_id UNIQUE (user_id)  -- 사용자당 구독 1개
);

COMMENT ON TABLE public.subscriptions IS '구독 플랜 및 결제 정보 — payment-done 페이지의 영수증 데이터 포함';
COMMENT ON COLUMN public.subscriptions.invoice_number IS 'INV-YYYY-NNNN 형식의 인보이스 번호';

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status  ON public.subscriptions(status);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────────────────
-- 구독 플랜 변경 시 public.users.plan 동기화 트리거
-- ──────────────────────────────────────────────────────────
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
  -- 구독이 canceled 또는 expired 인 경우 free 로 다운그레이드
  ELSIF NEW.status IN ('canceled', 'expired') THEN
    UPDATE public.users
    SET plan = 'free', updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_subscriptions_plan_sync
  AFTER INSERT OR UPDATE OF status, plan ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_plan_sync();

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 본인 구독 정보만 조회 가능
CREATE POLICY "subscriptions: 본인 조회"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 결제 웹훅 등은 service_role key 로 직접 INSERT/UPDATE 처리
-- 일반 사용자의 직접 INSERT/UPDATE/DELETE 는 금지 (service_role 만 가능)
