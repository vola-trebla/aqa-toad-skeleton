# ADR 0002 - Fixture architecture

Date: 2026-05-10
Status: Accepted

## Context

A single `src/fixtures/index.ts` was becoming a God file with auth, page objects, API clients and test data side-by-side. API tests required a browser page (`page.request`) even when they did not need UI.

## Decision

Split fixtures by responsibility:

```
src/fixtures/
  auth.fixtures.ts   - workerStorageState, storageState override (role-aware path)
  api.fixtures.ts    - API clients, test data fixtures (extends authTest)
  page.fixtures.ts   - Page Object fixtures (extends apiTest)
  index.ts           - re-exports test, apiTest, authTest, expect
```

Three public test entry points:

- `authTest` - auth-only (storage state)
- `apiTest` - auth + API clients + test data, uses Playwright's `request` fixture (no browser page in test bodies)
- `test` - full UI test (auth + api + page objects)

## Consequences

### Positive

- API tests use `apiTest` and never reach for `page` - clearer intent and faster
- Adding a new domain (e.g. `recruitment`) does not require editing one central file
- Role-aware storage state path (`.auth/admin-worker-0.json`) is ready for multi-role auth without restructure
- Cleanup failures in fixtures are surfaced via `console.error` instead of silent catch

### Negative

- Three files instead of one, slightly more boilerplate
- Spec authors need to choose the correct entry point (mitigated by clear naming and `CONVENTIONS.md`)

## Future work

- Add OAuth-based API auth so `apiTest` can skip the UI-login browser context entirely per worker
- Add `managerTest`/`employeeTest` when OrangeHRM scope grows beyond admin
