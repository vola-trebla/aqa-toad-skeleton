import { test, expect } from '../../src/fixtures';

test.describe('OrangeHRM - Employee Management (PIM)', () => {
  test.beforeEach(async ({ authenticatedPage: _ }) => {
    // Already logged in via fixture
  });

  test('должен искать сотрудника по ID', async ({ pimListPage }) => {
    await pimListPage.navigate();

    // В демо-данных обычно есть ID 0001
    await pimListPage.searchEmployeeById('0001');

    const rowCount = await pimListPage.table.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
