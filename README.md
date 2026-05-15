# 🐸 AQA-TOAD-SKELETON

**A production-ready Playwright + TypeScript test automation framework template.**

Clone it, adapt it, ship it. No boilerplate hunting, no wiring up from scratch.

> Playwright boilerplate | TypeScript e2e framework | SDET starter kit | Page Object Model template | API testing with Zod

---

## What is this?

A universal test automation skeleton built for SDETs who want to start a new project the right way - without spending the first week on infrastructure. It implements battle-tested engineering patterns and ships with working CI, Docker, and a Slack reporter out of the box.

Designed to be **cloned once and adapted** to any web or API project.

---

## Why use this skeleton?

- **Zero ambiguity on architecture** - every pattern has a clear example: API clients, Page Objects, Builders, Fixtures.
- **Fail-fast env validation** - Zod validates your `.env` at startup, not mid-run.
- **Hybrid UI + API testing** - API clients and UI Page Objects share the same fixture chain.
- **Worker-scoped auth** - login once per worker, not before every test.
- **Ready for CI/CD** - PR smoke gate + nightly regression with sharding, all pre-wired.

---

## Tech Stack

| Layer                   | Tool                                                     |
| ----------------------- | -------------------------------------------------------- |
| Test runner             | [Playwright](https://playwright.dev/)                    |
| Language                | TypeScript (strict mode)                                 |
| Schema & env validation | [Zod](https://zod.dev/)                                  |
| Git hooks               | [Husky](https://typicode.github.io/husky/) + lint-staged |
| Linting / Formatting    | ESLint + Prettier                                        |
| Reporting               | Allure + custom Slack reporter                           |
| CI/CD                   | GitHub Actions                                           |
| Containerization        | Docker + docker-compose                                  |

---

## Project Structure

```
project-root/
├── .github/workflows/
│   ├── lint.yml             # PR gate: lint, typecheck, smoke tests
│   └── nightly.yml          # Scheduled regression with sharding + report merge
├── docker/                  # Dockerfile + docker-compose for local parallel runs
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   ├── ADAPTATION_GUIDE.md  # Step-by-step: replace examples with your domain
│   └── CONVENTIONS.md       # Naming, imports, selector and builder rules
├── src/
│   ├── api/
│   │   ├── clients/         # BaseApiClient + typed domain clients
│   │   ├── schemas/         # Zod schemas for API contracts
│   │   ├── registry.ts      # Central registry: api.example.createItem()
│   │   └── api-error.ts     # Typed API error class
│   ├── config/              # Zod-validated env config (BASE_URL, credentials, CI flag)
│   ├── core/                # BasePage, StaticRoutePage, BaseComponent, step()
│   ├── constants/           # Routes, API endpoints, TestTags
│   ├── pages/               # Page Objects (private locators, public domain actions)
│   ├── fixtures/            # Fixture chain: apiTest -> test (with worker-scoped auth)
│   ├── helpers/
│   │   ├── builders/        # Immutable BaseBuilder + ItemBuilder (fresh data per build)
│   │   └── wait-for-api.ts  # Race-free network interception helper
│   └── reporters/           # Slack reporter with failure summary
└── tests/
    ├── smoke/               # Fast sanity checks - triggered on every PR
    ├── critical/            # Happy-path E2E scenarios
    ├── regression/          # Negative and edge-case scenarios
    └── api/                 # Contract tests (Zod schema + semantics)
```

---

## Getting Started

**1. Install**

```bash
npm install
npx playwright install
```

**2. Configure**

```bash
cp .env.example .env
# Edit .env with your app URL and credentials
```

**3. Run**

```bash
# All tests
npm test

# UI tests (Chromium only)
npm run test:ui

# API tests only
npm run test:api

# Filter by tag
npx playwright test --grep @smoke
npx playwright test --grep @critical
```

---

## Engineering Standards

**Encapsulation** - Locators are private. Page Objects expose domain actions (`login()`, `assertOpen()`), not Playwright internals. Tests express business intent only. See [ADR 0001](docs/adr/0001-domain-first-test-api.md).

**Fixture composition** - `apiTest` provides typed API clients. `test` extends it with Page Objects. Auth is worker-scoped via `createAuthTest(role)`. See [ADR 0002](docs/adr/0002-fixture-architecture.md).

**Selector strategy** - `getByRole` and semantic locators first. CSS strings isolated to components. XPath prohibited. See [ADR 0003](docs/adr/0003-selector-strategy.md).

**API-first data setup** - Create test data via API before UI tests. Faster and more reliable than navigating setup flows through the browser.

**Immutable builders** - `ItemBuilder.withName('x').build()` generates typed, Zod-validated payloads with random defaults. No shared mutable state between tests.

**Typed errors** - `ApiError` carries `status`, `url`, and `body`. `tryParseResponse()` returns a discriminated union for negative test assertions without try/catch.

---

## Adapting to Your Project

See the **[Adaptation Guide](docs/ADAPTATION_GUIDE.md)** - it walks through replacing the example files with your own domain in under 30 minutes.

---

_Stay professional, stay focused. 🐸_
