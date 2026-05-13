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
    this.employeeIdInput = page
      .locator(`form ${OXD.form.inputGroup}`, { hasText: PIMLabels.employeeId })
      .locator('input');
    this.searchBtn = page.getByRole('button', { name: PIMLabels.search });
  }

  async searchEmployeeById(id: string): Promise<void> {
    await step(`Search employee by ID: ${id}`, async () => {
      await this.employeeIdInput.fill(id);
      await Promise.all([
        waitForApi(this.page, ApiEndpoints.pim.employees),
        this.searchBtn.click(),
      ]);
    });
  }

  async deleteEmployeeById(employeeId: string): Promise<void> {
    await step(`Delete employee by ID: ${employeeId}`, async () => {
      const row = this.employeeRowById(employeeId);
      await row.locator(`button:has(${OXD.icons.trash})`).click();
      await this.deleteModal.confirm();
    });
  }

  async assertSearchHasResults(): Promise<void> {
    await step('Assert search has results', () => expect(this.table.getFirstRow()).toBeVisible());
  }

  async assertEmployeeVisible(employee: CreatedEmployee): Promise<void> {
    await step(`Assert employee ${employee.employeeId} is visible`, async () => {
      const row = this.employeeRowById(employee.employeeId);
      await expect(row).toBeVisible();
      await expect.soft(row).toContainText(employee.firstName);
      await expect.soft(row).toContainText(employee.lastName);
    });
  }

  async assertEmployeeVisibleById(employeeId: string): Promise<void> {
    await step(`Assert employee ID ${employeeId} is visible`, () =>
      expect(this.employeeRowById(employeeId)).toBeVisible()
    );
  }

  async assertEmployeeAbsent(employeeId: string): Promise<void> {
    await step(`Assert employee ${employeeId} is absent`, () =>
      expect(this.employeeRowById(employeeId)).toHaveCount(0)
    );
  }

  private employeeRowById(employeeId: string): Locator {
    return this.table.getRowByText(employeeId);
  }
}
