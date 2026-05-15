import { randomUUID } from 'crypto';
import { CreateItemRequest, createItemRequestSchema } from '@/api/schemas/example.schema';
import { BaseBuilder } from './base.builder';

/**
 * 🐸 EXAMPLE BUILDER
 *
 * Builders help you create complex data objects with sensible defaults.
 * They are especially useful for API payloads.
 */
export class ItemBuilder extends BaseBuilder<CreateItemRequest> {
  protected readonly schema = createItemRequestSchema;

  /**
   * Default values for a new Item.
   * Using a getter ensures random values are unique for every build() call.
   */
  protected get defaults(): CreateItemRequest {
    return {
      name: `Item-${randomUUID().slice(0, 8)}`,
      description: 'Built with the Toad Builder 🐸',
    };
  }

  // --- Static presets ---

  static aSpecialItem(): ItemBuilder {
    return new ItemBuilder({ name: 'Special Item' });
  }

  static withName(name: string): ItemBuilder {
    return new ItemBuilder({ name });
  }
}
