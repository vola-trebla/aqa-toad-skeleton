import { apiTest } from './api.fixtures';
import { ExamplePage } from '@/pages/example.page';

export type PageFixtures = {
  examplePage: ExamplePage;
};

/**
 * 🐸 UI TEST FIXTURE
 *
 * Full UI test fixture that composes API and Page fixtures.
 * Use this in your spec files to get access to all Page Objects.
 */
export const test = apiTest.extend<PageFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },
});
