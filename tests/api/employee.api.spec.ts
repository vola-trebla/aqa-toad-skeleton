import { apiTest as test, expect } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe('Employee API', { tag: [TestTags.api, TestTags.pim] }, () => {
  test('создание сотрудника возвращает валидную структуру', async ({ testEmployee }) => {
    expect(testEmployee.empNumber).toBeGreaterThan(0);
    expect(testEmployee.employeeId).toMatch(/^E[a-f0-9]{5}$/);
  });

  test('обновление имени через API отражается в GET запросе', async ({ testEmployee, api }) => {
    await api.employee.updateName(testEmployee.empNumber, 'ApiUpdated', 'ApiName');

    const updated = await api.employee.getById(testEmployee.empNumber);
    expect(updated.firstName).toBe('ApiUpdated');
    expect(updated.lastName).toBe('ApiName');
  });
});
