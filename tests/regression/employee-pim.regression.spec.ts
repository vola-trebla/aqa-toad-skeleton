import { test, expect } from '@/fixtures';

test.describe('Employee PIM - Regression', () => {
  test('полный цикл редактирования сотрудника отражается в UI', async ({
    testEmployee,
    employeeDetailPage,
  }) => {
    await employeeDetailPage.navigateToEmployee(testEmployee.empNumber);

    await employeeDetailPage.firstNameInput.shouldHaveValue(testEmployee.firstName);
    await employeeDetailPage.lastNameInput.shouldHaveValue(testEmployee.lastName);

    await employeeDetailPage.updateName('Regression', 'Updated');

    await employeeDetailPage.firstNameInput.shouldHaveValue('Regression');
    await employeeDetailPage.lastNameInput.shouldHaveValue('Updated');

    // Повторная навигация - убеждаемся что сохранилось
    await employeeDetailPage.navigateToEmployee(testEmployee.empNumber);
    await employeeDetailPage.firstNameInput.shouldHaveValue('Regression');
    await employeeDetailPage.lastNameInput.shouldHaveValue('Updated');
  });

  test('удалённый сотрудник не появляется в поиске', async ({
    page,
    testEmployee,
    pimListPage,
    employeeApi,
  }) => {
    await employeeApi.deleteMultiple([testEmployee.empNumber]);

    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);

    await expect(page.locator('.oxd-table-card')).toHaveCount(0);
  });
});
