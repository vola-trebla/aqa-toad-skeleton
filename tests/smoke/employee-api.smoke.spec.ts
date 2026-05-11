import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe(
  'Employee API fixture - smoke',
  { tag: [TestTags.smoke, TestTags.api, TestTags.pim] },
  () => {
    test('создаёт сотрудника через API и находит его в списке', async ({
      testEmployee,
      pimListPage,
    }) => {
      await pimListPage.navigate();
      await pimListPage.searchEmployeeById(testEmployee.employeeId);
      await pimListPage.assertEmployeeVisible(testEmployee);
    });
  }
);
