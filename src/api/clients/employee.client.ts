import { APIRequestContext } from '@playwright/test';
import { Employee } from '../../helpers/builders/employee.builder';
import { employeeResponseSchema, EmployeeResponse } from '../schemas/employee.schema';
import { ApiEndpoints } from '../../constants/api-endpoints';

export class EmployeeApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async create(employee: Employee): Promise<EmployeeResponse> {
    const response = await this.request.post(ApiEndpoints.pim.employees, {
      data: {
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        employeeId: employee.employeeId,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to create employee: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    return employeeResponseSchema.parse(body).data;
  }

  async delete(empNumber: number): Promise<void> {
    const response = await this.request.delete(ApiEndpoints.pim.employees, {
      data: { ids: [empNumber] },
    });

    if (!response.ok()) {
      throw new Error(`Failed to delete employee ${empNumber}: ${response.status()}`);
    }
  }

  async updateName(
    empNumber: number,
    firstName: string,
    lastName: string
  ): Promise<EmployeeResponse> {
    const response = await this.request.put(ApiEndpoints.pim.personalDetails(empNumber), {
      data: { firstName, lastName, middleName: '' },
    });

    if (!response.ok()) {
      throw new Error(`Failed to update employee ${empNumber}: ${response.status()}`);
    }

    const body = await response.json();
    return employeeResponseSchema.parse(body).data;
  }

  async getById(empNumber: number): Promise<EmployeeResponse> {
    const response = await this.request.get(ApiEndpoints.pim.employee(empNumber));

    if (!response.ok()) {
      throw new Error(`Failed to get employee ${empNumber}: ${response.status()}`);
    }

    const body = await response.json();
    return employeeResponseSchema.parse(body).data;
  }
}
