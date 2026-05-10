import { test } from '@/fixtures';

test.describe('Employee Lifecycle', () => {
  test('созданный через API сотрудник отображается в PIM списке', async ({
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.assertEmployeeVisible(testEmployee);
  });

  test('можно отредактировать имя сотрудника через UI', async ({
    testEmployee,
    employeeDetailPage,
  }) => {
    await employeeDetailPage.openEmployee(testEmployee.empNumber);
    await employeeDetailPage.updateName(testEmployee.empNumber, 'Updated', 'Name');
    await employeeDetailPage.assertName('Updated', 'Name');
  });

  test('можно удалить сотрудника через UI с подтверждением', async ({
    testEmployee,
    pimListPage,
  }) => {
    await pimListPage.navigate();
    await pimListPage.searchEmployeeById(testEmployee.employeeId!);
    await pimListPage.assertEmployeeVisible(testEmployee);
    await pimListPage.deleteFirstResult();
    await pimListPage.assertEmployeeAbsent(testEmployee.employeeId!);
  });
});
