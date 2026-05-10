import { test, expect } from '@/fixtures';

test.describe('Employee Lifecycle', () => {
  test('созданный через API сотрудник отображается в PIM списке', async ({
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.table.shouldNotBeEmpty();
  });

  test('можно отредактировать имя сотрудника через UI', async ({
    testEmployee,
    employeeDetailPage,
  }) => {
    await employeeDetailPage.navigateToEmployee(testEmployee.empNumber);

    await employeeDetailPage.updateName('Updated', 'Name');

    await employeeDetailPage.firstNameInput.shouldHaveValue('Updated');
    await employeeDetailPage.lastNameInput.shouldHaveValue('Name');
  });

  test('можно удалить сотрудника через UI с подтверждением', async ({
    page,
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.table.shouldNotBeEmpty();

    await pimListPage.deleteFirstResult();

    await expect(page.locator('.oxd-table-card')).toHaveCount(0);
  });
});
