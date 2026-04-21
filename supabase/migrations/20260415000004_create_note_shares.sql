-- ============================================================
-- Migration: 004 - note_shares (노트 공유)
-- 특정 사용자에게 노트를 공유하고 편집 권한을 제어
-- ============================================================

CREATE TABLE public.note_shares (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id          UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  owner_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  can_edit         BOOLEAN NOT NULL DEFAULT FALSE, -- FALSE=읽기, TRUE=편집
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_note_shares_note_user UNIQUE (note_id, shared_with_id),
  CONSTRAINT chk_not_self_share        CHECK (owner_id <> shared_with_id)
);

COMMENT ON TABLE public.note_shares IS '노트 협업 공유 — 읽기/편집 권한 구분';

CREATE INDEX idx_note_shares_note_id        ON public.note_shares(note_id);
CREATE INDEX idx_note_shares_shared_with_id ON public.note_shares(shared_with_id);
CREATE INDEX idx_note_shares_owner_id       ON public.note_shares(owner_id);

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;

-- 노트 소유자 또는 공유받은 사람이 공유 정보 조회 가능
CREATE POLICY "note_shares: 소유자·공유자 조회"
  ON public.note_shares FOR SELECT
  USING (
    auth.uid() = owner_id
    OR auth.uid() = shared_with_id
  );

-- 노트 소유자만 공유 생성 가능
CREATE POLICY "note_shares: 소유자 생성"
  ON public.note_shares FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 노트 소유자만 공유 내용 변경 (can_edit 수정 등)
CREATE POLICY "note_shares: 소유자 수정"
  ON public.note_shares FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 노트 소유자만 공유 삭제 가능
CREATE POLICY "note_shares: 소유자 삭제"
  ON public.note_shares FOR DELETE
  USING (auth.uid() = owner_id);

-- ──────────────────────────────────────────────────────────
-- note_shares 생성 후 — notes 테이블에 공유 관련 RLS 정책 추가
-- (003_create_notes.sql 에서 전방 참조 문제로 이동)
-- ──────────────────────────────────────────────────────────

-- 나에게 공유된 노트 조회
CREATE POLICY "notes: 공유받은 노트 조회"
  ON public.notes FOR SELECT
  USING (
    access = 'shared'
    AND EXISTS (
      SELECT 1 FROM public.note_shares ns
      WHERE ns.note_id = notes.id
        AND ns.shared_with_id = auth.uid()
    )
  );

-- 편집 권한을 받은 공유자가 노트 수정 가능
CREATE POLICY "notes: 편집 공유자 수정"
  ON public.notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.note_shares ns
      WHERE ns.note_id = notes.id
        AND ns.shared_with_id = auth.uid()
        AND ns.can_edit = TRUE
    )
  );

