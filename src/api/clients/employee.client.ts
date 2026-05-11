import {
  Employee,
  CreatedEmployee,
  CreateEmployeeRequest,
  UpdateEmployeeNameRequest,
  employeeResponseEnvelopeSchema,
  createdEmployeeEnvelopeSchema,
} from '@/api/schemas/employee.schema';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { BaseApiClient } from './base.client';

export class EmployeeApiClient extends BaseApiClient {
  async create(request: CreateEmployeeRequest): Promise<CreatedEmployee> {
    const response = await this.request.post(ApiEndpoints.pim.employees, { data: request });
    return this.parseResponse(response, createdEmployeeEnvelopeSchema);
  }

  async deleteMultiple(empNumbers: number[]): Promise<void> {
    const response = await this.request.delete(ApiEndpoints.pim.employees, {
      data: { ids: empNumbers },
    });
    if (!response.ok()) {
      const body = await response.text().catch(() => '<no body>');
      throw new Error(
        `Failed to delete employees [${empNumbers.join(',')}]: HTTP ${response.status()} - ${body}`
      );
    }
  }

  async updateName(empNumber: number, firstName: string, lastName: string): Promise<Employee> {
    const request: UpdateEmployeeNameRequest = { firstName, lastName, middleName: '' };
    const response = await this.request.put(ApiEndpoints.pim.personalDetails(empNumber), {
      data: request,
    });
    return this.parseResponse(response, employeeResponseEnvelopeSchema);
  }

  async getById(empNumber: number): Promise<Employee> {
    const response = await this.request.get(ApiEndpoints.pim.employee(empNumber));
    return this.parseResponse(response, employeeResponseEnvelopeSchema);
  }
}
