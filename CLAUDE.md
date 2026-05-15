# AQA-TOAD-SKELETON - SDET Workspace Context

This file defines the foundational identity and workflows for the AQA-TOAD-SKELETON project.

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
- **CI/CD**: GitHub Actions (`lint.yml` = PR gate, `nightly.yml` = scheduled regression with sharding)
- **Docker**: `docker/docker-compose.yml` with 2-shard parallel runs

## 🏗 Key Architecture Patterns

Understanding these patterns is essential before making changes:

- **BaseApiClient** (`src/api/clients/base.client.ts`): `parseResponse` throws on non-2xx (use in setup/happy-path), `tryParseResponse` returns a discriminated union (use in negative tests).
- **ApiRegistry** (`src/api/registry.ts`): single entry point for all API clients. Tests access `api.example.createItem()` - never instantiate clients directly.
- **Fixture chain**: `base (Playwright)` → `apiTest` (adds `api` registry) → `test` (adds Page Objects). Always import `test` from `@/fixtures`, never from `@playwright/test` directly.
- **Worker-scoped auth**: `createAuthTest(role)` factory in `src/fixtures/auth.fixtures.ts`. Saves storage state once per worker, not per test.
- **Immutable builders** (`src/helpers/builders/`): `defaults` is a getter so random values (UUIDs) are fresh on every `build()`. `with()` returns a new instance - no mutation.
- **Domain Expectations**: colocated with API clients as `readonly expect = new ExampleExpectations()`. Tests call `api.example.expect.toHaveCorrectName(item, name)`.
- **StaticRoutePage vs BasePage**: `StaticRoutePage` for fixed URLs (provides `navigate()`), `BasePage` for dynamic URLs (e.g., `/users/123`).
- **BaseComponent** (`src/core/base.component.ts`): root-locator pattern for reusable UI widgets (tables, modals). Accepts a CSS selector string.

## 📋 Operational Workflows & Golden Rules

1. **Git Workflow Manifesto**: Strictly follow the [Git Workflow Manifesto](.claude/rules/git-workflow-manifesto.md) for all repository operations.
2. **Branch & PR Policy**: **NEVER push directly to `main`**. All changes must go through a feature branch and a Pull Request.
3. **Commit Hygiene**: Husky + lint-staged will automatically run Prettier. Ensure all lint/type checks pass before pushing.
4. **Security First**: Never hardcode credentials. Use `.env` (ignored by git) and validate via `src/config/env.config.ts`.
5. **Atomic Tests**: Each test must be independent. Use fixtures for auth bypass and data management.
6. **Documentation**: Keep `docs/ADAPTATION_GUIDE.md` updated as the framework evolves.

---

_Stay professional, stay focused. 🐸_
