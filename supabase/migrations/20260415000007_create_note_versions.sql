-- ============================================================
-- Migration: 007 - note_versions (버전 스냅샷)
-- Pro 플랜 기능 — 노트의 특정 시점 복원을 위한 히스토리
-- ============================================================

CREATE TABLE public.note_versions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id      UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  owner_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content      TEXT,
  content_text TEXT,
  word_count   INTEGER NOT NULL DEFAULT 0,
  version_num  INTEGER NOT NULL,             -- 단조 증가 버전 번호
  snapshot_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_note_versions_note_version UNIQUE (note_id, version_num)
);

COMMENT ON TABLE public.note_versions IS 'Pro 플랜 버전 스냅샷 — 노트 저장 시점마다 이력 보관';

CREATE INDEX idx_note_versions_note_id ON public.note_versions(note_id);
CREATE INDEX idx_note_versions_owner_id ON public.note_versions(owner_id);

-- 노트 저장(UPDATE) 시 자동으로 버전 스냅샷 생성 (Pro 플랜인 경우)
CREATE OR REPLACE FUNCTION public.handle_note_version_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan public.subscription_plan;
  v_next_version INTEGER;
BEGIN
  -- 내용이 실제로 변경된 경우에만 스냅샷
  IF OLD.content IS NOT DISTINCT FROM NEW.content
     AND OLD.title IS NOT DISTINCT FROM NEW.title THEN
    RETURN NEW;
  END IF;

  -- 소유자의 구독 플랜 확인
  SELECT plan INTO v_plan
  FROM public.users
  WHERE id = NEW.owner_id;

  -- free 플랜은 버전 스냅샷 미지원
  IF v_plan = 'free' THEN
    RETURN NEW;
  END IF;

  -- 다음 버전 번호 계산
  SELECT COALESCE(MAX(version_num), 0) + 1
  INTO v_next_version
  FROM public.note_versions
  WHERE note_id = NEW.id;

  INSERT INTO public.note_versions (
    note_id, owner_id, title, content, content_text, word_count, version_num
  ) VALUES (
    NEW.id, NEW.owner_id, OLD.title, OLD.content,
    OLD.content_text, OLD.word_count, v_next_version
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notes_version_snapshot
  BEFORE UPDATE OF title, content ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_note_version_snapshot();

-- ──────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.note_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "note_versions: 본인 조회"
  ON public.note_versions FOR SELECT
  USING (auth.uid() = owner_id);

-- INSERT/UPDATE/DELETE 는 트리거(SECURITY DEFINER) 전용
