import { apiTest } from './api.fixtures';
import { ExamplePage } from '@/pages/example.page';
import { ExampleDetailPage } from '@/pages/example-detail.page';

export type PageFixtures = {
  examplePage: ExamplePage;
  /**
   * Factory for dynamic pages whose URL includes a runtime parameter.
   * Call it inside the test body once you have the ID from your API setup.
   *
   * @example
   *   const item = await api.example.createItem({ name: 'My Item' });
   *   const detailPage = getItemDetail(item.id);
   *   await detailPage.navigate();
   */
  getItemDetail: (id: number) => ExampleDetailPage;
};

export const test = apiTest.extend<PageFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },

  getItemDetail: async ({ page }, use) => {
    await use((id: number) => new ExampleDetailPage(page, id));
  },
});
