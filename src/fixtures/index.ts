import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PIMListPage } from '../pages/pim-list.page';
import { EmployeeDetailPage } from '../pages/employee-detail.page';
import { config } from '../config/env.config';
import { EmployeeApiClient } from '../api/clients/employee.client';
import { EmployeeBuilder } from '../helpers/builders/employee.builder';
import type { EmployeeResponse } from '../api/schemas/employee.schema';
import { Routes } from '../constants/routes';
import * as fs from 'fs';
import * as path from 'path';

// test-scope: что живёт только пока идёт один тест
type UserFixtures = {
  loginPage: LoginPage;
  pimListPage: PIMListPage;
  employeeDetailPage: EmployeeDetailPage;
  authenticatedPage: Page;
  employeeApi: EmployeeApiClient;
  testEmployee: EmployeeResponse;
};

// worker-scope: что создаётся один раз на весь worker
type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<UserFixtures, WorkerFixtures>({
  // --- WORKER SCOPE ---
  // Логинится ОДИН РАЗ на worker, сохраняет cookies в файл
  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const storageStatePath = path.join('.auth', `worker-${workerInfo.workerIndex}.json`);

      // Отдельный контекст только для логина - не мешает тестам
      const context = await browser.newContext();
      const page = await context.newPage();

      console.log(`\n[Worker ${workerInfo.workerIndex}] Выполняю логин...`);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(config.ADMIN_EMAIL, config.ADMIN_PASSWORD);

      // Сохраняем cookies/localStorage в файл
      await context.storageState({ path: storageStatePath });
      await context.close();
      console.log(`[Worker ${workerInfo.workerIndex}] Логин сохранён: ${storageStatePath}\n`);

      await use(storageStatePath);
      // teardown: файл не удаляем - перезапишется при следующем запуске
    },
    { scope: 'worker' },
  ],

  // --- TEST SCOPE ---
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  pimListPage: async ({ page }, use) => {
    await use(new PIMListPage(page));
  },

  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },

  // Берёт cookies из файла и добавляет в контекст - без UI логина
  authenticatedPage: async ({ page, workerStorageState }, use) => {
    const { cookies } = JSON.parse(fs.readFileSync(workerStorageState, 'utf-8'));
    await page.context().addCookies(cookies);
    await page.goto(`${config.BASE_URL}${Routes.dashboard.index}`);
    await use(page);
  },

  // API клиент - берёт request из authenticatedPage, cookies уже есть
  employeeApi: async ({ authenticatedPage }, use) => {
    await use(new EmployeeApiClient(authenticatedPage.request));
  },

  // Создаёт сотрудника через API до теста, удаляет после - даже если тест упал
  testEmployee: async ({ employeeApi }, use) => {
    const employee = new EmployeeBuilder().build();
    const created = await employeeApi.create(employee);

    await use(created);

    // Graceful teardown - тест мог уже удалить сотрудника через UI
    try {
      await employeeApi.delete(created.empNumber);
    } catch {
      // 404 - уже удалён, всё хорошо
    }
  },
});

export { expect };
