import { Page } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { TableComponent } from '@/components/table.component';
import { ModalComponent } from '@/components/modal.component';
import { UIElement } from '@/core/ui-element';
import { Routes } from '@/constants/routes';
import { ApiEndpoints } from '@/constants/api-endpoints';

export class PIMListPage extends BasePage {
  readonly url = Routes.pim.list;
  readonly table: TableComponent;
  readonly deleteModal: ModalComponent;

  readonly employeeIdInput: UIElement;
  readonly searchBtn: UIElement;
  readonly addBtn: UIElement;

  constructor(page: Page) {
    super(page);
    this.table = new TableComponent(page, '.oxd-table');
    this.deleteModal = new ModalComponent(page);

    this.employeeIdInput = this.element(
      'form .oxd-input-group:has-text("Employee Id") input',
      'Employee Id Input'
    );
    this.searchBtn = this.element('button[type="submit"]', 'Search Button');
    this.addBtn = this.element('button:has-text("Add")', 'Add Button');
  }

  async searchEmployeeById(id: string): Promise<void> {
    const waitForResults = this.page.waitForResponse(
      (r) => r.url().includes(ApiEndpoints.pim.employees) && r.ok()
    );
    await this.employeeIdInput.fill(id);
    await this.searchBtn.click();
    await waitForResults;
  }

  async deleteFirstResult(): Promise<void> {
    await this.page.locator('.oxd-table-card button:has(i.bi-trash)').first().click();
    await this.deleteModal.confirm();
  }
}
