const BASE = '/web/index.php/api/v2';

export const ApiEndpoints = {
  auth: {
    generate: `${BASE}/auth/generate`,
  },
  pim: {
    employees: `${BASE}/pim/employees`,
    employee: (empNumber: number) => `${BASE}/pim/employees/${empNumber}`,
    personalDetails: (empNumber: number) => `${BASE}/pim/employees/${empNumber}/personal-details`,
  },
} as const;
