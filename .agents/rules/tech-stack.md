---
trigger: always_on
description: Core Technology Stack Rules & Guidelines (Next.js, Supabase, Tailwind, etc.)
---

# Tech Stack Guidelines (Next.js & Supabase)

이 프로젝트는 최신 프론트엔드/백엔드 하이브리드 스택인 Next.js와 Supabase를 중심으로 구축되어 있습니다. 일관성 있고 안정적인 코드베이스를 위해 각 기술 스택 사용 시 반드시 지켜야 할 룰을 정의합니다.

## 1. Core Framework: Next.js (App Router)
- **TypeScript (필수)**: 모든 애플리케이션 코드는 엄격한 TypeScript로 작성합니다. `any` 타입의 사용을 최대한 지양하고 도메인(Domain) 계층 등에 명확한 Interface 및 Type을 정의합니다.
- **환경 분리 주의**: Next.js 모듈 내에서 Node.js 전용 패키지(예: `fs`, `crypto`)는 오직 서버 컴포넌트(`Server Components`)나 서버 액션(`Server Actions`), API 라우트에서만 실행되도록 격리합니다.

## 2. Backend as a Service (BaaS): Supabase
- **서버 우선 접근 (Server-Side Operations)**: 
  - 인증(Auth) 및 DB 쿼리는 웹 브라우저(클라이언트)가 아닌 **Next.js Server Component와 Server Actions 단에서 실행**함을 원칙으로 합니다. (보안 및 성능 최적화)
  - 쿠키(Cookies)를 관리하는 `@supabase/ssr` 패키지를 활용해 서버 단에서 세션을 파싱하고 렌더링에 반영합니다.
- **Infrastructure 계층 격리**: 
  - `supabase.from('...')`과 같은 DB 통신 코드를 UI(app 라우터 폴더)에 바로 적지 말고, Clean Architecture 원칙 하에 `src/infrastructure/repositories/` 내부에 클래스/함수 형태로 은닉해 사용합니다.
- **환경 변수 보안 방침**: 
  - `NEXT_PUBLIC_SUPABASE_URL`와 `ANON_KEY` 기능은 클라이언트에 노출 가능하나, 서비스 롤(Service Role) 키나 시크릿(Secret) 토큰은 절대 클라이언트로 유출되지 않도록 Node.js 백엔드 로직에만 머물게 합니다.

## 3. 마이그레이션 (Migrations)
- supabase/migrations/ 폴더에 위치
- 마이그레이션을 수정하거나 삭제하거나 새로 생성할 때는 항상 사용자의 허가 받기.

## 4. Styling & UI Components: Tailwind CSS + Shadcn UI
- **접근 방식**: 복잡한 인라인 스타일이나 별도의 CSS 모듈 파일 대신 **Tailwind CSS**를 기본 스타일링 언어로 활용합니다.
- **컴포넌트 생태계**: 디자인 시스템은 **Shadcn UI**를 기반으로 확장 가능하게 작성합니다.
- **가독성 확보**: 조건부 클래스가 결합되거나 스타일 코드가 너무 길어지면 `cn()` (clsx + tailwind-merge) 유틸 함수를 통해 깔끔하게 포장합니다.

## 5. Testing: TDD 기반 검증 체계
- **기본 방침**: 이전 Todo/Blog 개발에서 합의했던 것처럼 주요 기능은 **TDD(Test-Driven Development)** 방식으로 접근합니다.
- **테스트 범위**: DB나 서버와의 연동을 목업(Mocking) 처리하고, 변경하기 쉬운 환경에서 `src/domain/` 및 `src/application/` 내의 순수 비즈니스 로직(Use Cases, Entities) 유닛 테스트 작성에 집중합니다.