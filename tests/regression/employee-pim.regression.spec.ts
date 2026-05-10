import { test } from '@/fixtures';

test.describe('Employee PIM - Regression', () => {
  test('полный цикл редактирования сотрудника отражается в UI', async ({
    authenticatedPage: _,
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
    authenticatedPage,
    testEmployee,
    pimListPage,
    employeeApi,
  }) => {
    // Удаляем через API
    await employeeApi.delete(testEmployee.empNumber);

    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);

    await authenticatedPage.locator('.oxd-table-card').waitFor({ state: 'hidden' });
    await pimListPage.table.shouldHaveCount(0);
  });
});
