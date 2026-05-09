# 🐸 Ultimate SDET Framework Blueprint

## UI + API Automation | TypeScript + Playwright

### Контекст: ITSM/ITAM продукт (Alloy Navigator-like)

---

## Философия

Это не "папка с тестами". Это инженерный продукт, который тестирует другой продукт.
Фреймворк должен быть таким, чтобы:

- Новый человек мог написать тест за первый день
- Сломанный UI чинится в одном месте, не в ста тестах
- CI даёт обратную связь за минуты, не за часы
- Любой тест читается как бизнес-сценарий, не как набор кликов

---

## Структура проекта

```
project-root/
├── src/
│   ├── config/                  # Конфигурация окружений
│   │   ├── env.config.ts        # Типизированный конфиг через Zod
│   │   └── test.config.ts       # Playwright config
│   │
│   ├── core/                    # Ядро фреймворка
│   │   ├── base.page.ts         # Базовый Page Object
│   │   ├── base.component.ts    # Базовый Component Object
│   │   ├── base.api.ts          # Базовый API Client
│   │   └── logger.ts            # Кастомный логгер
│   │
│   ├── api/                     # API-слой
│   │   ├── clients/             # Типизированные API-клиенты
│   │   │   ├── tickets.client.ts
│   │   │   ├── assets.client.ts
│   │   │   └── users.client.ts
│   │   ├── schemas/             # Zod-схемы для валидации ответов
│   │   │   ├── ticket.schema.ts
│   │   │   ├── asset.schema.ts
│   │   │   └── user.schema.ts
│   │   └── contracts/           # Контрактные тесты
│   │       └── ticket.contract.ts
│   │
│   ├── pages/                   # Page Objects
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── tickets/
│   │   │   ├── ticket-list.page.ts
│   │   │   └── ticket-detail.page.ts
│   │   └── assets/
│   │       ├── asset-list.page.ts
│   │       └── asset-detail.page.ts
│   │
│   ├── components/              # Переиспользуемые UI-компоненты
│   │   ├── sidebar.component.ts
│   │   ├── modal.component.ts
│   │   ├── table.component.ts
│   │   ├── form.component.ts
│   │   └── notification.component.ts
│   │
│   ├── fixtures/                # Playwright fixtures
│   │   ├── auth.fixture.ts      # Авторизация через API
│   │   ├── ticket.fixture.ts    # Создание тестового тикета
│   │   ├── asset.fixture.ts     # Создание тестового ассета
│   │   └── index.ts             # Объединение всех fixtures
│   │
│   ├── helpers/                 # Утилиты
│   │   ├── data-factory.ts      # Builder для тестовых данных
│   │   ├── wait-helpers.ts      # Кастомные ожидания
│   │   ├── retry.ts             # Retry логика
│   │   └── date-utils.ts
│   │
│   └── reporters/               # Кастомные репортеры
│       ├── allure.reporter.ts
│       └── slack.reporter.ts
│
├── tests/
│   ├── smoke/                   # Smoke suite — 3-5 мин
│   │   ├── login.smoke.spec.ts
│   │   └── dashboard.smoke.spec.ts
│   │
│   ├── critical/                # Критичные flows — 10 мин
│   │   ├── ticket-lifecycle.spec.ts
│   │   └── asset-tracking.spec.ts
│   │
│   ├── regression/              # Полная регрессия — nightly
│   │   ├── tickets/
│   │   ├── assets/
│   │   └── workflows/
│   │
│   └── api/                     # Чистые API-тесты
│       ├── tickets.api.spec.ts
│       ├── assets.api.spec.ts
│       └── contracts/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .github/workflows/
│   ├── smoke.yml                # На каждый PR
│   ├── critical.yml             # На merge в main
│   └── nightly.yml              # Полная регрессия ночью
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Ключевые паттерны и примеры кода

### 1. Типизированный конфиг через Zod

Не просто `.env` файл — а валидация при старте. Если конфиг кривой — тесты не запустятся с понятной ошибкой, а не упадут на 50-м шаге.

```typescript
// src/config/env.config.ts
import { z } from 'zod';

