import { APIRequestContext } from '@playwright/test';
import { EmployeeApiClient } from './clients/employee.client';

/**
 * Central registry of all API clients. Extend this object when adding new
 * domain clients (job, leave, recruitment) - fixtures and tests get access
 * to the new client without touching the fixture file.
 */
export interface ApiRegistry {
  employee: EmployeeApiClient;
}

export function createApiRegistry(request: APIRequestContext): ApiRegistry {
  return {
    employee: new EmployeeApiClient(request),
  };
}
