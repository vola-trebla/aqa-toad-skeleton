import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe('Employee PIM - Regression', { tag: [TestTags.regression, TestTags.pim] }, () => {
  test('полный цикл редактирования сотрудника отражается в UI', async ({
    testEmployee,
    employeeDetailPage,
  }) => {
    await employeeDetailPage.openEmployee(testEmployee.empNumber);
    await employeeDetailPage.assertName(testEmployee.firstName, testEmployee.lastName);

    await employeeDetailPage.updateName(testEmployee.empNumber, 'Regression', 'Updated');
    await employeeDetailPage.assertName('Regression', 'Updated');

    // Повторная навигация - убеждаемся что сохранилось
    await employeeDetailPage.openEmployee(testEmployee.empNumber);
    await employeeDetailPage.assertName('Regression', 'Updated');
  });

  test('удалённый сотрудник не появляется в поиске', async ({
    testEmployee,
    pimListPage,
    employeeApi,
  }) => {
    await employeeApi.deleteMultiple([testEmployee.empNumber]);
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId);
    await pimListPage.assertEmployeeAbsent(testEmployee.employeeId);
  });
});
