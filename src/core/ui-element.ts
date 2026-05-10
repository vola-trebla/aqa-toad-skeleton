import { Locator, expect, test } from '@playwright/test';

/**
 * Обертка над локатором Playwright для удобных ассертов и действий.
 * Позволяет писать тесты в стиле Selenide: element.shouldBeVisible()
 * Автоматически логирует шаги в Allure.
 */
export class UIElement {
  constructor(
    public readonly locator: Locator,
    private readonly name: string
  ) {}

  async shouldBeVisible() {
    await test.step(`Проверка видимости элемента "${this.name}"`, async () => {
      await expect(this.locator, `Элемент "${this.name}" должен быть видимым`).toBeVisible();
    });
  }

  async shouldBeHidden() {
    await test.step(`Проверка скрытости элемента "${this.name}"`, async () => {
      await expect(this.locator, `Элемент "${this.name}" должен быть скрыт`).toBeHidden();
    });
  }

  async shouldBeEnabled() {
    await test.step(`Проверка доступности элемента "${this.name}"`, async () => {
      await expect(this.locator, `Элемент "${this.name}" должен быть доступен`).toBeEnabled();
    });
  }

  async shouldBeDisabled() {
    await test.step(`Проверка заблокированности элемента "${this.name}"`, async () => {
      await expect(this.locator, `Элемент "${this.name}" должен быть заблокирован`).toBeDisabled();
    });
  }

  async shouldHaveAttribute(attr: string, value: string | RegExp) {
    await test.step(`Проверка атрибута "${attr}"="${value}" у элемента "${this.name}"`, async () => {
      await expect(
        this.locator,
        `Элемент "${this.name}" должен иметь атрибут ${attr}="${value}"`
      ).toHaveAttribute(attr, value);
    });
  }

  async shouldHaveCSS(prop: string, value: string) {
    await test.step(`Проверка CSS свойства "${prop}"="${value}" у элемента "${this.name}"`, async () => {
      await expect(
        this.locator,
        `Элемент "${this.name}" должен иметь CSS свойство ${prop}="${value}"`
      ).toHaveCSS(prop, value);
    });
  }

  async shouldContainText(text: string | RegExp) {
    await test.step(`Проверка вхождения текста "${text}" в элемент "${this.name}"`, async () => {
      await expect(
        this.locator,
        `Элемент "${this.name}" должен содержать текст "${text}"`
      ).toContainText(text);
    });
  }

  async shouldHaveText(text: string | RegExp) {
    await test.step(`Проверка текста "${text}" у элемента "${this.name}"`, async () => {
      await expect(this.locator, `Элемент "${this.name}" должен иметь текст "${text}"`).toHaveText(
        text
      );
    });
  }

  async shouldHaveCount(count: number) {
    await test.step(`Проверка количества элементов "${this.name}" (ожидается ${count})`, async () => {
      await expect(
        this.locator,
        `Количество элементов "${this.name}" должно быть ${count}`
      ).toHaveCount(count);
    });
  }

  async shouldHaveCountGreaterThan(count: number) {
    await test.step(`Проверка, что количество элементов "${this.name}" больше ${count}`, async () => {
      await expect(async () => {
        const actualCount = await this.locator.count();
        expect(
          actualCount,
          `Количество элементов "${this.name}" должно быть больше ${count}, но было ${actualCount}`
        ).toBeGreaterThan(count);
      }, `Ожидание, что количество элементов "${this.name}" станет больше ${count}`).toPass();
    });
  }

  // Прокси для основных действий
  async click() {
    await test.step(`Клик по элементу "${this.name}"`, async () => {
      await this.locator.click();
    });
  }

  async fill(value: string) {
    // Не логируем пароли в шагах
    const displayValue = this.name.toLowerCase().includes('password') ? '********' : value;
    await test.step(`Ввод значения "${displayValue}" в элемент "${this.name}"`, async () => {
      await this.locator.fill(value);
    });
  }
}
