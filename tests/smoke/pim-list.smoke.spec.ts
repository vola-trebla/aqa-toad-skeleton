import { test } from '@/fixtures';

test.describe('OrangeHRM - Employee Management (PIM)', () => {
  test('должен искать сотрудника по ID', async ({ authenticatedPage: _, pimListPage }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById('0001');
    await pimListPage.table.shouldNotBeEmpty();
  });
});
