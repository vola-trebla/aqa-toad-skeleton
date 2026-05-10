# AQA-TOAD-SKELETON - Test Authoring Conventions

## Core Architecture

```
Spec files       → domain scenarios and page/component contracts
Page Objects     → page behavior, actions and assertions
Components       → component behavior, actions and assertions
Playwright       → internal implementation detail (Locator, expect)
Constants        → domain vocabulary and technical routes
Fixtures         → test context, roles and data lifecycle
```

## Rule: Domain-first specs, Playwright-first internals

Spec files express **what** is being tested.
Page Objects and Components express **how** it is implemented.

Playwright `Locator` and `expect` live inside Page Objects and Components - not in spec files.

### Allowed in spec files

```ts
await loginPage.navigate();
await loginPage.assertLoginFormReady();
await loginPage.loginWithCredentials(username, password);
await loginPage.assertInvalidCredentialsShown();

await pimListPage.searchEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeVisible(employee);
await pimListPage.deleteEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeAbsent(employee.employeeId);
```

### Not allowed in spec files

```ts
// Raw Playwright in spec - DOM leak
await expect(loginPage.passwordInput).toBeVisible();

// Public method per tiny DOM detail - wrong granularity
await loginPage.assertPasswordFieldReady();
await loginPage.assertUsernameFieldReady();

// Raw CSS selector in spec
await expect(page.locator('.oxd-table-card')).toHaveCount(0);
```

### Page Object public API rules

Public methods express page behavior and page contracts:

```ts
// Good - page contract
async assertLoginFormReady(): Promise<void> { ... }
async loginWithCredentials(username: string, password: string): Promise<void> { ... }
async assertInvalidCredentialsShown(): Promise<void> { ... }
```

Fine-grained DOM checks may exist as **private** helpers, grouped into larger contracts:

```ts
// Private - internal implementation detail
private async assertPasswordFieldAttributes(): Promise<void> {
  await expect(this._passwordInput).toHaveAttribute('type', 'password');
  await expect(this._passwordInput).toHaveAttribute('placeholder', 'Password');
}

// Public - uses private helpers
async assertLoginFormReady(): Promise<void> {
  await expect(this._logo).toBeVisible();
  await this.assertPasswordFieldAttributes();
  // ...
}
```

### Where raw Playwright is allowed

Raw `expect(locator)` is acceptable only in:

- Page Object and Component internals
- API contract tests (`expect(response.status()).toBe(401)`)
- Visual snapshot assertions when no domain abstraction fits

## Locator policy

Locators are private fields on Page Objects and Components.
Page Objects do not expose locators as public API.

```ts
class LoginPage extends BasePage {
  private readonly _passwordInput = this.page.locator('input[name="password"]');
  // no public getter for _passwordInput
}
```

### Selector priority

Use in this order:

1. `getByRole` - if accessible name is stable and reflects the UI
2. `getByLabel`, `getByPlaceholder`, `getByText` - if this is a stable UI contract
3. `getByTestId` - best for complex components and unstable markup
4. Scoped locator inside component root - when component is already reliably found
5. CSS/XPath - fallback only, inside Page/Component, never in spec files

```ts
// Good
private readonly _usernameInput = this.page.getByPlaceholder('Username');
private readonly _loginBtn = this.page.getByRole('button', { name: 'Login' });
private readonly _employeeIdInput = this.page.getByLabel('Employee Id');

// Acceptable when no role/label/placeholder is available
private readonly _tableCard = this.root.locator('.oxd-table-card');

// Not allowed in spec files
await expect(page.locator('.oxd-alert-content-text')).toContainText('Invalid');
```

### Component scoping

Internal selectors must be scoped from the component root:

```ts
class EmployeeTable {
  constructor(private readonly root: Locator) {}
  private readonly rows = this.root.locator('.oxd-table-card');
}
```

## Test data

- Use `testEmployee` fixture for employee lifecycle tests
- Do not create test data inline in spec files
- Cleanup is automatic via fixture teardown
- Do not suppress cleanup errors silently

## Constants

If a string is a route, endpoint, role, tag, stable message or domain label - put it in `src/constants/`.
Do not inline magic strings in spec files for domain concepts.
