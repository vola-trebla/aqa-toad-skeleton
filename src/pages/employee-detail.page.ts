import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { config } from '@/config/env.config';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { step } from '@/core/step';

export class EmployeeDetailPage extends BasePage {
  readonly url = Routes.pim.list;

  private readonly _firstNameInput: Locator;
  private readonly _lastNameInput: Locator;
  private readonly _saveBtn: Locator;

  constructor(page: Page) {
    super(page);
    this._firstNameInput = page.locator('input[name="firstName"]');
    this._lastNameInput = page.locator('input[name="lastName"]');
    this._saveBtn = page.locator('.oxd-form:has(input[name="firstName"]) button[type="submit"]');
  }

  // --- Domain actions ---

  async openEmployee(empNumber: number): Promise<void> {
    await step(`Открытие карточки сотрудника #${empNumber}`, async () => {
      await this.page.goto(`${config.BASE_URL}${Routes.pim.personalDetails(empNumber)}`);
      await expect(this._firstNameInput).toBeVisible();
    });
  }

  async updateName(empNumber: number, first: string, last: string): Promise<void> {
    await step(`Обновление имени на "${first} ${last}"`, async () => {
      await this._firstNameInput.fill(first);
      await this._lastNameInput.fill(last);
      const waitForSave = this.page.waitForResponse(
        (r) => r.url().includes(ApiEndpoints.pim.personalDetails(empNumber)) && r.ok()
      );
      await this._saveBtn.click();
      await waitForSave;
    });
  }

  // --- Domain assertions ---

  async assertName(firstName: string, lastName: string): Promise<void> {
    await step(`Проверка имени: "${firstName} ${lastName}"`, async () => {
      await expect(this._firstNameInput).toHaveValue(firstName);
      await expect(this._lastNameInput).toHaveValue(lastName);
    });
  }
}
