import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { OXD } from '@/constants/oxd-selectors';
import { step } from '@/core/step';
import { waitForApi } from '@/helpers/wait-for-api';

export class EmployeeDetailPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly saveBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveBtn = page
      .locator(OXD.form.root)
      .filter({ has: this.firstNameInput })
      .locator('button[type="submit"]');
  }

  async openEmployee(empNumber: number): Promise<void> {
    await step(`Open employee details #${empNumber}`, async () => {
      await Promise.all([
        waitForApi(this.page, ApiEndpoints.pim.personalDetails(empNumber)),
        this.page.goto(Routes.pim.personalDetails(empNumber)),
      ]);
      await expect(this.firstNameInput).toBeVisible();
    });
  }

  async updateName(empNumber: number, first: string, last: string): Promise<void> {
    await step(`Update name to "${first} ${last}"`, async () => {
      await this.firstNameInput.fill(first);
      await this.lastNameInput.fill(last);
      await Promise.all([
        waitForApi(this.page, ApiEndpoints.pim.personalDetails(empNumber)),
        this.saveBtn.click(),
      ]);
    });
  }

  async assertName(firstName: string, lastName: string): Promise<void> {
    await step(`Assert name is: "${firstName} ${lastName}"`, async () => {
      await expect(this.firstNameInput).toHaveValue(firstName);
      await expect(this.lastNameInput).toHaveValue(lastName);
    });
  }
}
