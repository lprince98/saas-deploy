---
trigger: always_on
glob: "**/*.ts, **/*.tsx"
description: Clean Architecture & Next.js Coding Guidelines
---

# Clean Architecture in Next.js (App Router)

이 프로젝트는 프리젠테이션과 비즈니스 로직을 명확하게 분리하는 Clean Architecture 패턴을 따릅니다. 이전 대화(Supabase Auth, TDD 접근, Server Actions 활용, 도메인 주도 블로그 개발 등)를 기반으로 작성된 프로젝트 아키텍처 원칙과 폴더 구조입니다.

## 1. 계층 구조 및 원칙 (Layered Architecture)

### 1-1. Domain Layer (`src/domain/`)
- **역할**: 핵심 비즈니스 로직 및 제약 조건 파악. 프레임워크나 외부 종속성으로부터 완전히 격리.
- **포함 요소**: Entities, Value Objects, Types/Interfaces, Domain Errors
- **원칙**: Next.js(`next/*`), React(`react`), Supabase 등에 의존하지 않는 순수한 TypeScript 코드로만 작성합니다. (예: 블로그 포스트의 내용 검증 규칙, 주문 최소 금액 기준 등)

### 1-2. Application Layer (`src/application/`)
- **역할**: 도메인 엔티티를 사용하여 사용자의 의미 있는 작업(유스케이스)을 오케스트레이션(조율)합니다.
- **포함 요소**: Use Cases, Ports (In/Out Interfaces), DTOs (Data Transfer Objects)
- **원칙**: `In-Port`(인터페이스)는 프레젠테이션 계층에서 호출할 명세이고, `Out-Port`는 데이터를 저장/불러오기 위해 인프라 계층이 구현해야 할 명세서입니다. DB 쿼리나 연동 코드 자체가 여기에 포함되지 않으므로 유닛 테스트 작성이 매우 용이합니다.

### 1-3. Infrastructure Layer (`src/infrastructure/`)
- **역할**: Application 계층에서 정의된 포트(`Out-Port`)를 실제로 구동하는 외부 기술 구현체입니다.
- **포함 요소**: Repositories (DB 쿼리), API Clients (Supabase, 결제 모듈 등 외부 연동), Data Mappers
- **원칙**: 외부 툴이나 라이브러리(Supabase SDK, Prisma Client 등) 호출 코드는 오직 여기서만 작성하고 `Repository` 형태로 포장하여 Application에 제공합니다.

### 1-4. Presentation Layer (`app/`, `src/presentation/`)
- **역할**: 화면 UI, 라우팅, 컨트롤러 역할 (사용자 입력 수신 및 Use Case 트리거).
- **포함 요소**:
  - `app/` (Next.js App Router): Server Components로 컴포넌트를 렌더링하고, Server Actions(`actions.ts`)를 활용해 커맨드를 수신.
  - `src/presentation/components/`: Shadcn UI 등 순수한 재사용 컴포넌트 단위.
- **원칙**: 컴포넌트에 직접 쿼리나 도메인 규칙을 넣지 않으며, 모든 명령은 컨트롤러(Server Actions)와 Use Case에 위임합니다.

---

## 2. 권장 폴더 구조

\`\`\`text
shopping_dashboard/
├── app/                      
│   ├── (auth)/               
│   ├── dashboard/            
│   │   ├── page.tsx          # Server Component: 데이터를 Fetch(의존성 주입)하여 UI에 전달
│   │   └── actions.ts        # Server Action (Controller): 외부 입력 검증, Use Case 실행
│   └── globals.css
├── src/
│   ├── domain/               # 외부 의존성이 없는 순수 코어 로직
│   │   ├── entities/         # (예: Product.ts, User.ts)
│   │   ├── value-objects/    # (예: Money.ts)
│   │   └── errors/           
│   ├── application/          # 비즈니스 흐름 오케스트레이션
│   │   ├── use-cases/        # (예: CreateOrderUseCase.ts)
│   │   └── ports/
│   │       ├── in/           # 컨트롤러/액션이 인터페이스로 사용할 명세
│   │       └── out/          # 외부 인프라(Repository)가 구현해야 할 인터페이스 명세
│   ├── infrastructure/       # 외부 인프라스트럭처 연결
│   │   ├── repositories/     # Ports/out의 구현체 (예: SupabaseProductRepository.ts)
│   │   ├── database/         # db 인스턴스 초기화 등 (Supabase Client)
│   │   └── services/         # 연동 API 서비스 모듈
│   └── presentation/         # 프레임워크 라우팅 외부에 두는 일반 프리젠테이션 요소
│       ├── components/
│       │   ├── ui/           # Shadcn base components
│       │   └── shared/       # 도메인 모델을 받는 공통 UI 컴포넌트
│       └── hooks/
└── __tests__/                # TDD를 위한 테스트 코드 디렉토리
\`\`\`

---

## 3. 개발 핵심 체크리스트 (Rules)

1. **의존성 규칙**: `Presentation -> Application -> Domain <- Application <- Infrastructure`. 각 계층은 안쪽(Domain)으로만 의존합니다. 외부 라이브러리를 Domain에 삽입하지 마세요.
2. **Server Actions 역할 제한**: Server Action은 오직 컨트롤러 역할만 수행합니다. 인증 체킹, 파라미터 유효성 검사, Use Case 호출 후 에러/성공 형태 반환만 하도록 합니다. 비즈니스 룰은 Use Case/Domain에 있어야 합니다.
3. **TDD 지향 (필수)**: 애플리케이션의 핵심 로직과 엔티티는 외부 API와 분리되어 독립적으로 동작하므로 가장 먼저 테스트(Vitest/Jest)를 작성하기 좋은 환경입니다. 이전 Todo App 개발 경험을 토대로 Use Case와 도메인 규칙에 대한 엣지케이스 유닛 테스트를 습관화해야 합니다.
4. **Supabase/DB 은닉**: `app/page.tsx`나 `actions.ts`에서 `supabase.from('tableName').select()`를 직접 호출하지 않습니다. `infrastrcuture/repositories` 내의 클래스 메서드를 통해 은닉된 형태로 데이터를 전달받아 결합도를 최소화하세요.
