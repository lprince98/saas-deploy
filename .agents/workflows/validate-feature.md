---
description: 기능 구현 검증을 위한 종합 워크플로우 (텍스트, 아키텍쳐, 메타데이터 검증)
---

# Feature Validation Workflow

기능 개발 완료 후 프로젝트의 로직, 아키텍처, 그리고 SNS 최적화 상태를 한 번에 검증하는 통합 워크플로입니다.

## Prerequisites
- 모든 기능 구현 및 리팩토링이 완료된 상태여야 합니다.

## Workflow Steps

### Step 1: 비즈니스 로직 및 통합 테스트 검증
- **Skill**: [test-validator](file:///d:/Antigravity_LSH/textbook/SaaS_platform/.agents/skills/test-validator/SKILL.md)
- **Action**: `npm run test:run`을 실행하여 모든 테스트 사례가 통과하는지 확인합니다.
- **Goal**: 기능적 결함이 없는지 100% 검증합니다.

### Step 2: Next.js 아키텍처 및 보안 감사
- **Skill**: [nextjs-architect-audit](file:///d:/Antigravity_LSH/textbook/SaaS_platform/.agents/skills/nextjs-architect-audit/SKILL.md)
- **Action**: 서버/클라이언트 컴포넌트 구조와 환경 변수 보안을 점검합니다.
- **Goal**: 프레임워크 베스트 프랙티스 준수 및 보안 취약점 제로를 달성합니다.

### Step 3: SNS 공유 및 SEO 최적화 검증
- **Skill**: [og-tag-validator](file:///d:/Antigravity_LSH/textbook/SaaS_platform/.agents/skills/og-tag-validator/SKILL.md)
- **Action**: 주요 페이지의 OG 메타태그와 동적 메타데이터 생성을 확인합니다.
- **Goal**: 소셜 공유 품질과 검색 엔진 최적화 상태를 확인합니다.

### Step 4: 통합 검증 리포트 작성
- **Action**: 위 3단계의 결과를 취합하여 `validation_report.md` 아티팩트를 생성합니다.
- **Success Criteria**: 모든 체크포인트가 `Pass`여야 합니다.

---

## Reporting Template

아래 형식을 사용하여 리포트를 작성하십시오:

```markdown
# 프로젝트 통합 검증 리포트 (날짜: YYYY-MM-DD)

## 1. 테스트 결과 (test-validator)
- [ ] 통과 여부: (Pass/Fail)
- [ ] 상세: (총 테스트 수, 통과 수, 실패 수)

## 2. 아키텍처 및 보안 (nextjs-architect-audit)
- [ ] Rendering Strategy: (점검 결과)
- [ ] Security Status: (점검 결과)

## 3. SEO 및 OG 태그 (og-tag-validator)
- [ ] 메타태그 상태: (점검 결과)
- [ ] 동적 데이터 엔진: (정상/비정상)

## 종합 평가
(최종 승인 의견 및 후속 조치 권고)
```