const envSchema = z.object({
  BASE_URL: z.string().url(),
  API_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1),
  ENV: z.enum(['staging', 'production', 'local']),
  CI: z.boolean().default(false),
  SLACK_WEBHOOK: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const config: EnvConfig = envSchema.parse({
  BASE_URL: process.env.BASE_URL,
  API_URL: process.env.API_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ENV: process.env.ENV || 'staging',
  CI: process.env.CI === 'true',
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
});
```

**Зачем:** Тесты падают с понятным сообщением "BASE_URL is required" вместо загадочного `Cannot read property of undefined` через 2 минуты после старта.

---

### 2. Базовый Page Object с встроенными ожиданиями

```typescript
// src/core/base.page.ts
import { Page, Locator } from '@playwright/test';
import { config } from '../config/env.config';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async navigate(): Promise<void> {
    await this.page.goto(`${config.BASE_URL}${this.url}`);
    await this.waitForPageLoad();
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Универсальный метод для действий с автоматическим ожиданием
  protected async clickAndWait(
    locator: Locator,
    options?: { waitForNavigation?: boolean; waitForResponse?: string }
  ): Promise<void> {
    if (options?.waitForResponse) {
      await Promise.all([
        this.page.waitForResponse(
          (resp) => resp.url().includes(options.waitForResponse!) && resp.ok()
        ),
        locator.click(),
      ]);
    } else if (options?.waitForNavigation) {
      await Promise.all([this.page.waitForNavigation(), locator.click()]);
    } else {
      await locator.click();
    }
  }

  // Скриншот при падении — автоматически
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      fullPage: true,
      path: `screenshots/${name}-${Date.now()}.png`,
    });
  }
}
```

---

### 3. Component Object — переиспользуемые UI-блоки

```typescript
// src/components/table.component.ts
import { Locator, Page } from '@playwright/test';

export class TableComponent {
  private readonly root: Locator;

  constructor(page: Page, containerSelector: string = '[data-testid="data-table"]') {
    this.root = page.locator(containerSelector);
  }

  get rows(): Locator {
    return this.root.locator('tbody tr');
  }

  async getRowCount(): Promise<number> {
    return this.rows.count();
  }

  async getRowByText(text: string): Promise<Locator> {
    return this.rows.filter({ hasText: text });
  }

  async getCellValue(row: number, column: number): Promise<string> {
    return this.rows.nth(row).locator('td').nth(column).innerText();
  }

  async sortByColumn(columnName: string): Promise<void> {
    await this.root.locator(`th`, { hasText: columnName }).click();
  }

  async waitForData(): Promise<void> {
    await this.root.locator('tbody tr').first().waitFor({ state: 'visible' });
  }
}

// src/components/modal.component.ts
export class ModalComponent {
  private readonly root: Locator;

  constructor(page: Page, selector: string = '[data-testid="modal"]') {
    this.root = page.locator(selector);
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async close(): Promise<void> {
    await this.root.locator('[data-testid="modal-close"]').click();
    await this.root.waitFor({ state: 'hidden' });
  }

  async confirm(): Promise<void> {
    await this.root.locator('[data-testid="modal-confirm"]').click();
  }

  async getTitle(): Promise<string> {
    return this.root.locator('[data-testid="modal-title"]').innerText();
  }
}
```

**Зачем:** Таблицы и модалки встречаются на каждой второй странице ITSM-продукта. Один компонент — десятки страниц его используют.

---

### 4. Page Object для ITSM-сценария

```typescript
// src/pages/tickets/ticket-detail.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../../core/base.page';
import { ModalComponent } from '../../components/modal.component';

// Типизируем статусы тикета — state machine
type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export class TicketDetailPage extends BasePage {
  readonly url = '/tickets';
  private readonly modal: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.modal = new ModalComponent(page);
  }

  // Селекторы — только data-testid
  private readonly selectors = {
    status: '[data-testid="ticket-status"]',
    priority: '[data-testid="ticket-priority"]',
    assignee: '[data-testid="ticket-assignee"]',
    description: '[data-testid="ticket-description"]',
    changeStatusBtn: '[data-testid="change-status-btn"]',
    statusOption: (status: TicketStatus) =>
      `[data-testid="status-option-${status.toLowerCase().replace(' ', '-')}"]`,
    commentInput: '[data-testid="comment-input"]',
    addCommentBtn: '[data-testid="add-comment-btn"]',
    commentsList: '[data-testid="comments-list"]',
  };

  async getStatus(): Promise<string> {
    return this.page.locator(this.selectors.status).innerText();
  }

