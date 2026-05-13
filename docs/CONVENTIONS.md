# CONVENTIONS

Coding and authoring conventions for AQA-TOAD-SKELETON. Rules here supplement the ADRs
and apply to all files in the repository.

---

## 1. Test naming

### Language

Test titles (`test('...')`) are written in **Russian**. The reasoning: the OrangeHRM
Demo is our concrete target, the team communicates in Russian, and Russian titles read
as plain requirements - no translation overhead when the product owner reads a report.

Identifiers, comments, and documentation inside source files use **English** (code
is universal; English keeps IDE tooling, search, and diffs clean).

### Pattern

```
<subject> <verb phrase in present tense>
```

The subject is the entity being exercised. The verb describes the observable outcome,
not the implementation.

Good:

```
'созданный через API сотрудник отображается в PIM списке'
'неверный пароль показывает сообщение об ошибке'
'обновление имени через API отражается в GET запросе'
```

Bad (implementation, not behavior):

```
'test employee API create'      // English, implementation
'check that name updates'       // vague, no subject
'verify login error message'    // English, imperative
```

### `test.describe` blocks

Use `test.describe` with a **domain + context** label and attach tags at the describe
level, not the individual test level (unless a single test needs an extra tag).

```ts
test.describe('Employee Lifecycle', { tag: [TestTags.critical, TestTags.pim] }, () => {
  // ...
});
```

---

## 2. Spec file structure

Every spec file follows this layout (do not reorder):

```ts
// 1. Playwright / framework imports
import { test } from '@/fixtures';
import { expect } from '@/fixtures'; // only when inline expect is needed

// 2. Project imports - constants first, then types
import { TestTags } from '@/constants/test-tags';
import { config } from '@/config/env.config';

// 3. test.describe with tags
test.describe('Domain - Scenario', { tag: [TestTags.smoke] }, () => {
  // 4. test.use overrides (storageState, viewport, etc.) at the top of describe
  test.use({ storageState: { cookies: [], origins: [] } });

  // 5. Individual tests
  test('...', async ({ fixtures }) => {
    // steps then assertions
  });
});
```

Rules:

- One `test.describe` per file.
- No top-level `beforeAll` / `afterAll` - use fixtures.
- No `let` mutable state at describe scope. Isolate everything in fixtures.

---

## 3. When to use `apiTest` vs `test`

| Situation                                               | Use                                                 |
| ------------------------------------------------------- | --------------------------------------------------- |
| Test verifies UI behavior (browser interaction)         | `test` from `@/fixtures`                            |
| Test verifies API contract / response structure         | `apiTest` from `@/fixtures`                         |
| Test mixes UI + API (e.g. create via API, assert in UI) | `test` - `testEmployee` fixture covers the API part |
| Test needs `api` registry directly for custom API calls | `apiTest` from `@/fixtures`                         |

Import shorthand:

```ts
// UI-only or mixed
import { test } from '@/fixtures';

// API-only
import { apiTest as test, expect } from '@/fixtures';
```

The `apiTest` fixture chain provides the `api` registry. The base `test` chain provides
`pimListPage`, `loginPage`, `dashboardPage`, `employeeDetailPage`, and the `testEmployee`
/ `createEmployee` factories (via `apiTest` extension).

---

## 4. Imports

### Path aliases

Always use the `@/` alias instead of relative paths. This alias is configured in both
`tsconfig.json` and `playwright.config.ts`.

```ts
// Good
import { test } from '@/fixtures';
import { OXD } from '@/constants/oxd-selectors';

// Bad
import { test } from '../../fixtures';
```

### Import order (enforced by ESLint)

1. `@playwright/test` and external packages
2. Internal framework imports via `@/` alias
3. Type-only imports (`import type { ... }`)

No default exports. All exports are named.

---

## 5. Selectors

Follow **ADR 0003** (`docs/adr/0003-selector-strategy.md`) strictly. Quick reference:

