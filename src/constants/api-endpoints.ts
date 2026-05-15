/**
 * 🐸 API ENDPOINTS
 *
 * Keep all your API paths here.
 * Use functions for endpoints with parameters (e.g., /items/${id}).
 */
export const ApiEndpoints = {
  example: {
    items: '/api/items',
    item: (id: number) => `/api/items/${id}`,
  },
} as const;
