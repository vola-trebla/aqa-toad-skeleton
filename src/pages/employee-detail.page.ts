import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { UIElement } from '../core/ui-element';

export class EmployeeDetailPage extends BasePage {
  readonly url = '/web/index.php/pim/viewPersonalDetails';

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
    this.saveBtn = this.element('button[type="submit"]', 'Save Button');
  }

  async updateName(first: string, last: string): Promise<void> {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.saveBtn.click();
  }
}
