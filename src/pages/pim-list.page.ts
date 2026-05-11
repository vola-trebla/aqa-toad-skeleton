import { Locator, Page, expect } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { OrangeTable } from '@/components/orange-table.component';
import { OrangeConfirmModal } from '@/components/orange-confirm-modal.component';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { PIMLabels } from '@/constants/pim';
import { OXD } from '@/constants/oxd-selectors';
import { step } from '@/core/step';
import { waitForApi } from '@/helpers/wait-for-api';
import type { CreatedEmployee } from '@/api/schemas/employee.schema';

export class PIMListPage extends StaticRoutePage {
  readonly url = Routes.pim.list;

  private readonly table: OrangeTable;
  private readonly deleteModal: OrangeConfirmModal;
  private readonly employeeIdInput: Locator;
  private readonly searchBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.table = new OrangeTable(page);
    this.deleteModal = new OrangeConfirmModal(page);
    // OXD forms do not link <label for> - locate input by sibling label text.
    this.employeeIdInput = page
      .locator(`form ${OXD.form.inputGroup}`, { hasText: PIMLabels.employeeId })
      .locator('input');
    this.searchBtn = page.getByRole('button', { name: PIMLabels.search });
  }

  // --- Domain actions ---

  async searchEmployeeById(id: string): Promise<void> {
    await step(`Поиск сотрудника по ID: ${id}`, async () => {
      const done = waitForApi(this.page, ApiEndpoints.pim.employees);
      await this.employeeIdInput.fill(id);
      await this.searchBtn.click();
      await done;
    });
  }

  async deleteEmployeeById(employeeId: string): Promise<void> {
    await step(`Удаление сотрудника по ID: ${employeeId}`, async () => {
      const row = this.employeeRowById(employeeId);
      // Action buttons in OXD rows have no accessible name - locate by icon class.
      await row.locator(`button:has(${OXD.icons.trash})`).click();
      await this.deleteModal.confirm();
    });
  }

  // --- Domain assertions ---

  async assertSearchHasResults(): Promise<void> {
    await step('Проверка наличия результатов поиска', () =>
      expect(this.table.getFirstRow()).toBeVisible()
    );
  }

  async assertEmployeeVisible(employee: CreatedEmployee): Promise<void> {
    await step(`Проверка наличия сотрудника ${employee.employeeId} в таблице`, async () => {
      const row = this.employeeRowById(employee.employeeId);
      await expect(row).toBeVisible();
      // soft: report both field failures at once if the row content is wrong
      await expect.soft(row).toContainText(employee.firstName);
      await expect.soft(row).toContainText(employee.lastName);
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
    return this.table.getRowByText(employeeId);
  }
}
