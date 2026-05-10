# Selector and Assertion Practices

Дата: 2026-05-10  
Источник референса: `/Users/albertdev/Projects/site-test`

## Главная идея

Из `site-test` стоит перенести не конкретный код один-в-один, а архитектурный стиль:

```txt
Spec files describe user scenario or page/component contract.
Page Objects and Components own locators and low-level Playwright assertions.
Helper functions wrap repeated technical actions/assertions with readable steps.
Constants/test data keep stable domain vocabulary out of specs.
```

Цель - не raw Playwright в спеках и не огромный wrapper DSL поверх Playwright. Цель - читаемые сценарии в тестах и Playwright как внутренняя реализация Page/Component слоя.

## Что хорошо в site-test

### 1. Спеки читаются как сценарии

Хороший стиль из `site-test`:

```ts
await mainPage.open();
await mainPage.exchangeForm.sendExchangeGroup.triggerCoinSearch(fakeCurrencies.barabulka.name);
await mainPage.exchangeForm.sendExchangeGroup.assertNoCryptocurrencyIsFound();
```

Почему это хорошо:

- тест говорит, что делает пользователь;
- DOM-детали спрятаны;
- проверка названа по смыслу;
- Page/Widget слой можно менять без переписывания спеки.

Аналог для OrangeHRM:

```ts
await pimListPage.open();
await pimListPage.searchEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeVisible(employee);
await pimListPage.deleteEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeAbsent(employee.employeeId);
```

### 2. Page Object и Widget владеют локаторами

В `site-test` локаторы чаще создаются внутри Page/Widget объектов:

```ts
class LoginForm {
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.loginButton = this.root.getByRole('button', { name: 'Log In' });
  }

  async logIn(email: string, password: string) {
    await this.fillForm(email, password);
    await this.clickLogInButton();
  }
}
```

Для нового проекта лучше усилить это правило:

- локаторы по умолчанию `private` или `protected`;
- наружу отдавать действия и проверки;
- публичными могут быть только вложенные components/widgets, если это осознанная композиция.

Хорошо:

```ts
class LoginPage {
  private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  async assertLoginFormReady(): Promise<void> {
    await step('Verify login form is ready', async () => {
      await expect(this.usernameInput).toBeVisible();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeEnabled();
    });
  }
}
```

Плохо:

```ts
await expect(loginPage.passwordInput).toBeVisible();
await loginPage.assertPasswordFieldReady();
```

Первый вариант тащит locator в spec. Второй делает публичный метод на мелкую DOM-деталь.

### 3. Проверки сгруппированы по смыслу

Хороший уровень проверки:

```ts
await signInPage.assertPageIsOpen();
await loginForm.assertErrorIsPresent('Invalid email or password');
await exchangeForm.validateAmountErrorBehavior('Min amount');
```

Это лучше, чем отдельные public методы:

```ts
assertEmailFieldDefaultColor();
assertPasswordFieldErrorColor();
assertPasswordFieldReady();
```

Field-level проверки допустимы, но лучше как private helpers внутри более крупного контракта:

```ts
async assertLoginFormReady(): Promise<void> {
  await step('Verify login form is ready', async () => {
    await this.assertUsernameFieldContract();
    await this.assertPasswordFieldContract();
    await this.assertSubmitButtonContract();
  });
}

private async assertPasswordFieldContract(): Promise<void> {
  await expect(this.passwordInput).toBeVisible();
  await expect(this.passwordInput).toBeEnabled();
  await expect(this.passwordInput).toHaveAttribute('type', 'password');
}
```

Spec должен вызывать `assertLoginFormReady()`, а не `assertPasswordFieldContract()`.

## Selector policy

### Приоритет селекторов

Использовать в таком порядке:

1. `getByRole` - если доступное имя стабильно и отражает пользовательский интерфейс.
2. `getByLabel`, `getByPlaceholder`, `getByText` - если это стабильный UI contract.
3. `getByTestId` - лучший вариант для сложных компонентов и нестабильной верстки.
4. Scoped locator внутри компонента - если компонент уже найден надежно.
5. CSS/XPath - только как fallback, желательно внутри Page/Component, не в spec.

Хорошо:

```ts
private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
private readonly employeeIdInput = this.page.getByLabel('Employee Id');
private readonly table = this.page.getByTestId('employee-table');
```

Нормально, если нет test id/role:

```ts
private readonly employeeIdInput = this.page
  .locator('form .oxd-input-group', { hasText: 'Employee Id' })
  .locator('input');
```

Плохо в spec:

```ts
await expect(page.locator('.oxd-table-card')).toHaveCount(0);
```

Лучше:

