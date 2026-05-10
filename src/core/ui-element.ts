import { Locator, expect } from '@playwright/test';

/**
 * Обертка над локатором Playwright для удобных ассертов и действий.
 * Позволяет писать тесты в стиле Selenide: element.shouldBeVisible()
 */
export class UIElement {
  constructor(
    public readonly locator: Locator,
    private readonly name: string
  ) {}

  async shouldBeVisible() {
    await expect(this.locator, `Элемент "${this.name}" должен быть видимым`).toBeVisible();
  }

  async shouldBeHidden() {
    await expect(this.locator, `Элемент "${this.name}" должен быть скрыт`).toBeHidden();
  }

  async shouldBeEnabled() {
    await expect(this.locator, `Элемент "${this.name}" должен быть доступен`).toBeEnabled();
  }

  async shouldBeDisabled() {
    await expect(this.locator, `Элемент "${this.name}" должен быть заблокирован`).toBeDisabled();
  }

  async shouldHaveAttribute(attr: string, value: string | RegExp) {
    await expect(
      this.locator,
      `Элемент "${this.name}" должен иметь атрибут ${attr}="${value}"`
    ).toHaveAttribute(attr, value);
  }

  async shouldHaveCSS(prop: string, value: string) {
    await expect(
      this.locator,
      `Элемент "${this.name}" должен иметь CSS свойство ${prop}="${value}"`
    ).toHaveCSS(prop, value);
  }

  async shouldContainText(text: string | RegExp) {
    await expect(
      this.locator,
      `Элемент "${this.name}" должен содержать текст "${text}"`
    ).toContainText(text);
  }

  async shouldHaveText(text: string | RegExp) {
    await expect(this.locator, `Элемент "${this.name}" должен иметь текст "${text}"`).toHaveText(
      text
    );
  }

  async shouldHaveCount(count: number) {
    await expect(
      this.locator,
      `Количество элементов "${this.name}" должно быть ${count}`
    ).toHaveCount(count);
  }

  // Прокси для основных действий
  async click() {
    await this.locator.click();
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }
}
