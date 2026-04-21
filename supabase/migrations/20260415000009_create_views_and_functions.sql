-- ============================================================
-- Migration: 009 - utility views & helper functions
-- 대시보드·에디터에서 자주 사용하는 집계 뷰 및 유틸리티 함수
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 뷰 1: 활성 노트 목록 (휴지통 제외)
-- 대시보드 "최근 큐레이션" 섹션 대응
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.active_notes AS
SELECT
  n.id,
  n.owner_id,
  n.notebook_id,
  nb.name          AS notebook_name,
  n.title,
  n.content_text,
  n.note_type,
  n.access,
  n.is_favorited,
  n.word_count,
  n.cover_image,
  n.created_at,
  n.updated_at,
  -- 태그 목록 JSON 배열
  COALESCE(
    (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'color', t.color))
     FROM public.note_tag_relations ntr
     JOIN public.tags t ON t.id = ntr.tag_id
     WHERE ntr.note_id = n.id),
    '[]'
  ) AS tags,
  -- 공유된 사용자 수
  (SELECT COUNT(*) FROM public.note_shares ns WHERE ns.note_id = n.id) AS share_count
FROM public.notes n
LEFT JOIN public.notebooks nb ON nb.id = n.notebook_id
WHERE n.is_deleted = FALSE;

COMMENT ON VIEW public.active_notes IS '삭제되지 않은 노트 목록 — 태그·공유 수 포함';

-- ──────────────────────────────────────────────────────────
-- 뷰 2: 즐겨찾기 노트
-- 대시보드 Featured/Pinned Grid 대응
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.favorited_notes AS
SELECT * FROM public.active_notes WHERE is_favorited = TRUE;

COMMENT ON VIEW public.favorited_notes IS '즐겨찾기된 노트 목록';

-- ──────────────────────────────────────────────────────────
-- 뷰 3: 휴지통 노트
-- 사이드바 "휴지통" 메뉴 대응
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.trashed_notes AS
SELECT
  n.id,
  n.owner_id,
  n.notebook_id,
  n.title,
  n.note_type,
  n.deleted_at,
  n.created_at,
  n.updated_at
FROM public.notes n
WHERE n.is_deleted = TRUE;

COMMENT ON VIEW public.trashed_notes IS '소프트 삭제된 노트 목록 (휴지통)';

-- ──────────────────────────────────────────────────────────
-- 함수: 플랜별 노트 수 제한 체크
-- Free 플랜은 최대 100개 노트 제한
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_note_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan  public.subscription_plan;
  v_count INTEGER;
BEGIN
  SELECT plan INTO v_plan FROM public.users WHERE id = NEW.owner_id;

  IF v_plan = 'free' THEN
    SELECT COUNT(*) INTO v_count
    FROM public.notes
    WHERE owner_id = NEW.owner_id AND is_deleted = FALSE;

    IF v_count >= 100 THEN
      RAISE EXCEPTION 'FREE_PLAN_NOTE_LIMIT'
        USING DETAIL = '무료 플랜은 최대 100개의 노트를 생성할 수 있습니다.',
              HINT   = '업그레이드하거나 일부 노트를 삭제해 주세요.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notes_check_plan_limit
  BEFORE INSERT ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.check_note_limit();

-- ──────────────────────────────────────────────────────────
-- 함수: 전문 검색 (Full-Text Search)
-- 대시보드 검색바 및 스마트 검색 대응
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.search_notes(
  p_user_id UUID,
  p_query   TEXT,
  p_limit   INTEGER DEFAULT 20,
  p_offset  INTEGER DEFAULT 0
)
RETURNS TABLE (
  id          UUID,
  title       TEXT,
  content_text TEXT,
  note_type   public.note_type,
  notebook_name TEXT,
  updated_at  TIMESTAMPTZ,
  rank        REAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    n.id,
    n.title,
    n.content_text,
    n.note_type,
    nb.name AS notebook_name,
    n.updated_at,
    ts_rank(
      to_tsvector('simple', COALESCE(n.title, '') || ' ' || COALESCE(n.content_text, '')),
      plainto_tsquery('simple', p_query)
    ) AS rank
  FROM public.notes n
  LEFT JOIN public.notebooks nb ON nb.id = n.notebook_id
  WHERE n.owner_id = p_user_id
    AND n.is_deleted = FALSE
    AND to_tsvector('simple', COALESCE(n.title, '') || ' ' || COALESCE(n.content_text, ''))
        @@ plainto_tsquery('simple', p_query)
  ORDER BY rank DESC, n.updated_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

COMMENT ON FUNCTION public.search_notes IS '노트 전문 검색 — 대시보드 검색바 및 스마트 검색 기능';
