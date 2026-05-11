import { z } from 'zod';

// --- Domain entity ---

export const employeeSchema = z.object({
  empNumber: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  employeeId: z.string().nullable(),
  terminationDate: z.string().nullish(),
});
export type Employee = z.infer<typeof employeeSchema>;

// Employee returned by create/update flows - employeeId always present
export const createdEmployeeSchema = employeeSchema.extend({
  employeeId: z.string(),
});
export type CreatedEmployee = z.infer<typeof createdEmployeeSchema>;

// --- Response envelopes ---

export const employeeResponseEnvelopeSchema = z.object({
  data: employeeSchema,
});
export type EmployeeResponseEnvelope = z.infer<typeof employeeResponseEnvelopeSchema>;

export const createdEmployeeEnvelopeSchema = z.object({
  data: createdEmployeeSchema,
});

// --- Request payloads ---

export const createEmployeeRequestSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string(),
  lastName: z.string().min(1),
  employeeId: z.string().min(1),
});
export type CreateEmployeeRequest = z.infer<typeof createEmployeeRequestSchema>;

export const updateEmployeeNameRequestSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string(),
  lastName: z.string().min(1),
});
export type UpdateEmployeeNameRequest = z.infer<typeof updateEmployeeNameRequestSchema>;
