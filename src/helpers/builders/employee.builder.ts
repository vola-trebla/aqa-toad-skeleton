export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export class EmployeeBuilder {
  private employee: Employee = {
    firstName: 'Test',
    middleName: '',
    lastName: `Employee-${Date.now()}`,
    employeeId: `E${Math.floor(Math.random() * 90000) + 10000}`,
  };

  withFirstName(firstName: string): this {
    this.employee.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.employee.lastName = lastName;
    return this;
  }

  withMiddleName(middleName: string): this {
    this.employee.middleName = middleName;
    return this;
  }

  withEmployeeId(employeeId: string): this {
    this.employee.employeeId = employeeId;
    return this;
  }

  build(): Employee {
    return { ...this.employee };
  }
}
