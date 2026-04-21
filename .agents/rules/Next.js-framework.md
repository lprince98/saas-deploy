---
trigger: always_on
glob: "**/*.ts, **/*.tsx"
description: Next.js App Router Best Practices and Coding Rules
---

# Next.js Framework Best Practices & Rules

이 문서는 Next.js(App Router) 환경에서 개발할 때 안티그래비티 에이전트와 개발자가 준수해야 할 필수 프레임워크 가이드라인입니다. 가독성을 높이고, 성능을 개선하며, 유지보수가 쉬운 코드베이스를 유지하기 위한 규칙들을 정의합니다.

## 1. 컴포넌트 렌더링 원칙

### 1-1. 의도적인 Server Component 우선 사용 (Prefer Server Components)
- **기본값**: Next.js App Router에서는 기본적으로 모든 컴포넌트가 Server Component입니다. 항상 Server Component를 기본으로 생각하고 작성하세요.
- **장점**: 번들 크기를 줄이고, 서버 측에서 안전하게 환경 변수에 접근하며 데이터베이스/API에 직접 접근할 수 있습니다.
- Hook(`useState`, `useEffect`)이나 브라우저 API(`window`, `document`), 이벤트 리스너(`onClick` 등)가 절대적으로 필요한 경우에만 Client Component로 전환합니다.

### 1-2. Client Component는 트리 최하단에 배치 ('use client' 최적화)
- 상태 관리나 인터랙션이 필요한 UI 부분만 쪼개어 가장 작은 단위(Leaf Node)의 Client Component로 만듭니다.
- 넓은 범위의 레이아웃이나 부모 페이지에 `'use client'`를 선언하여 강제적으로 하위 컴포넌트 전체를 클라이언트로 렌더링시키는 것을 피합니다.

## 2. 모듈 및 파일 관리 규칙

### 2-1. 하나의 파일이 커지면 관심사 분리하기 (적극적인 파일 분할)
- 단일 파일(`.tsx`, `.ts`)의 라인 수가 200~300줄을 넘어간다면 모듈 분할을 고려합니다.
- 복잡한 UI는 여러 개의 작은 Sub-Component들로 쪼개어 `components/` 폴더 하위에 격리합니다.
- 복잡한 비즈니스 조건이나 데이터 파싱 로직은 컴포넌트 내부에 두지 않고 개별 헬퍼 함수나 `Use Case`로 분리해 파일로 빼냅니다.

### 2-2. 간결하고 알아보기 쉬운 코드 작성 (Clean & Readable)
- 불필요한 깊은 중첩(depth)을 피하고 Early Return 패턴을 적극 활용합니다.
- 변수명 및 함수명은 축약어 대신 명확하고 스스로 설명이 가능한(Self-Descriptive) 영단어를 사용합니다. (예: `handleData` -> `fetchAndFormatUserData`)
- 한 함수나 컴포넌트는 단 1개의 책임(Single Responsibility)만 갖도록 작게 유지합니다.

## 3. 데이터 페칭 및 뮤테이션 (Data & Mutations)

### 3-1. Server Component 단 데이터 조회
- `useEffect` + `fetch` 조합을 피하고, Server Component에서 `async/await`를 사용하여 곧바로 백엔드, DB 리소스에 직접 접근하여 렌더링합니다.

### 3-2. Server Actions을 통한 데이터 변경
- 폼 제출이나 버튼 클릭을 통한 데이터 뮤테이션(생성/수정/삭제)에는 별도의 API Route(Route Handlers)를 새로 파는 대신, 가급적 **Server Actions**(`'use server'`)을 활용하여 함수 호출 형태로 컨트롤러를 구성하세요.

## 4. Next.js 내장 최적화 기능 적극 활용

- **이미지 최적화**: 로컬 및 외부 이미지는 반드시 `<Image />` (`next/image`) 컴포넌트를 사용하고 `alt` 태그를 필수로 작성합니다.
- **네비게이션**: 내부 라우팅 이동 시 항상 `<a>` 태그 대신 Next.js의 `<Link>` (`next/link`) 컴포넌트를 사용하여 프론트엔드 프리페치(Prefetch) 성능의 이점을 취합니다.
- **글꼴 체계 최적화**: 폰트는 `next/font`를 통해 최적화된 방법으로 불러옵니다.

## 5. App Router 파일 규칙 (Conventions)
- 라우팅은 물리적인 폴더 위치로 지정하되, URL에 반영되지 않아야 하는 폴더는 `(그룹명)` 소괄호를 통해 Route Group으로 묶어 관리합니다.
- UI 로딩 상태는 `loading.tsx`, 에러 처리는 `error.tsx` 등 Next.js의 특별한 파일 컨벤션을 우선적으로 활용하여 구성합니다.
