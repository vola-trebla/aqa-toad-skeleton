# Adaptation Guide - AI-Assisted Onboarding

This file is designed to be used with an AI assistant (Claude, Copilot, Gemini, etc.).

**How to use:** Open a new AI chat, attach or paste this file, and say:

> "Help me adapt the PLAYWRIGHT-AI-SKELETON to my project."

The AI will ask you the right questions and make the changes step by step.

---

## Instructions for the AI

You are helping a developer adapt the PLAYWRIGHT-AI-SKELETON framework to their specific project.
The skeleton is located in the current working directory.

### Step 1 - Gather project information

Ask the user for the following before making any changes:

1. **Project name** - what is the application under test called?
2. **Base URL** - what is the staging/local URL? (e.g. `https://staging.myapp.com`)
3. **Separate API URL?** - is the API on a different host than the UI? If yes, which one?
4. **Authentication type** - how does login work?
   - API call (POST /login returning a token or cookie)?
   - OAuth / SSO redirect?
   - Basic Auth header?
   - No auth needed?
5. **Credentials** - what env var names should hold the username and password?
6. **Domain entities** - what are the 2-3 main objects the tests will interact with?
   (e.g. "User, Order, Product" or "Employee, Department")
7. **API response shape** - do API responses wrap data in an envelope?
   (e.g. `{ data: { ... } }` vs a raw object `{ id: 1, name: "..." }`)
8. **Key pages** - what are the 2-3 most important pages in the application?
   (e.g. Login, Dashboard, User Management)
9. **Browsers** - chromium only, or all three (chromium, firefox, webkit)?

### Step 2 - Update environment configuration

File: `src/config/env.config.ts`

- Update `DEFAULT_CONFIG` with the user's staging URL and credentials.
- Add or remove env vars in `envSchema` based on what the project needs.
- If extra vars are needed (e.g. `API_TOKEN`, `DB_URL`), add them to the schema.

File: `.env.example`

- Update with the user's real variable names and example values.

### Step 3 - Create API clients

For each domain entity the user mentioned:

1. Create `src/api/schemas/{entity}.schema.ts` - define Zod schemas for the entity and its request/response shapes.
2. Create `src/api/clients/{entity}.client.ts` - extend `BaseApiClient`. Add methods for the CRUD operations the tests will need. Add a `{Entity}Expectations` class in the same file.
3. Register the new client in `src/api/registry.ts` - add it to the `ApiRegistry` interface and `createApiRegistry` factory.

Follow the pattern in `src/api/clients/example.client.ts` exactly.

### Step 4 - Create Page Objects

For each key page the user mentioned:

1. Decide: does the page have a fixed URL? Use `StaticRoutePage`. Dynamic URL with an ID? Use `BasePage`.
2. Create `src/pages/{page-name}.page.ts`.
3. Private locators at the top. Public action methods below. No `expect()` in action methods.
4. Add a `{PageName}PageExpectations` class in the same file (not exported). All `expect()` calls live there.
5. Wire up `readonly expect = new {PageName}PageExpectations(...)` on the Page Object.

Follow the pattern in `src/pages/example.page.ts` exactly.

### Step 5 - Update fixtures

File: `src/fixtures/page.fixtures.ts`

- Import the new Page Object classes.
- Add each new page to the `PageFixtures` type.
- Add each new page to the `test.extend<PageFixtures>({...})` call.
- For pages with dynamic URLs, add a factory fixture: `getX: async ({ page }, use) => use((id) => new XPage(page, id))`.

### Step 6 - Implement authentication

File: `src/fixtures/auth.fixtures.ts`

- Fill in the login logic inside `createAuthTest` based on the auth type the user described.
- API login example is already shown as a comment in the file.
- If the project has multiple roles, create additional exports using `createAuthTest('role-name')`.

### Step 7 - Write the first tests

Create at least one test per suite type to verify the setup works:

- `tests/smoke/{feature}.smoke.spec.ts` - tag with `TestTags.smoke`.
- `tests/api/{entity}.api.spec.ts` - contract test using the new API client.

Use the existing example specs as structural templates.

### Step 8 - Remove example files

Once the user's domain is in place, delete the placeholder files:

- `src/api/clients/example.client.ts`
- `src/api/schemas/example.schema.ts`
- `src/pages/example.page.ts`
- `src/pages/example-detail.page.ts`
- `src/helpers/builders/item.builder.ts`
- `tests/smoke/example.smoke.spec.ts`
- `tests/smoke/example.auth.spec.ts`
- `tests/critical/example.e2e.spec.ts`
- `tests/regression/example.regression.spec.ts`
- `tests/api/example.api.spec.ts`

Then remove the `example` entry from `src/api/registry.ts` and `src/fixtures/page.fixtures.ts`.

### Step 9 - Final checks

Run the following and fix any errors before declaring the adaptation done:

```bash
npm run typecheck
npm run lint
```

Verify the smoke suite runs (it is expected to fail if the real app is not reachable, but it should not have compile or import errors):

```bash
npm run test:smoke
```

---

## Key rules to preserve during adaptation

These are the non-negotiable engineering standards of this framework. Do not break them:

- `expect()` only inside `*Expectations` classes - never in action methods or test specs.
- Locators are always `private` on Page Objects.
- Test specs express domain intent only - no Playwright API calls directly in spec files.
- All API calls go through typed clients registered in `ApiRegistry` - no raw `request.get()` in tests.
- Every new builder must extend `BaseBuilder` and validate via Zod in `build()`.
- Auth logic lives in `auth.fixtures.ts` - never in individual test files.
