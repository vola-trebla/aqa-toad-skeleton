import { authTest } from './auth.fixtures';
import { EmployeeApiClient } from '@/api/clients/employee.client';
import { EmployeeBuilder } from '@/helpers/builders/employee.builder';
import { ApiError } from '@/api/api-error';
import type { CreatedEmployee } from '@/api/schemas/employee.schema';

export type CreateEmployeeFn = (builder?: EmployeeBuilder) => Promise<CreatedEmployee>;

export type ApiFixtures = {
  employeeApi: EmployeeApiClient;
  createEmployee: CreateEmployeeFn;
  testEmployee: CreatedEmployee;
};

/**
 * API test - extends auth fixtures with API clients and test data.
 * Uses Playwright's built-in `request` fixture (no browser page needed for actual test work).
 */
export const apiTest = authTest.extend<ApiFixtures>({
  employeeApi: async ({ request }, use) => use(new EmployeeApiClient(request)),

  /**
   * Factory for creating employees. Tracks every created entity and best-effort
   * deletes them after the test. Tests that delete entities themselves can do so
   * freely - cleanup ignores per-id failures.
   */
  createEmployee: async ({ employeeApi }, use) => {
    const created: number[] = [];
    const factory: CreateEmployeeFn = async (builder = new EmployeeBuilder()) => {
      const employee = await employeeApi.create(builder.build());
      created.push(employee.empNumber);
      return employee;
    };

    await use(factory);

    if (created.length === 0) return;
    try {
      await employeeApi.deleteMultiple(created);
    } catch (err) {
      // 404 means the test under verification already deleted these entities - expected.
      if (err instanceof ApiError && err.status === 404) return;
      console.warn(
        `[createEmployee cleanup] best-effort delete of [${created.join(',')}] failed:`,
        err instanceof Error ? err.message : err
      );
    }
  },

  /**
   * Convenience: single default employee. Use `createEmployee` directly when you
   * need multiple entities or a custom builder.
   */
  testEmployee: async ({ createEmployee }, use) => {
    const employee = await createEmployee();
    await use(employee);
  },
});
