-- ============================================================
-- Migration: 005 - tags & note_tag_relations (태그 시스템)
-- 노트에 다중 태그를 붙이는 다대다 관계
-- ============================================================

-- tags: 사용자별 태그 목록
CREATE TABLE public.tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  color      TEXT,                          -- 태그 뱃지 색상 hex
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_tags_owner_name UNIQUE (owner_id, name)
);

COMMENT ON TABLE public.tags IS '사용자 소유의 태그 목록 — 노트 인스펙터 패널의 분류 섹션';

CREATE INDEX idx_tags_owner_id ON public.tags(owner_id);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tags: 본인 조회"
  ON public.tags FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "tags: 본인 생성"
  ON public.tags FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "tags: 본인 수정"
  ON public.tags FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "tags: 본인 삭제"
  ON public.tags FOR DELETE
  USING (auth.uid() = owner_id);

-- ──────────────────────────────────────────────────────────
-- note_tag_relations: 노트-태그 다대다 연결 테이블
-- ──────────────────────────────────────────────────────────
CREATE TABLE public.note_tag_relations (
  note_id    UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.tags(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (note_id, tag_id)
);

COMMENT ON TABLE public.note_tag_relations IS '노트와 태그의 다대다 연결 — AI 큐레이션 자동 태깅 결과도 여기에 저장';

CREATE INDEX idx_note_tag_relations_note_id ON public.note_tag_relations(note_id);
CREATE INDEX idx_note_tag_relations_tag_id  ON public.note_tag_relations(tag_id);

ALTER TABLE public.note_tag_relations ENABLE ROW LEVEL SECURITY;

-- 노트 소유자 또는 편집 권한 공유자만 태그 관계 조회 가능
CREATE POLICY "note_tag_relations: 노트 소유자·공유자 조회"
  ON public.note_tag_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.notes n
      WHERE n.id = note_tag_relations.note_id
        AND (
          n.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.note_shares ns
            WHERE ns.note_id = n.id AND ns.shared_with_id = auth.uid()
          )
        )
    )
  );

-- 노트 소유자 또는 편집 권한 공유자만 태그 부착 가능
CREATE POLICY "note_tag_relations: 노트 소유자·편집자 생성"
  ON public.note_tag_relations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.notes n
      WHERE n.id = note_tag_relations.note_id
        AND (
          n.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.note_shares ns
            WHERE ns.note_id = n.id
              AND ns.shared_with_id = auth.uid()
              AND ns.can_edit = TRUE
          )
        )
    )
  );

-- 노트 소유자 또는 편집 권한 공유자만 태그 제거 가능
CREATE POLICY "note_tag_relations: 노트 소유자·편집자 삭제"
  ON public.note_tag_relations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.notes n
      WHERE n.id = note_tag_relations.note_id
        AND (
          n.owner_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.note_shares ns
            WHERE ns.note_id = n.id
              AND ns.shared_with_id = auth.uid()
              AND ns.can_edit = TRUE
          )
        )
    )
  );
