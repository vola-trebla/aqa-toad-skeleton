/**
 * Test tags for grouping and filtering test suites.
 * Filter via CLI: `npx playwright test --grep @smoke`
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
