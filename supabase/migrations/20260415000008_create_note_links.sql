-- ============================================================
-- Migration: 008 - note_links (양방향 링크)
-- Pro 플랜 기능 — 노트 간 상호 참조 링크
-- ============================================================

CREATE TABLE public.note_links (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id    UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  target_id    UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  owner_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_note_links_pair    UNIQUE (source_id, target_id),
  CONSTRAINT chk_no_self_link      CHECK (source_id <> target_id)
);

COMMENT ON TABLE public.note_links IS 'Pro 플랜 양방향 링크 — AI 신경망 조직화 연결 고리 포함';

CREATE INDEX idx_note_links_source_id ON public.note_links(source_id);
CREATE INDEX idx_note_links_target_id ON public.note_links(target_id);
CREATE INDEX idx_note_links_owner_id  ON public.note_links(owner_id);

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.note_links ENABLE ROW LEVEL SECURITY;

-- source 또는 target 노트에 접근할 수 있는 사용자가 링크 조회 가능
CREATE POLICY "note_links: 소유자 조회"
  ON public.note_links FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "note_links: 소유자 생성"
  ON public.note_links FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "note_links: 소유자 삭제"
  ON public.note_links FOR DELETE
  USING (auth.uid() = owner_id);