  async changeStatus(newStatus: TicketStatus): Promise<void> {
    await this.page.locator(this.selectors.changeStatusBtn).click();
    await this.page.locator(this.selectors.statusOption(newStatus)).click();

    // Если статус требует подтверждения — обрабатываем модалку
    if (await this.modal.isVisible()) {
      await this.modal.confirm();
    }

    // Ждём обновления статуса через API
    await this.clickAndWait(this.page.locator(this.selectors.statusOption(newStatus)), {
      waitForResponse: '/api/tickets/',
    });
  }

  async addComment(text: string): Promise<void> {
    await this.page.locator(this.selectors.commentInput).fill(text);
    await this.clickAndWait(this.page.locator(this.selectors.addCommentBtn), {
      waitForResponse: '/api/comments',
    });
  }

  async getCommentsCount(): Promise<number> {
    return this.page
      .locator(this.selectors.commentsList)
      .locator('[data-testid="comment-item"]')
      .count();
  }
}
```

---

### 5. Builder Pattern для тестовых данных

```typescript
// src/helpers/data-factory.ts

interface Ticket {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  assignee?: string;
}

export class TicketBuilder {
  private ticket: Ticket = {
    title: `Auto-ticket-${Date.now()}`,
    description: 'Auto-generated ticket for testing',
    priority: 'Medium',
    category: 'Hardware',
  };

  withTitle(title: string): this {
    this.ticket.title = title;
    return this;
  }

  withPriority(priority: Ticket['priority']): this {
    this.ticket.priority = priority;
    return this;
  }

  withCategory(category: string): this {
    this.ticket.category = category;
    return this;
  }

  withAssignee(assignee: string): this {
    this.ticket.assignee = assignee;
    return this;
  }

  critical(): this {
    this.ticket.priority = 'Critical';
    return this;
  }

  build(): Ticket {
    return { ...this.ticket };
  }
}

// Использование:
// const ticket = new TicketBuilder().withTitle('Сломался принтер').critical().build();

interface Asset {
  name: string;
  type: 'Hardware' | 'Software' | 'License';
  serialNumber: string;
  status: 'Active' | 'Retired' | 'In Stock';
  assignedTo?: string;
}

export class AssetBuilder {
  private asset: Asset = {
    name: `Asset-${Date.now()}`,
    type: 'Hardware',
    serialNumber: `SN-${Math.random().toString(36).substring(7).toUpperCase()}`,
    status: 'Active',
  };

  ofType(type: Asset['type']): this {
    this.asset.type = type;
    return this;
  }

  assignedTo(user: string): this {
    this.asset.assignedTo = user;
    return this;
  }

  retired(): this {
    this.asset.status = 'Retired';
    return this;
  }

  build(): Asset {
    return { ...this.asset };
  }
}
```

**Зачем:** Тестовые данные всегда уникальны (timestamp в имени), читаемы (builder цепочка), и не конфликтуют при параллельном запуске.

---

### 6. API Client с Zod-валидацией

```typescript
// src/api/clients/tickets.client.ts
import { APIRequestContext } from '@playwright/test';
import { z } from 'zod';
import { config } from '../../config/env.config';
import { ticketSchema, ticketListSchema } from '../schemas/ticket.schema';

export class TicketsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async create(data: { title: string; description: string; priority: string; category: string }) {
    const response = await this.request.post(`${config.API_URL}/api/tickets`, {
      data,
    });

    const body = await response.json();

    // Валидация через Zod — если API вернул неожиданную структуру, тест падает ЗДЕСЬ
    // а не через 10 шагов когда UI не нашёл поле
    return ticketSchema.parse(body);
  }

  async getById(id: string) {
    const response = await this.request.get(`${config.API_URL}/api/tickets/${id}`);
    const body = await response.json();
    return ticketSchema.parse(body);
  }

  async list(params?: { status?: string; priority?: string }) {
    const response = await this.request.get(`${config.API_URL}/api/tickets`, {
      params,
    });
    const body = await response.json();
    return ticketListSchema.parse(body);
  }

  async delete(id: string): Promise<void> {
    await this.request.delete(`${config.API_URL}/api/tickets/${id}`);
  }

  async changeStatus(id: string, status: string) {
    const response = await this.request.patch(`${config.API_URL}/api/tickets/${id}/status`, {
      data: { status },
    });
    return ticketSchema.parse(await response.json());
  }
}

