import { Page, Response } from '@playwright/test';

/**
 * Returns a Promise that resolves to the first successful response whose URL
 * contains `endpoint`. Start the promise BEFORE the action that triggers the
 * request so Playwright can intercept it even if the response arrives fast.
 *
 * @example
 * const done = waitForApi(page, '/api/items');
 * await searchBtn.click();
 * await done;
 */
export function waitForApi(page: Page, endpoint: string): Promise<Response> {
  return page.waitForResponse((r) => r.url().includes(endpoint) && (r.ok() || r.status() === 304));
}