```ts
await pimListPage.assertEmployeeAbsent(employee.employeeId);
```

### Scope selectors inside components

Если есть component root, все внутренние селекторы должны искаться от root:

```ts
class EmployeeTable {
  constructor(private readonly root: Locator) {}

  private rows = this.root.locator('.oxd-table-card');
}
```

Не искать элементы компонента от всей страницы, если можно ограничить scope.

## Assertion policy

### В spec-файлах

Разрешено:

- domain assertions;
- page/component contract assertions;
- API/domain data assertions.

Примеры:

```ts
await loginPage.assertInvalidCredentialsShown();
await pimListPage.assertEmployeeVisible(employee);
expect(createdEmployee.empNumber).toBeGreaterThan(0);
```

Не целевой стиль:

```ts
await expect(loginPage.loginButton).toBeVisible();
await expect(page.locator('.oxd-alert-content-text')).toContainText('Invalid credentials');
```

### В Page/Component

Разрешено и ожидаемо:

```ts
await expect(this.errorMessage).toContainText('Invalid credentials');
await expect(this.tableRows.filter({ hasText: employee.employeeId })).toHaveCount(1);
```

Это внутренняя реализация проверки.

### Helper assertions

Из `site-test` хорошая идея - тонкие helpers с readable step:

```ts
await assertElementVisibility(this.loginButton, 'Login button');
await click(this.loginButton, 'Login button');
```

Для нового проекта правило такое:

- helpers можно использовать внутри Page/Component;
- не превращать helpers в основной public API spec-файлов;
- helper должен добавлять step/logging/retry/timeout, а не просто переименовывать Playwright.

## Как переносить в AQA-TOAD-SKELETON

### Login page

Плохо:

```ts
test('password field should be ready', async ({ loginPage }) => {
  await loginPage.assertPasswordFieldReady();
});
```

Хорошо:

```ts
test('login form should be ready for authentication', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.assertLoginFormReady();
});
```

Page Object:

```ts
class LoginPage {
  private readonly usernameInput = this.page.getByPlaceholder('Username');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage = this.page.locator('.oxd-alert-content-text');

  async assertLoginFormReady(): Promise<void> {
    await step('Verify login form is ready for authentication', async () => {
      await expect(this.usernameInput).toBeVisible();
      await expect(this.usernameInput).toBeEnabled();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.passwordInput).toBeEnabled();
      await expect(this.passwordInput).toHaveAttribute('type', 'password');
      await expect(this.loginButton).toBeVisible();
      await expect(this.loginButton).toBeEnabled();
    });
  }

  async assertInvalidCredentialsShown(): Promise<void> {
    await expect(this.errorMessage).toContainText('Invalid credentials');
  }
}
```

### PIM page

Плохо:

```ts
await pimListPage.table.shouldNotBeEmpty();
await expect(page.locator('.oxd-table-card')).toHaveCount(0);
```

Хорошо:

```ts
await pimListPage.searchEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeVisible(employee);
await pimListPage.deleteEmployeeById(employee.employeeId);
await pimListPage.assertEmployeeAbsent(employee.employeeId);
```

Page Object:

```ts
class PIMListPage {
  async assertEmployeeVisible(employee: Employee): Promise<void> {
    await step(`Verify employee ${employee.employeeId} is visible`, async () => {
      const row = this.employeeRowById(employee.employeeId);

      await expect(row).toBeVisible();
      await expect(row).toContainText(employee.firstName);
      await expect(row).toContainText(employee.lastName);
    });
  }

  async assertEmployeeAbsent(employeeId: string): Promise<void> {
    await expect(this.employeeRowById(employeeId)).toHaveCount(0);
  }

  private employeeRowById(employeeId: string): Locator {
    return this.tableRows.filter({ hasText: employeeId });
  }
}
```

## Что не переносить из site-test без изменений

- Огромные fixture files с десятками page fixtures.
- Публичные локаторы как основной API page object.
- Helper assertions напрямую в спеках как основной стиль.
- Большой общий `constants.ts`, куда складывается все подряд.
- Многоуровневые fallback selectors без комментария, если можно договориться о test ids.

## Короткое правило для review

Изменение хорошее, если:

- spec стал более сценарным;
- DOM details ушли внутрь Page/Component;
- проверка названа по смыслу;
- selector scoped and stable;
- constants/test data вынесены по смыслу;
- Playwright не дублируется большим самописным DSL.

Изменение плохое, если:

- spec стал списком `expect(locator)`;
- появился public method на каждое поле;
- локаторы стали публичным API;
- CSS/XPath попали в spec;
- constants превратились в свалку;
- helper просто переименовывает Playwright без дополнительной ценности.
