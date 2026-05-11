import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe(
  'OrangeHRM - Employee Management (PIM)',
  { tag: [TestTags.smoke, TestTags.pim] },
  () => {
    test('поиск сотрудника по ID находит конкретного сотрудника', async ({
      testEmployee,
      pimListPage,
    }) => {
      await pimListPage.navigate();
      await pimListPage.searchEmployeeById(testEmployee.employeeId);
      await pimListPage.assertEmployeeVisible(testEmployee);
    });
  }
);
