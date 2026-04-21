-- ============================================================
-- Migration: 003 - notes (노트 본문)
-- 대시보드 및 에디터 페이지의 핵심 엔티티
-- ============================================================

-- 노트 타입 ENUM (대시보드 리스트의 아이콘 종류: article / mic / image)
CREATE TYPE public.note_type AS ENUM ('article', 'voice', 'image');

-- 노트 액세스 권한 ENUM
CREATE TYPE public.note_access AS ENUM ('private', 'shared');

CREATE TABLE public.notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notebook_id   UUID REFERENCES public.notebooks(id) ON DELETE SET NULL,
  title         TEXT NOT NULL DEFAULT '제목 없는 노트',
  content       TEXT,                        -- 리치 텍스트 (HTML or Markdown)
  content_text  TEXT,                        -- 검색용 순수 텍스트 (stripped)
  note_type     public.note_type NOT NULL DEFAULT 'article',
  access        public.note_access NOT NULL DEFAULT 'private',
  is_favorited  BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted    BOOLEAN NOT NULL DEFAULT FALSE, -- 소프트 삭제 (휴지통)
  deleted_at    TIMESTAMPTZ,
  word_count    INTEGER NOT NULL DEFAULT 0,
  cover_image   TEXT,                         -- 커버 이미지 URL
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notes IS '에디터에서 작성하는 노트 본문 — 소프트 삭제 지원';
COMMENT ON COLUMN public.notes.content IS '리치 텍스트 에디터 HTML/Markdown 원문';
COMMENT ON COLUMN public.notes.content_text IS '전문 검색(FTS)을 위해 태그를 제거한 순수 텍스트';

-- 인덱스
CREATE INDEX idx_notes_owner_id   ON public.notes(owner_id);
CREATE INDEX idx_notes_notebook_id ON public.notes(notebook_id);
CREATE INDEX idx_notes_is_deleted  ON public.notes(is_deleted);
CREATE INDEX idx_notes_is_favorited ON public.notes(is_favorited) WHERE is_favorited = TRUE;

-- 전문 검색 인덱스 (GIN)
CREATE INDEX idx_notes_fts ON public.notes
  USING GIN (to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content_text, '')));

-- updated_at 트리거
CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 소프트 삭제 시 deleted_at 자동 설정 트리거
CREATE OR REPLACE FUNCTION public.handle_note_soft_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    NEW.deleted_at = NOW();
  ELSIF NEW.is_deleted = FALSE AND OLD.is_deleted = TRUE THEN
    NEW.deleted_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notes_soft_delete
  BEFORE UPDATE OF is_deleted ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_note_soft_delete();

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 본인 노트 전체 조회 (삭제된 것 포함 — 휴지통 뷰에서 사용)
CREATE POLICY "notes: 본인 조회"
  ON public.notes FOR SELECT
  USING (auth.uid() = owner_id);

-- note_shares 를 참조하는 RLS 정책은 004_create_note_shares.sql 로 이동
-- (테이블 생성 순서 전방 참조 오류 방지)

CREATE POLICY "notes: 본인 생성"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "notes: 본인 수정"
  ON public.notes FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "notes: 본인 삭제"
  ON public.notes FOR DELETE
  USING (auth.uid() = owner_id);
