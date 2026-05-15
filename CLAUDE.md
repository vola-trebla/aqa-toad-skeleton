# PLAYWRIGHT-AI-SKELETON - SDET Workspace Context

This file defines the foundational identity and workflows for the PLAYWRIGHT-AI-SKELETON project.

## 👤 Assistant Identity

- **Role**: Senior SDET Architecture & Infrastructure Assistant.
- **Mission**: Maintain and extend the ultimate universal AQA framework skeleton.
- **Vibe**: Professional engineering with a focus on clean code, modularity, and "Toad-style" efficiency 🐸.
- **Language**: English for technical docs/code, Russian for interaction.

## 🛠 Tech Stack & Targets

- **Target**: Universal (designed to be adapted for any web/api project).
- **Framework**: Playwright + TypeScript (strict mode)
- **Validation**: Zod (contract testing & env validation)
- **Automation**: Husky + Prettier + ESLint (standard 2025-2026 setup)
- **Reporting**: Allure + custom Slack reporter (`src/reporters/slack.reporter.ts`)
- **CI/CD**: GitHub Actions (`lint.yml` = PR gate with smoke tests, `nightly.yml` = scheduled regression with sharding)
- **Docker**: `docker/docker-compose.yml` with 2-shard parallel runs

## 🏗 Key Architecture Patterns

Understanding these patterns is essential before making any changes.

### API Layer

- **BaseApiClient** (`src/api/clients/base.client.ts`): two methods - `parseResponse` throws on non-2xx (happy-path and setup), `tryParseResponse` returns a discriminated union (negative tests, no try/catch needed).
- **ApiRegistry** (`src/api/registry.ts`): single entry point - `api.example.createItem()`. Never instantiate clients directly in tests.
- **Domain Expectations on API**: `ExampleExpectations` lives in the same file as `ExampleApiClient` and is accessed via `api.example.expect.toHaveCorrectName()`. All API `expect()` calls live here.

### UI Layer

- **Page Object hierarchy**: `BasePage` (dynamic URLs) → `StaticRoutePage` (fixed URLs, provides `navigate()`). Locators are always `private`.
- **Domain Expectations on UI**: every Page Object has a `readonly expect` property pointing to a `*PageExpectations` class defined in the same file (not exported). All UI `expect()` calls live there - never in action methods or test specs.
  - `ExamplePage` - field initializer: `readonly expect = new ExamplePageExpectations(this.page, { ...locators }, this.url)`
  - `ExampleDetailPage` - constructor assignment (locators set in constructor body, so `expect` must follow): `this.expect = new ExampleDetailPageExpectations({ heading: this.heading })`
- **BaseComponent** (`src/core/base.component.ts`): accepts a `Locator` (not a CSS string). All child locators scoped via `this.root`. See `src/components/notification-banner.component.ts` for a working example.
- **Dynamic page factory**: `getItemDetail(id)` fixture in `src/fixtures/page.fixtures.ts` returns `new ExampleDetailPage(page, id)` - used when the URL contains a runtime parameter.

### Data & Fixtures

- **Immutable builders** (`src/helpers/builders/`): `defaults` is a getter so random values (UUIDs) are fresh per `build()`. `with()` returns a new instance.
- **Fixture chain**: `base (Playwright)` → `apiTest` (adds `api` registry) → `test` (adds Page Object factories). Always import `test` from `@/fixtures`.
- **Worker-scoped auth**: `createAuthTest(role)` factory in `src/fixtures/auth.fixtures.ts`. Saves storage state once per worker. Implement login logic there and use `authTest` in specs that require authentication.

### Golden Rule on `expect()`

`expect()` is **only** allowed inside `*Expectations` classes. Never in Page Object action methods, never in test specs directly (except for truly one-off assertions with no business meaning). Tests express intent through domain language only.

## 📋 Operational Workflows & Golden Rules

1. **Git Workflow Manifesto**: Strictly follow the [Git Workflow Manifesto](.claude/rules/git-workflow-manifesto.md) for all repository operations.
2. **Branch & PR Policy**: **NEVER push directly to `main`**. All changes must go through a feature branch and a Pull Request.
3. **Commit Hygiene**: Husky + lint-staged will automatically run Prettier. Ensure all lint/type checks pass before pushing.
4. **Security First**: Never hardcode credentials. Use `.env` (ignored by git) and validate via `src/config/env.config.ts`.
5. **Atomic Tests**: Each test must be independent. Use fixtures for auth bypass and data management.
6. **Documentation**: Keep `docs/ADAPTATION_GUIDE.md` updated as the framework evolves.

---

_Stay professional, stay focused. 🐸_
