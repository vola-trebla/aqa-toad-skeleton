import { APIRequestContext } from '@playwright/test';
import { ExampleApiClient } from './clients/example.client';

/**
 * 🐸 API REGISTRY
 *
 * Central registry of all API clients.
 * Extend this interface and factory when adding new domain clients.
 * This pattern allows fixtures to access all clients via a single object.
 */
export interface ApiRegistry {
  example: ExampleApiClient;
}

export function createApiRegistry(request: APIRequestContext): ApiRegistry {
  return {
    example: new ExampleApiClient(request),
  };
}