// src/api/schemas/ticket.schema.ts
import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['New', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  category: z.string(),
  assignee: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ticketListSchema = z.object({
  items: z.array(ticketSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type Ticket = z.infer<typeof ticketSchema>;
```

**Зачем:** Zod-валидация — это контрактное тестирование "из коробки". Если бэкенд поменял формат ответа — тест упадёт на валидации схемы с понятным сообщением, а не на загадочном undefined.

---

### 7. Playwright Fixtures — авторизация и тестовые данные

```typescript
// src/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { config } from '../config/env.config';

// Авторизация через API, не через UI — быстрее в 10 раз
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page, request }, use) => {
    // Получаем токен через API
    const response = await request.post(`${config.API_URL}/api/auth/login`, {
      data: {
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
      },
    });

    const { token } = await response.json();

    // Устанавливаем cookie/storage — UI логин не нужен
    await page.context().addCookies([
      {
        name: 'auth_token',
        value: token,
        domain: new URL(config.BASE_URL).hostname,
        path: '/',
      },
    ]);

    await use(page);
  },
});

// src/fixtures/ticket.fixture.ts
import { test as authTest } from './auth.fixture';
import { TicketsApiClient } from '../api/clients/tickets.client';
import { TicketBuilder } from '../helpers/data-factory';

export const test = authTest.extend<{
  testTicket: { id: string; title: string };
  ticketsApi: TicketsApiClient;
}>({
  ticketsApi: async ({ request }, use) => {
    await use(new TicketsApiClient(request));
  },

  // Создаём тикет через API ДО теста, удаляем ПОСЛЕ
  testTicket: async ({ ticketsApi }, use) => {
    const data = new TicketBuilder()
      .withTitle(`E2E-test-${Date.now()}`)
      .withPriority('High')
      .build();

    const ticket = await ticketsApi.create(data);

    await use({ id: ticket.id, title: data.title });

    // Teardown — чистим за собой
    await ticketsApi.delete(ticket.id);
  },
});

// src/fixtures/index.ts — объединяем всё
export { test } from './ticket.fixture';
export { expect } from '@playwright/test';
```

**Зачем:** Каждый тест получает свои данные, изолированные от других. Тесты можно запускать параллельно без конфликтов. Teardown гарантирует чистоту даже при падении.

---

### 8. Сам тест — читается как сценарий

```typescript
// tests/critical/ticket-lifecycle.spec.ts
import { test, expect } from '../../src/fixtures';
import { TicketDetailPage } from '../../src/pages/tickets/ticket-detail.page';

test.describe('Ticket Lifecycle — state machine', () => {
  test('полный жизненный цикл тикета: New → Assigned → In Progress → Resolved → Closed', async ({
    authenticatedPage,
    testTicket,
  }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await ticketPage.navigate();
    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    // New → Assigned
    await ticketPage.changeStatus('Assigned');
    expect(await ticketPage.getStatus()).toBe('Assigned');

    // Assigned → In Progress
    await ticketPage.changeStatus('In Progress');
    expect(await ticketPage.getStatus()).toBe('In Progress');

    // In Progress → Resolved
    await ticketPage.changeStatus('Resolved');
    expect(await ticketPage.getStatus()).toBe('Resolved');

    // Resolved → Closed
    await ticketPage.changeStatus('Closed');
    expect(await ticketPage.getStatus()).toBe('Closed');
  });

  test('нельзя закрыть тикет без резолюции', async ({ authenticatedPage, testTicket }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    // Пытаемся перескочить статусы
    await ticketPage.changeStatus('Closed');

    // Ожидаем что статус НЕ изменился
    expect(await ticketPage.getStatus()).toBe('New');
  });
});
```

**Зачем:** Тест читает даже менеджер. "Полный жизненный цикл тикета" — это бизнес-сценарий, не технический мусор.

---

### 9. API-тесты с контрактной валидацией

```typescript
// tests/api/tickets.api.spec.ts
import { test, expect } from '../../src/fixtures';
import { ticketSchema } from '../../src/api/schemas/ticket.schema';

