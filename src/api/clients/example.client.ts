import { expect } from '@playwright/test';
import { Item, CreateItemRequest, itemResponseSchema } from '@/api/schemas/example.schema';
import { step } from '@/core/step';
import { BaseApiClient } from './base.client';

/**
 * 🐸 EXAMPLE API CLIENT
 *
 * This class encapsulates all API calls for a specific domain (e.g., Items, Users, Orders).
 * It inherits from BaseApiClient to leverage shared parsing and error handling.
 */
export class ExampleApiClient extends BaseApiClient {
  /**
   * Expectations specific to this domain.
   */
  readonly expect = new ExampleExpectations();

  /**
   * Example POST request.
   */
  async createItem(request: CreateItemRequest): Promise<Item> {
    const response = await this.request.post('/api/items', { data: request });
    // parseResponse validates the JSON against your Zod schema and returns typed data
    const envelope = await this.parseResponse(response, itemResponseSchema);
    return envelope.data;
  }

  /**
   * Example GET request.
   */
  async getItem(id: number): Promise<Item> {
    const response = await this.request.get(`/api/items/${id}`);
    const envelope = await this.parseResponse(response, itemResponseSchema);
    return envelope.data;
  }
}

/**
 * 🐸 DOMAIN EXPECTATIONS
 *
 * Keep your business-logic assertions here to keep tests clean.
 */
export class ExampleExpectations {
  async toHaveCorrectName(item: Item, expectedName: string): Promise<void> {
    await step('Verify item name', async () => {
      expect(item.name, 'Item name should match').toBe(expectedName);
    });
  }
}
