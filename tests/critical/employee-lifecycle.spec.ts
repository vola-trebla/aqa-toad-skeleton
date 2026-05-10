import { test, expect } from '../../src/fixtures';

test.describe('Employee Lifecycle', () => {
  test('созданный через API сотрудник отображается в PIM списке', async ({
    authenticatedPage: _,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId);
    await pimListPage.table.shouldNotBeEmpty();
  });

  test('можно отредактировать имя сотрудника через UI', async ({
    authenticatedPage: _,
    testEmployee,
    employeeDetailPage,
    employeeApi,
  }) => {
    await employeeDetailPage.navigateToEmployee(testEmployee.empNumber);

    await employeeDetailPage.updateName('Updated', 'Name');

    await expect
      .poll(async () => {
        const updated = await employeeApi.getById(testEmployee.empNumber);
        return updated.firstName;
      })
      .toBe('Updated');
  });

  test('можно удалить сотрудника через UI с подтверждением', async ({
    authenticatedPage,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId);
    await pimListPage.table.shouldNotBeEmpty();

    await pimListPage.deleteFirstResult();

    // После удаления таблица пуста - сотрудник исчез
    await expect(authenticatedPage.locator('.oxd-table-card')).toHaveCount(0);
  });
});