test.describe('Tickets API', () => {
  test('создание тикета возвращает валидную структуру', async ({ ticketsApi }) => {
    const ticket = await ticketsApi.create({
      title: 'API test ticket',
      description: 'Created via API test',
      priority: 'Medium',
      category: 'Software',
    });

    // Zod уже валидировал внутри client — но тут проверяем бизнес-логику
    expect(ticket.status).toBe('New');
    expect(ticket.priority).toBe('Medium');
    expect(ticket.assignee).toBeNull();

    // Cleanup
    await ticketsApi.delete(ticket.id);
  });

  test('смена статуса через API отражается корректно', async ({ ticketsApi, testTicket }) => {
    const updated = await ticketsApi.changeStatus(testTicket.id, 'Assigned');

    expect(updated.status).toBe('Assigned');
    expect(updated.id).toBe(testTicket.id);
  });

  test('API не позволяет невалидный переход статуса', async ({ ticketsApi, testTicket }) => {
    // New → Closed — невалидный переход
    try {
      await ticketsApi.changeStatus(testTicket.id, 'Closed');
      // Если дошли сюда — баг
      expect(true).toBe(false);
    } catch (error) {
      // Ожидаем ошибку валидации
      expect(error).toBeDefined();
    }
  });
});
```

---

### 10. Playwright Config — шардирование и параллельность

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,

  // Шардирование — разбиваем тесты на части для параллельного запуска в CI
  // Запуск: npx playwright test --shard=1/4
  // В CI: 4 контейнера, каждый берёт свой шард

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    // Кастомный Slack reporter — отправляет результат в канал
    ['./src/reporters/slack.reporter.ts'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure', // Трейс только при падении — экономим место
    screenshot: 'only-on-failure', // Скриншот только при падении
    video: 'retain-on-failure', // Видео только при падении
    actionTimeout: 10_000,
  },

  projects: [
    // Smoke — быстрый, на каждый PR
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Critical — основные flows
    {
      name: 'critical',
      testMatch: /tests\/critical\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Full regression — все браузеры, ночью
    {
      name: 'regression-chrome',
      testMatch: /tests\/regression\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression-firefox',
      testMatch: /tests\/regression\/.*/,
      use: { ...devices['Desktop Firefox'] },
    },

    // API тесты — без браузера, максимально быстро
    {
      name: 'api',
      testMatch: /tests\/api\/.*/,
      use: { baseURL: process.env.API_URL },
    },
  ],
});
```

---

### 11. Docker — изолированный запуск

