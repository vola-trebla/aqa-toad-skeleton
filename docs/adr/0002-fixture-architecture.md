# ADR 0002 - Fixture architecture

Date: 2026-05-10
Status: Accepted

## Context

A single fixtures file becomes a God file as the project grows. API tests often do not need a browser page, so they should be isolated.

## Decision

Split fixtures by responsibility:

```
src/fixtures/
  auth.fixtures.ts   - authenticated storage state (worker-scoped)
  api.fixtures.ts    - API clients and test data (extends authTest)
  page.fixtures.ts   - Page Object fixtures (extends apiTest)
  index.ts           - unified exports
```

Three public test entry points:

- `authTest`: authenticated context only.
- `apiTest`: authenticated context + API registry (no browser page).
- `test`: full UI test (authenticated context + API registry + Page Objects).

## Consequences

### Positive

- API tests use `apiTest` and are faster (no browser page initialization).
- Domain-specific clients are registered in `ApiRegistry` and automatically available in fixtures.
- Worker-scoped storage state prevents race conditions in parallel runs.

### Negative

- More files to manage, but better scalability.
