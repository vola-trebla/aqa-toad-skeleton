/**
 * 🐸 TEST TAGS
 *
 * Use tags to group tests into suites.
 * Filter them via command line: `npx playwright test --grep @smoke`
 */
export const TestTags = {
  smoke: '@smoke',
  critical: '@critical',
  regression: '@regression',
  api: '@api',
  auth: '@auth',
  crud: '@crud',
  visual: '@visual',
  flaky: '@flaky',
} as const;
