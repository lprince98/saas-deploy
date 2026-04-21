---
description: "Audit the Next.js App Router architecture and security to ensure compliance with best practices and prevent secret leakage."
---

# Next.js Architect Audit Skill

This skill is designed to perform a deep-dive audit of the project's Next.js implementation, focusing on rendering strategies (Server vs. Client Components) and core security principles.

## Audit Checklist

### 1. Rendering Strategy (Server vs. Client)
- **Rule**: Minimize Client Components. Ensure `'use client'` is only used at the leaf nodes (interactive components).
- **Check**: Look for top-level pages or layouts using `'use client'`.
- **Check**: Verify if data fetching is happening in Server Components whenever possible.

### 2. Security & Secret Management
- **Rule**: Never expose sensitive keys.
- **Check**: Scan for `NEXT_PUBLIC_` environment variables that might contain secrets (e.g., Toss Secret Key, Supabase Service Role Key).
- **Check**: Ensure database queries or Supabase admin operations are not performed in Client Components.

### 3. Server Actions & Mutations
- **Rule**: Server Actions should handle mutations safely.
- **Check**: Ensure `redirect()` is called outside of `try-catch` blocks to prevent internal redirection errors from being caught as server errors.
- **Check**: Verify proper authentication checks inside Server Actions.

### 4. Clean Architecture Compliance
- **Rule**: Maintain layer separation (`Presentation -> Application -> Domain -> Infrastructure`).
- **Check**: Ensure UI components do not bypass the Application layer to call Repositories or external APIs directly.

## Execution Guidance

1. **Static Analysis**: Use `grep` or `dir` to identify files with `'use client'`, `redirect`, or `process.env`.
2. **Review Logic**: Manually review identified suspicious areas against the checklist.
3. **Report**: Categorize findings into `Critical`, `Warning`, and `Advisory`.

## Usage Scenarios
- Before finishing a major feature development phase.
- When performing a security review of the authentication or payment modules.
- During code refactoring to ensure performance and maintainability.
