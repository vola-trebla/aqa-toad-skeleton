import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe(
  'OrangeHRM - Employee Management (PIM)',
  { tag: [TestTags.smoke, TestTags.pim] },
  () => {
    test('поиск сотрудника по ID находит конкретного сотрудника', async ({ pimListPage }) => {
      const seedEmployeeId = '0001';
      await pimListPage.navigate();
      await pimListPage.searchEmployeeById(seedEmployeeId);
      await pimListPage.assertEmployeeVisibleById(seedEmployeeId);
    });
  }
);
