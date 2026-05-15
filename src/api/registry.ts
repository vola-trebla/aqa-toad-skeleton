import { APIRequestContext } from '@playwright/test';
import { ExampleApiClient } from './clients/example.client';

/**
 * Central registry of all typed API clients.
 * Add new domain clients here so fixtures can expose them via a single `api` object.
 */
export interface ApiRegistry {
  example: ExampleApiClient;
}

export function createApiRegistry(request: APIRequestContext): ApiRegistry {
  return {
    example: new ExampleApiClient(request),
  };
}
