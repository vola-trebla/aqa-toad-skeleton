import { test, expect } from '@/fixtures';

test.describe('Employee API', () => {
  test('создание сотрудника возвращает валидную структуру', async ({ testEmployee }) => {
    expect(testEmployee.empNumber).toBeGreaterThan(0);
    expect(testEmployee.firstName).toBe('Test');
    expect(testEmployee.lastName).toMatch(/^Employee-\d+$/);
    expect(testEmployee.employeeId).toMatch(/^E\d{5}$/);
  });

  test('обновление имени через API отражается в GET запросе', async ({
    testEmployee,
    employeeApi,
  }) => {
    await employeeApi.updateName(testEmployee.empNumber, 'ApiUpdated', 'ApiName');

    const updated = await employeeApi.getById(testEmployee.empNumber);
    expect(updated.firstName).toBe('ApiUpdated');
    expect(updated.lastName).toBe('ApiName');
  });
});
