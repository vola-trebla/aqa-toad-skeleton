import { test, expect } from '../../src/fixtures';

test.describe('Employee Lifecycle', () => {
  test('созданный через API сотрудник отображается в PIM списке', async ({
    authenticatedPage: _,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.table.shouldNotBeEmpty();
  });

  test('можно отредактировать имя сотрудника через UI', async ({
    authenticatedPage: _,
    testEmployee,
    employeeDetailPage,
  }) => {
    await employeeDetailPage.navigateToEmployee(testEmployee.empNumber);

    await employeeDetailPage.updateName('Updated', 'Name');

    await employeeDetailPage.firstNameInput.shouldHaveValue('Updated');
    await employeeDetailPage.lastNameInput.shouldHaveValue('Name');
  });

  test('можно удалить сотрудника через UI с подтверждением', async ({
    authenticatedPage,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.table.shouldNotBeEmpty();

    await pimListPage.deleteFirstResult();

    // После удаления таблица пуста - сотрудник исчез
    await expect(authenticatedPage.locator('.oxd-table-card')).toHaveCount(0);
  });
});