```dockerfile
# docker/Dockerfile
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Запуск с указанием шарда
CMD ["npx", "playwright", "test", "--project=critical"]
```

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  tests-shard-1:
    build: .
    command: npx playwright test --shard=1/4 --project=regression-chrome
    environment:
      - BASE_URL=${BASE_URL}
      - API_URL=${API_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./results/shard-1:/app/test-results

  tests-shard-2:
    build: .
    command: npx playwright test --shard=2/4 --project=regression-chrome
    environment:
      - BASE_URL=${BASE_URL}
      - API_URL=${API_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./results/shard-2:/app/test-results

  tests-shard-3:
    build: .
    command: npx playwright test --shard=3/4 --project=regression-chrome
    environment:
      - BASE_URL=${BASE_URL}
      - API_URL=${API_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./results/shard-3:/app/test-results

  tests-shard-4:
    build: .
    command: npx playwright test --shard=4/4 --project=regression-chrome
    environment:
      - BASE_URL=${BASE_URL}
      - API_URL=${API_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - ./results/shard-4:/app/test-results
```

**Зачем:** 4 контейнера, каждый прогоняет свою четверть тестов. Регрессия которая шла 40 минут — идёт 10.

---

### 12. GitHub Actions — CI/CD

```yaml
# .github/workflows/smoke.yml
name: Smoke Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  smoke:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.44.0-jammy

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test --project=smoke
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          API_URL: ${{ secrets.API_URL }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: smoke-results
          path: test-results/
```

```yaml
# .github/workflows/nightly.yml
name: Nightly Regression

on:
  schedule:
    - cron: '0 2 * * *' # Каждую ночь в 2:00

jobs:
  regression:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    container:
      image: mcr.microsoft.com/playwright:v1.44.0-jammy

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test --project=regression-chrome --shard=${{ matrix.shard }}/4
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          API_URL: ${{ secrets.API_URL }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: regression-shard-${{ matrix.shard }}
          path: test-results/
```

---

### 13. Slack Reporter — уведомления

```typescript
// src/reporters/slack.reporter.ts
import type { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';

class SlackReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private failures: string[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case 'passed':
        this.passed++;
        break;
      case 'failed':
        this.failed++;
        this.failures.push(`❌ ${test.title}`);
        break;
      case 'skipped':
        this.skipped++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const webhook = process.env.SLACK_WEBHOOK;
    if (!webhook) return;

    const emoji = this.failed === 0 ? '✅' : '🔴';
    const status = this.failed === 0 ? 'PASSED' : 'FAILED';

    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} Test Run ${status}`,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Passed:* ${this.passed}` },
            { type: 'mrkdwn', text: `*Failed:* ${this.failed}` },
            { type: 'mrkdwn', text: `*Skipped:* ${this.skipped}` },
            { type: 'mrkdwn', text: `*Duration:* ${Math.round(result.duration / 1000)}s` },
          ],
        },
      ],
    };

    if (this.failures.length > 0) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Failures:*\n${this.failures.slice(0, 10).join('\n')}`,
        },
      } as any);
    }

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }
}

export default SlackReporter;
```

---

### 14. Retry и стабильность

```typescript
// src/helpers/retry.ts
export async function retryAction<T>(
  action: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    description?: string;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, description = 'action' } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`${description} failed after ${maxRetries} attempts: ${error}`);
      }
      console.log(
        `${description} — attempt ${attempt}/${maxRetries} failed, retrying in ${delayMs}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Unreachable');
}

// Использование:
// const ticket = await retryAction(
//   () => ticketsApi.getById(id),
//   { description: 'Get ticket', maxRetries: 3 }
// );
```

---

## Продвинутые темы

### Async/Await в контексте Playwright

Playwright работает через WebSocket-соединение с браузером. Каждая команда — это асинхронный запрос. Важно:

- `await` обязателен на каждом действии — иначе команда не дождётся выполнения
- `Promise.all()` для параллельных ожиданий — например клик + ожидание API-ответа
- `waitForResponse` / `waitForNavigation` — привязываем действие к результату, не к таймауту
- Никогда не используем `page.waitForTimeout()` — это хардкод ожидания, источник flaky

### Race Conditions в тестах

ITSM-продукт — это state machine. Два тестировщика одновременно меняют статус тикета — классическая гонка. Как тестируем:

```typescript
test('параллельная смена статуса — один должен получить ошибку', async ({
  ticketsApi,
  testTicket,
}) => {
  // Запускаем два запроса одновременно
  const results = await Promise.allSettled([
    ticketsApi.changeStatus(testTicket.id, 'Assigned'),
    ticketsApi.changeStatus(testTicket.id, 'In Progress'),
  ]);

  // Один должен пройти, другой — вернуть ошибку конфликта
  const fulfilled = results.filter((r) => r.status === 'fulfilled');
  const rejected = results.filter((r) => r.status === 'rejected');

  expect(fulfilled.length).toBe(1);
  expect(rejected.length).toBe(1);
});
```

### Test Data Management

Главные правила:

- Каждый тест создаёт свои данные через API перед запуском
- Каждый тест удаляет свои данные после завершения (fixture teardown)
- Уникальные имена через timestamp — никаких конфликтов при параллельном запуске
- Никогда не зависим от данных другого теста
- Никогда не используем shared test data

---

## AI-инструменты

### Claude Code / Copilot в workflow

- Генерация Page Object по HTML-структуре страницы
- Генерация Zod-схемы по примеру API-ответа
- Генерация тестовых кейсов по acceptance criteria
- Code review через AI — проверка паттернов, антипаттернов

### MCP — Context7

Подключаем Context7 для доступа к актуальной документации Playwright прямо в IDE:

```bash
# В Claude Code / MCP-клиенте
# Context7 даёт актуальную документацию без галлюцинаций
```

### Потенциально — свой MCP-сервер для тестов

```
toad-tunnel-mcp → подключение к тестовой инфраструктуре
                → запуск тестов из чата
                → получение результатов
                → анализ flaky через AI
```

---

## Что отличает этот фреймворк от типового

| Типовой фреймворк       | Этот фреймворк                                      |
| ----------------------- | --------------------------------------------------- |
| Page Object и всё       | Page Object + Component Object + Builder + Fixtures |
| .env файл с надеждой    | Zod-валидация конфига при старте                    |
| JSON для API            | Zod-схемы для контрактного тестирования             |
| Один suite на всё       | Многоуровневый: smoke → critical → regression       |
| Запуск локально         | Docker + шардирование + CI матрица                  |
| console.log             | Allure + Slack reporter                             |
| Тестовые данные в базе  | Builder + API fixtures + автоматический teardown    |
| Надежда на стабильность | Retry logic + trace/screenshot/video при падении    |
| Ручной анализ падений   | AI-assisted анализ + мониторинг flakiness           |

---

_Этот blueprint — скелет. Под конкретный продукт (Alloy Navigator) адаптируем после discovery 🐸_
