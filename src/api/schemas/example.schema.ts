import { z } from 'zod';

/**
 * Zod schemas for domain entities and API contracts.
 * Provides compile-time types and runtime validation of API responses.
 */

// --- Domain Entity ---

export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
});
export type Item = z.infer<typeof itemSchema>;

// --- API Contracts ---

/**
 * Request payload for creating a new item.
 */
export const createItemRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});
export type CreateItemRequest = z.infer<typeof createItemRequestSchema>;

/**
 * Response envelope if your API wraps data (e.g., { data: { ... } }).
 * If your API returns raw objects, you can use itemSchema directly.
 */
export const itemResponseSchema = z.object({
  data: itemSchema,
});
export type ItemResponse = z.infer<typeof itemResponseSchema>;
