import { z } from 'zod';

export const employeeSchema = z.object({
  empNumber: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  employeeId: z.string().nullable(),
  terminationDate: z.string().nullish(),
});

export const employeeResponseSchema = z.object({
  data: employeeSchema,
});

export type EmployeeResponse = z.infer<typeof employeeSchema>;
