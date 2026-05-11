export const Routes = {
  auth: {
    login: '/web/index.php/auth/login',
    validate: '/web/index.php/auth/validate',
  },
  dashboard: {
    index: '/web/index.php/dashboard/index',
  },
  pim: {
    list: '/web/index.php/pim/viewEmployeeList',
    personalDetails: (empNumber: number) =>
      `/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
  },
} as const;
