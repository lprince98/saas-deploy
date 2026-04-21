---
description: "The Digital Curator 프로젝트의 모든 유닛 및 통합 테스트(Vitest)를 실행하여 비즈니스 로직의 무결성을 검증합니다."
---

# 테스트 검증 스킬 (Test Validator)

이 스킬은 프로젝트의 품질을 유지하기 위해 작성된 모든 테스트 코드를 실행하고 그 결과를 분석합니다. 

## 실행 단계

1. **테스트 환경 준비**: 프로젝트 루트에 `node_modules`가 설치되어 있는지 확인합니다.
2. **테스트 실행**: `npm run test:run` 명령어를 실행하여 CI 모드로 모든 테스트를 수행합니다.
3. **결과 분석**: 
    - 모든 테스트가 통과(`Pass`)하면 검증을 완료합니다.
    - 실패(`Fail`)한 테스트가 있다면 해당 파일명과 에러 메시지를 수집하여 보고합니다.
4. **보고**: 전체 테스트 개수, 통과 개수, 실패 개수를 요약하여 보고합니다.

## 프로젝트 테스트 구성

- **Domain**: `src/domain/entities/` 내 핵심 비즈니스 규칙 검증.
- **Infrastructure**: `src/infrastructure/repositories/` 내 DB 연동 로직 검증.
- **Application**: `src/application/use-cases/` 및 `actions/` 내 유스케이스 흐름 검증.
- **Presentation**: 주요 UI 컴포넌트(`Shadcn UI` 기반)의 렌더링 검증.

## 활용 시점
- 새로운 기능을 구현한 후 기존 기능에 영향이 없는지 확인할 때.
- 배포 전 최종 무결성을 검증할 때.
- 리팩토링 후 로직의 일관성을 확인해야 할 때.
