import { Locator, Page, expect } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { OrangeTable } from '@/components/orange-table.component';
import { OrangeConfirmModal } from '@/components/orange-confirm-modal.component';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { PIMLabels } from '@/constants/pim';
import { step } from '@/core/step';
import type { EmployeeResponse } from '@/api/schemas/employee.schema';

export class PIMListPage extends StaticRoutePage {
  readonly url = Routes.pim.list;

  private readonly table: OrangeTable;
  private readonly deleteModal: OrangeConfirmModal;
  private readonly _employeeIdInput: Locator;
  private readonly _searchBtn: Locator;
  private readonly _tableCards: Locator;

  constructor(page: Page) {
    super(page);
    this.table = new OrangeTable(page, '.oxd-table');
    this.deleteModal = new OrangeConfirmModal(page);
    this._employeeIdInput = page
      .locator('form .oxd-input-group', { hasText: PIMLabels.employeeId })
      .locator('input');
    this._searchBtn = page.getByRole('button', { name: PIMLabels.search });
    this._tableCards = page.locator('.oxd-table-body .oxd-table-card');
  }

  // --- Domain actions ---

  async searchEmployeeById(id: string): Promise<void> {
    await step(`Поиск сотрудника по ID: ${id}`, async () => {
      const waitForResults = this.page.waitForResponse(
        (r) => r.url().includes(ApiEndpoints.pim.employees) && r.ok()
      );
      await this._employeeIdInput.fill(id);
      await this._searchBtn.click();
      await waitForResults;
    });
  }

  async deleteEmployeeById(employeeId: string): Promise<void> {
    await step(`Удаление сотрудника по ID: ${employeeId}`, async () => {
      const row = this.employeeRowById(employeeId);
      await row.locator('button:has(i.bi-trash)').click();
      await this.deleteModal.confirm();
    });
  }

  // --- Domain assertions ---

  async assertSearchHasResults(): Promise<void> {
    await step('Проверка наличия результатов поиска', () =>
      expect(this._tableCards.first()).toBeVisible()
    );
  }

  async assertEmployeeVisible(employee: EmployeeResponse): Promise<void> {
    const employeeId = employee.employeeId!;
    await step(`Проверка наличия сотрудника ${employeeId} в таблице`, async () => {
      const row = this.employeeRowById(employeeId);
      await expect(row).toBeVisible();
      await expect(row).toContainText(employee.firstName);
      await expect(row).toContainText(employee.lastName);
    });
  }

  async assertEmployeeVisibleById(employeeId: string): Promise<void> {
    await step(`Проверка наличия строки с ID ${employeeId} в таблице`, () =>
      expect(this.employeeRowById(employeeId)).toBeVisible()
    );
  }

  async assertEmployeeAbsent(employeeId: string): Promise<void> {
    await step(`Проверка отсутствия сотрудника ${employeeId} в таблице`, () =>
      expect(this.employeeRowById(employeeId)).toHaveCount(0)
    );
  }

  // --- Private helpers ---

  private employeeRowById(employeeId: string): Locator {
    return this._tableCards.filter({ hasText: employeeId });
  }
}
