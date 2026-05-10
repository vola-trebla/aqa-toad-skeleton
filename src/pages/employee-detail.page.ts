import { Page } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { UIElement } from '@/core/ui-element';
import { config } from '@/config/env.config';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';

export class EmployeeDetailPage extends BasePage {
  readonly url = Routes.pim.list;

  private empNumber: number = 0;

  readonly firstNameInput: UIElement;
  readonly middleNameInput: UIElement;
  readonly lastNameInput: UIElement;
  readonly employeeIdInput: UIElement;
  readonly saveBtn: UIElement;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = this.element('input[name="firstName"]', 'First Name Input');
    this.middleNameInput = this.element('input[name="middleName"]', 'Middle Name Input');
    this.lastNameInput = this.element('input[name="lastName"]', 'Last Name Input');
    this.employeeIdInput = this.element(
      '.oxd-input-group:has-text("Employee Id") input',
      'Employee Id Input'
    );
    this.saveBtn = this.element(
      '.oxd-form:has(input[name="firstName"]) button[type="submit"]',
      'Save Button'
    );
  }

  override navigate(): never {
    throw new Error('EmployeeDetailPage requires empNumber - use navigateToEmployee(empNumber)');
  }

  async navigateToEmployee(empNumber: number): Promise<void> {
    this.empNumber = empNumber;
    await this.page.goto(`${config.BASE_URL}${Routes.pim.personalDetails(empNumber)}`);
    await this.firstNameInput.shouldBeVisible();
  }

  async updateName(first: string, last: string): Promise<void> {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    const waitForSave = this.page.waitForResponse(
      (r) => r.url().includes(ApiEndpoints.pim.personalDetails(this.empNumber)) && r.ok()
    );
    await this.saveBtn.click();
    await waitForSave;
  }
}
