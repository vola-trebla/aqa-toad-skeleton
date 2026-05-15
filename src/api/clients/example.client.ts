import { expect } from '@playwright/test';
import { Item, CreateItemRequest, itemResponseSchema } from '@/api/schemas/example.schema';
import { step } from '@/core/step';
import { BaseApiClient } from './base.client';

/**
 * Example API client for a single domain (Items, Users, Orders, etc.).
 * Extends BaseApiClient for shared response parsing and error handling.
 */
export class ExampleApiClient extends BaseApiClient {
  readonly expect = new ExampleExpectations();

  async createItem(request: CreateItemRequest): Promise<Item> {
    const response = await this.request.post('/api/items', { data: request });
    // parseResponse validates JSON against the Zod schema and throws ApiError on non-2xx
    const envelope = await this.parseResponse(response, itemResponseSchema);
    return envelope.data;
  }

  async getItem(id: number): Promise<Item> {
    const response = await this.request.get(`/api/items/${id}`);
    const envelope = await this.parseResponse(response, itemResponseSchema);
    return envelope.data;
  }
}

/**
 * Domain-specific assertions for this client.
 * Keeps business-logic checks out of test specs and makes them reusable.
 */
export class ExampleExpectations {
  async toHaveCorrectName(item: Item, expectedName: string): Promise<void> {
    await step('Verify item name', async () => {
      expect(item.name, 'Item name should match').toBe(expectedName);
    });
  }
}
