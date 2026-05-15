# CONVENTIONS

Coding and authoring conventions for AQA-TOAD-SKELETON. Rules here supplement the ADRs
and apply to all files in the repository.

---

## 1. Test naming

### Language

Test titles (`test('...')`) are written in **Russian** (or your local project language).
Identifiers, comments, and documentation inside source files use **English** (code is universal).

### Pattern

```
<subject> <verb phrase in present tense>
```

The subject is the entity being exercised. The verb describes the observable outcome.

Good:

```
'созданный через API объект отображается в списке'
'неверный пароль показывает сообщение об ошибке'
'обновление имени через API отражается в GET запросе'
```

Bad (implementation, not behavior):

```
'test item API create'      // English, implementation
'check that name updates'   // vague, no subject
```

### `test.describe` blocks

Use `test.describe` with a **domain + context** label and attach tags at the describe
level.

```ts
test.describe('Items - Lifecycle', { tag: [TestTags.smoke] }, () => {
  // ...
});
```

---

## 2. Spec file structure

Every spec file follows this layout:

```ts
// 1. Playwright / framework imports
import { test } from '@/fixtures';

// 2. Project imports
import { TestTags } from '@/constants/test-tags';
import { config } from '@/config/env.config';

// 3. test.describe with tags
test.describe('Domain - Scenario', { tag: [TestTags.smoke] }, () => {
  // 4. Overrides
  test.use({ storageState: { cookies: [], origins: [] } });

  // 5. Individual tests
  test('...', async ({ examplePage }) => {
    // steps then assertions
  });
});
```

---

## 3. When to use `apiTest` vs `test`

| Situation                                               | Use                                                |
| ------------------------------------------------------- | -------------------------------------------------- |
| Test verifies UI behavior (browser interaction)         | `test` from `@/fixtures`                           |
| Test verifies API contract / response structure         | `apiTest` from `@/fixtures`                        |
| Test mixes UI + API (e.g. create via API, assert in UI) | `test` - provides access to both `api` and `pages` |

---

## 4. Imports

Always use the `@/` alias instead of relative paths.

```ts
// Good
import { test } from '@/fixtures';

// Bad
import { test } from '../../fixtures';
```

---

## 5. Selectors

Follow **ADR 0003** (`docs/adr/0003-selector-strategy.md`) strictly.

| Priority                  | Use when                                |
| ------------------------- | --------------------------------------- |
| `getByRole`               | Element has ARIA role + accessible name |
| `getByLabel`              | Form field with `<label>`               |
| `getByPlaceholder`        | Input with placeholder, no label        |
| `getByText`               | Static visible text                     |
| `locator('[name="..."]')` | Stable HTML attribute                   |

---

## 6. Page Objects and domain methods

### Assertions belong in Page Objects

Following ADR 0001, assertion logic lives in Page Object `assert*` methods, not in
spec files. Spec files call `await page.assertSomething()`.

```ts
// Good - in spec
await examplePage.assertStatusMessage('Success');

// Bad - UI assertion leaked into spec
expect(await page.locator('...').textContent()).toBe('...');
```

---

## 7. Builders

Use `ItemBuilder` (or any `BaseBuilder<T>` subclass) to construct test data.

```ts
// Good
const item = new ItemBuilder().with({ name: 'Toad' }).build();
```

---

## 8. Tags

All tags are constants from `src/constants/test-tags.ts`. Never use raw string tags.

```ts
// Good
{
  tag: [TestTags.smoke];
}

// Bad
{
  tag: ['@smoke'];
}
```

---

## See also

- `docs/ADAPTATION_GUIDE.md` - how to adapt this skeleton for your project.
- `docs/adr/0001-domain-first-test-api.md` - why assertions live in Page Objects.
- `docs/adr/0002-fixture-architecture.md` - fixture chain architecture.
- `docs/adr/0003-selector-strategy.md` - selector priority rules.
