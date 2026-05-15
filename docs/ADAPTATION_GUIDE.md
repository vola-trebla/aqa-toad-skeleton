# 🐸 AQA TOAD SKELETON: Adaptation Guide

This guide explains how to transform this skeleton into a production-grade framework for **your specific project**.

## 1. Environment Configuration

The framework uses [Zod](https://zod.dev/) to validate environment variables at startup.

- **File**: `src/config/env.config.ts`
- **Action**: Update `DEFAULT_CONFIG` with your project's staging/local URLs and credentials.
- **Action**: Update `envSchema` if your project requires additional variables (e.g., `DB_CONNECTION`, `AUTH_TOKEN`).

## 2. API Clients

The `BaseApiClient` is project-agnostic. It handles response parsing, error throwing, and Zod validation.

- **Action**: Create new clients in `src/api/clients/` extending `BaseApiClient`.
- **Action**: Define your domain schemas in `src/api/schemas/`.
- **Action**: Register your new clients in `src/api/registry.ts`.

## 3. Page Objects & Components

The framework uses a Domain-Driven POM.

- **Action**: Update `src/core/base.page.ts` if you need global hooks (e.g., closing cookie banners).
- **Action**: Create new pages in `src/pages/` extending `BasePage` or `StaticRoutePage`.
- **Action**: Use `src/components/` for reusable widgets (tables, modals, navbars).

## 4. Fixtures

Fixtures are the "glue" of the framework.

- **Action**: Update `src/fixtures/page.fixtures.ts` to include your new Page Objects.
- **Action**: Update `src/fixtures/api.fixtures.ts` to include your new API Clients.

## 5. Purging the Examples

Once you've understood the patterns, you can remove the example files:

1. Delete `tests/*/example.*.spec.ts`.
2. Delete `src/pages/example.page.ts`.
3. Delete `src/api/clients/example.client.ts`.
4. Delete `src/api/schemas/example.schema.ts`.
5. Clean up `src/constants/api-endpoints.ts` and `src/constants/routes.ts`.

## 🚀 Pro-tip: Keep the Patterns, Change the Content

The power of this skeleton is in the **Engineering Standards**:

- Locators are **private**.
- Pages expose **domain actions**.
- Data setup is **API-first**.
- Tests are **atomic**.

---

_Stay professional, stay focused. 🐸_
