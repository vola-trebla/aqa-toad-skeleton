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
    // Scope save button to the personal-details form (page also has secondary forms).
    this.saveBtn = page
      .locator(OXD.form.root)
      .filter({ has: this.firstNameInput })
      .locator('button[type="submit"]');
  }

  // --- Domain actions ---

  async openEmployee(empNumber: number): Promise<void> {
    await step(`Открытие карточки сотрудника #${empNumber}`, async () => {
      const done = waitForApi(this.page, ApiEndpoints.pim.personalDetails(empNumber));
      await this.page.goto(Routes.pim.personalDetails(empNumber));
      await done;
      await expect(this.firstNameInput).toBeVisible();
    });
  }

  async updateName(empNumber: number, first: string, last: string): Promise<void> {
    await step(`Обновление имени на "${first} ${last}"`, async () => {
      await this.firstNameInput.fill(first);
      await this.lastNameInput.fill(last);
      const done = waitForApi(this.page, ApiEndpoints.pim.personalDetails(empNumber));
      await this.saveBtn.click();
      await done;
    });
  }

  // --- Domain assertions ---

  async assertName(firstName: string, lastName: string): Promise<void> {
    await step(`Проверка имени: "${firstName} ${lastName}"`, async () => {
      await expect(this.firstNameInput).toHaveValue(firstName);
      await expect(this.lastNameInput).toHaveValue(lastName);
    });
  }
}
