import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { UIElement } from '../core/ui-element';
import { config } from '../config/env.config';
import { Routes } from '../constants/routes';

export class EmployeeDetailPage extends BasePage {
  readonly url = Routes.pim.list;

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
    // В OrangeHRM ID часто в группе без имени, используем текст лейбла
    this.employeeIdInput = this.element(
      '.oxd-input-group:has-text("Employee Id") input',
      'Employee Id Input'
    );
    this.saveBtn = this.element(
      '.oxd-form:has(input[name="firstName"]) button[type="submit"]',
      'Save Button'
    );
  }

  async navigateToEmployee(empNumber: number): Promise<void> {
    await this.page.goto(`${config.BASE_URL}${Routes.pim.personalDetails(empNumber)}`);
    await this.page.waitForLoadState('networkidle');
  }

  async updateName(first: string, last: string): Promise<void> {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
