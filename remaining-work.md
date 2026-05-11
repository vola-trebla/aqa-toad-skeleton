# Remaining Work

Дата: 2026-05-10

Текущее состояние уже выглядит нормально по главной архитектурной идее:

- спеки стали сценарными;
- локаторы и `expect(locator)` в основном живут внутри Page Object / Component;
- Page Object API стал доменным;
- появились constants, tags, ADR и conventions;
- fixtures разделены на auth/api/page;
- `lint`, `typecheck` и `playwright test --list` проходят.

Ниже - конкретно что еще стоит доделать.

## 1. Удалить старый `UIElement` слой

Проблема: `src/core/ui-element.ts`, `BasePage.element()` и `BaseComponent.element()` остались от старого wrapper DSL. Сейчас они почти не нужны и будут провоцировать возврат к `element.shouldBeVisible()` стилю.

Что сделать:

- удалить `src/core/ui-element.ts`;
- убрать `element()` из `src/core/base.page.ts`;
- убрать `element()` из `src/core/base.component.ts`;
- убедиться, что нигде нет `new UIElement`, `.shouldBeVisible()`, `.shouldHaveText()` и т.п.;
- оставить Playwright `Locator/expect` внутри Page/Component.

Критерий готовности:

- `rg "UIElement|shouldBe|shouldHave|this\\.element\\(" src tests` ничего важного не находит.

## 2. Починить контракт `BasePage`

Проблема: `EmployeeDetailPage` наследует `BasePage`, но `readonly url = Routes.pim.list` не соответствует реальной странице. Страница открывается через `openEmployee(empNumber)`, а `navigate()` для нее концептуально неверен.

Что сделать:

- сделать `BasePage` без обязательного `url` и без универсального `navigate()`;
- либо ввести отдельный `StaticRoutePage` для страниц с фиксированным URL;
- `LoginPage` и `PIMListPage` могут иметь `open()` / `navigate()`;
- `EmployeeDetailPage` должен иметь только `openEmployee(empNumber)`.

Критерий готовности:

- нельзя случайно вызвать `employeeDetailPage.navigate()` и попасть на PIM list.

## 3. Развязать API fixtures от UI login

Проблема: `apiTest` сейчас расширяет `authTest`, а `authTest` делает UI login через browser context. Это лучше старого `page.request`, но API suite все еще зависит от UI auth flow.

Что сделать:

- сделать отдельный API auth или API request context;
- `apiTest` не должен запускать UI login;
- UI tests могут использовать `authTest`;
- API tests должны работать без browser page и без UI page object.

Критерий готовности:

- `tests/api/**/*.spec.ts` запускаются через `apiTest` без создания UI page/login page.

## 4. Выровнять Docker Playwright version

Проблема: `package.json` использует Playwright `1.59.1`, а `docker/Dockerfile` все еще использует image `mcr.microsoft.com/playwright:v1.44.0-jammy`.

Что сделать:

- заменить Docker image на `mcr.microsoft.com/playwright:v1.59.1-jammy`;
- проверить docker-compose env names.

Критерий готовности:

- Docker image версия совпадает с Playwright package version.

## 5. Усилить PIM search smoke assertion

Проблема: `assertSearchHasResults()` проверяет только наличие первой строки. Для smoke это терпимо, но слабее доменной проверки.

Что сделать:

- заменить на `assertSearchResultContainsEmployeeId(id)` или `assertEmployeeVisibleById(id)`;
- в `pim-list.smoke.spec.ts` проверять именно найденный ID.

Критерий готовности:

- smoke search test доказывает, что поиск вернул нужного сотрудника, а не просто любую строку.

## 6. Довести CI/reporting позже

Сейчас PR smoke и nightly blob report уже выглядят заметно лучше. Следующий шаг не срочный:

- добавить flaky signal по retry;
- подумать, нужен ли Slack reporter локально или только в CI;
- visual tests держать отдельно, если они вернутся.

## Приоритет

1. `UIElement` cleanup.
2. `BasePage` contract.
3. API-only fixtures.
4. Docker version.
5. PIM search assertion.

После этих пунктов фреймворк будет выглядеть уже как нормальная масштабируемая база, а не просто skeleton.
