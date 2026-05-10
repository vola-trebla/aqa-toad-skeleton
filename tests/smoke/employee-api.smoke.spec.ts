import { test } from '../../src/fixtures';

test.describe('Employee API fixture - smoke', () => {
  test('создаёт сотрудника через API и находит его в списке', async ({
    authenticatedPage: _,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId);
    await pimListPage.table.shouldNotBeEmpty();
  });
});
