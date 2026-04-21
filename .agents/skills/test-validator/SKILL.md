---
description: "Verify the integrity of business logic by running all unit and integration tests (Vitest) for The Digital Curator project."
---

# Test Validator Skill

This skill executes all test cases written to maintain project quality and analyzes the results.

## Execution Steps

1. **Prepare Environment**: Ensure `node_modules` are installed in the project root.
2. **Run Tests**: Execute `npm run test:run` to perform all tests in CI mode.
3. **Analyze Results**:
    - If all tests pass, the verification is complete.
    - If any tests fail, collect the filenames and error messages for reporting.
4. **Report**: Summarize the total number of tests, passes, and failures.

## Project Test Configuration

- **Domain**: Validates core business rules in `src/domain/entities/`.
- **Infrastructure**: Validates database integration logic in `src/infrastructure/repositories/`.
- **Application**: Validates use case flows in `src/application/use-cases/` and `actions/`.
- **Presentation**: Validates rendering of key UI components (based on `Shadcn UI`).

## Usage Scenarios
- When confirming that new feature implementations do not impact existing functionality.
- For final integrity verification before deployment.
- When consistency of logic needs to be verified after refactoring.
