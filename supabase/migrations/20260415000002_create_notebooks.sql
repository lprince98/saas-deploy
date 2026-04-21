-- ============================================================
-- Migration: 002 - notebooks (노트북 폴더)
-- 사용자가 노트를 묶어 관리하는 폴더 단위
-- ============================================================

CREATE TABLE public.notebooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,                          -- Material Symbol 아이콘 이름
  color       TEXT,                          -- hex 색상 코드
  is_default  BOOLEAN NOT NULL DEFAULT FALSE, -- 기본 노트북 여부
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notebooks IS '노트를 그룹화하는 폴더 단위 (사이드바 "노트북" 메뉴 대응)';

CREATE INDEX idx_notebooks_owner_id ON public.notebooks(owner_id);

CREATE TRIGGER trg_notebooks_updated_at
  BEFORE UPDATE ON public.notebooks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────────────────
-- 신규 사용자 생성 시 기본 노트북 자동 생성
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user_notebook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notebooks (owner_id, name, is_default)
  VALUES (NEW.id, '나의 노트북', TRUE);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_user_created_notebook
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_notebook();

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notebooks: 본인 조회"
  ON public.notebooks FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "notebooks: 본인 생성"
  ON public.notebooks FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "notebooks: 본인 수정"
  ON public.notebooks FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "notebooks: 본인 삭제"
  ON public.notebooks FOR DELETE
  USING (auth.uid() = owner_id);
