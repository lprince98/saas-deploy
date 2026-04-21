-- payment_logs 테이블 생성
CREATE TABLE IF NOT EXISTS public.payment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    amount_krw INTEGER NOT NULL,
    plan_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'STARTED', -- 커스텀 상태: 'STARTED', 'SUCCESS', 'FAILED', 'CANCELLED'
    fail_reason TEXT,
    payment_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- 사용자가 자신의 결제 로그만 삽입할 수 있도록 허용
CREATE POLICY "Users can insert their own payment logs" 
ON public.payment_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 사용자가 자신의 결제 로그만 조회할 수 있도록 허용
CREATE POLICY "Users can select their own payment logs" 
ON public.payment_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- 사용자가 자신의 결제 로그만 업데이트할 수 있도록 허용
CREATE POLICY "Users can update their own payment logs" 
ON public.payment_logs 
FOR UPDATE 
USING (auth.uid() = user_id);
