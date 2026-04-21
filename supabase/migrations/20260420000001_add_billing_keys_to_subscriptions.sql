-- ============================================================
-- Migration: 007 - subscriptions (빌링키, 커스토머키 추가)
-- 정기결제를 위한 토스페이먼츠 연동 키 저장
-- ============================================================

ALTER TABLE public.subscriptions 
ADD COLUMN customer_key TEXT UNIQUE,
ADD COLUMN billing_key TEXT UNIQUE;

COMMENT ON COLUMN public.subscriptions.customer_key IS '토스페이먼츠 빌링 연동 구매자 식별자';
COMMENT ON COLUMN public.subscriptions.billing_key IS '토스페이먼츠 정기결제용 빌링키';
