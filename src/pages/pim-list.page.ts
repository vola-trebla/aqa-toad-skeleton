import { Page, Locator } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { TableComponent } from '../components/table.component';

export class PIMListPage extends BasePage {
  readonly url = '/web/index.php/pim/viewEmployeeList';
  readonly table: TableComponent;

  // Элементы страницы
  readonly employeeIdInput: Locator;
  readonly searchBtn: Locator;
  readonly addBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.table = new TableComponent(page, '.oxd-table');

    // Инициализация локаторов
    this.employeeIdInput = page
      .locator('form .oxd-input-group', { hasText: 'Employee Id' })
      .locator('input');
    this.searchBtn = page.locator('button[type="submit"]');
    this.addBtn = page.locator('button:has-text("Add")');
  }

  async searchEmployeeById(id: string): Promise<void> {
    await this.employeeIdInput.fill(id);
    await this.searchBtn.click();
    await this.table.waitForData();
  }
}
