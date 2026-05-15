/**
 * Centralized API endpoint paths.
 * Use functions for parameterized endpoints (e.g., /items/${id}).
 */
export const ApiEndpoints = {
  example: {
    items: '/api/items',
    item: (id: number) => `/api/items/${id}`,
  },
} as const;
