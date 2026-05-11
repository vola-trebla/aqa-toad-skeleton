import { randomUUID } from 'crypto';
import { CreateEmployeeRequest, createEmployeeRequestSchema } from '@/api/schemas/employee.schema';
import { BaseBuilder } from './base.builder';

export class EmployeeBuilder extends BaseBuilder<CreateEmployeeRequest> {
  protected readonly schema = createEmployeeRequestSchema;

  protected get defaults(): CreateEmployeeRequest {
    return {
      firstName: 'Test',
      middleName: '',
      lastName: `Employee-${randomUUID().slice(0, 8)}`,
      employeeId: `E${randomUUID().replace(/-/g, '').slice(0, 5)}`,
    };
  }

  // --- Static presets ---

  static aManager(): EmployeeBuilder {
    return new EmployeeBuilder({ firstName: 'Manager' });
  }

  static withName(firstName: string, lastName: string): EmployeeBuilder {
    return new EmployeeBuilder({ firstName, lastName });
  }
}
