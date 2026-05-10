import { test } from '@playwright/test';

/**
 * Обертка над test.step для уменьшения визуального шума.
 */
export async function step<T>(name: string, action: () => Promise<T>): Promise<T> {
  return await test.step(name, action);
}
