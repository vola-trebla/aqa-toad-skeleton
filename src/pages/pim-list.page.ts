import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TableComponent } from '../../components/table.component';

export class PIMListPage extends BasePage {
  readonly url = '/web/index.php/pim/viewEmployeeList';
  readonly table: TableComponent;

  constructor(page: Page) {
    super(page);
    this.table = new TableComponent(page, '.oxd-table');
  }

  private readonly selectors = {
    addBtn: 'button:has-text("Add")',
    employeeNameInput: 'input[placeholder="First Name"]',
    // ... more selectors
  };

  async searchEmployeeById(id: string): Promise<void> {
    await this.page.fill('input:below(:text("Employee Id"))', id);
    await this.page.click('button[type="submit"]');
    await this.table.waitForData();
  }
}