| Priority                  | Use when                                        |
| ------------------------- | ----------------------------------------------- |
| `getByRole`               | Element has ARIA role + accessible name         |
| `getByLabel`              | Form field with `<label>`                       |
| `getByPlaceholder`        | Input with placeholder, no label                |
| `getByText`               | Static visible text                             |
| `locator('[name="..."]')` | Stable HTML attribute                           |
| `locator(OXD.x.y)`        | OXD element with no ARIA (use `OXD` const only) |
| XPath / positional        | **Prohibited** - requires justification comment |

**Never** write OXD CSS class strings inline in Page Objects or specs. All OXD strings
live in `src/constants/oxd-selectors.ts`.

---

## 6. Page Objects and domain methods

### Assertions belong in Page Objects

Following ADR 0001, assertion logic lives in Page Object `assert*` methods, not in
spec files. Spec files call `await page.assertSomething()` - they do not contain
`expect()` calls unless the assertion is purely data-level (e.g., API response shape).

```ts
// Good - in spec
await pimListPage.assertEmployeeVisible(testEmployee);

// Good - API contract assertion inline in spec
expect(testEmployee.empNumber).toBeGreaterThan(0);

// Bad - UI assertion leaked into spec
expect(await page.locator('...').textContent()).toBe('...');
```

### Soft assertions for form-ready checks

When verifying that a form is fully rendered (all fields visible and enabled), use
`expect.soft()` so all missing fields are reported in a single run:

```ts
async assertLoginFormReady(): Promise<void> {
  await expect.soft(this.usernameInput).toBeVisible();
  await expect.soft(this.passwordInput).toBeVisible();
  await expect.soft(this.submitButton).toBeEnabled();
}
```

### `waitForApi` before DOM assertions

When a user action triggers a network request, call `waitForApi` before asserting DOM
state. This avoids race conditions with optimistic UI updates:

```ts
import { waitForApi } from '@/helpers/wait-for-api';

await Promise.all([waitForApi(this.page, ApiEndpoints.pim.employees), this.searchButton.click()]);
await expect(this.employeeRow).toBeVisible();
```

---

## 7. Builders

Use `EmployeeBuilder` (or any `BaseBuilder<T>` subclass) to construct test data.
Never construct raw objects literal where a builder exists.

```ts
// Good
const employee = new EmployeeBuilder().with({ firstName: 'Alice' }).build();

// Good - named factory
const manager = EmployeeBuilder.aManager().build();

// Bad - raw object
const employee = { firstName: 'Alice', lastName: 'Smith', employeeId: 'E12345', middleName: '' };
```

Builders are validated by Zod on `build()`. An invalid combination throws at build
time, not at runtime mid-test.

---

## 8. Tags

All tags are constants from `src/constants/test-tags.ts`. Never use raw string tags.

```ts
// Good
{
  tag: [TestTags.smoke, TestTags.pim];
}

// Bad
{
  tag: ['@smoke', '@pim'];
}
```

Available tags: `TestTags.smoke`, `TestTags.regression`, `TestTags.critical`,
`TestTags.api`, `TestTags.auth`, `TestTags.pim`.

---

## 9. Error handling in fixtures

Fixture teardown must be silent about expected errors (e.g., 404 on cleanup when a
test already deleted the resource). Use `ApiError` for structured checks:

```ts
import { ApiError } from '@/api/api-error';

try {
  await api.employee.deleteMultiple(ids);
} catch (err) {
  if (err instanceof ApiError && err.status === 404) return;
  console.warn('[fixture cleanup]', err instanceof Error ? err.message : err);
}
```

Do not swallow unexpected errors - log them with `console.warn` so they appear in the
Playwright report without failing the test.

---

## See also

- `docs/adr/0001-domain-first-test-api.md` - why assertions live in Page Objects
- `docs/adr/0002-fixture-chain.md` - fixture chain architecture
- `docs/adr/0003-selector-strategy.md` - selector priority rules
- `src/constants/test-tags.ts` - available tags
- `src/constants/oxd-selectors.ts` - OXD CSS selector registry
