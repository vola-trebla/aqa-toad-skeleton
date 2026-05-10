import { Locator, expect } from '@playwright/test';
import { step } from './step';

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
    await step(`Проверка видимости элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен быть видимым`).toBeVisible()
    );
  }

  async shouldBeHidden() {
    await step(`Проверка скрытости элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен быть скрыт`).toBeHidden()
    );
  }

  async shouldBeEnabled() {
    await step(`Проверка доступности элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен быть доступен`).toBeEnabled()
    );
  }

  async shouldBeDisabled() {
    await step(`Проверка заблокированности элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен быть заблокирован`).toBeDisabled()
    );
  }

  async shouldHaveAttribute(attr: string, value: string | RegExp) {
    await step(`Проверка атрибута "${attr}"="${value}" у элемента "${this.name}"`, () =>
      expect(
        this.locator,
        `Элемент "${this.name}" должен иметь атрибут ${attr}="${value}"`
      ).toHaveAttribute(attr, value)
    );
  }

  async shouldHaveCSS(prop: string, value: string) {
    await step(`Проверка CSS свойства "${prop}"="${value}" у элемента "${this.name}"`, () =>
      expect(
        this.locator,
        `Элемент "${this.name}" должен иметь CSS свойство ${prop}="${value}"`
      ).toHaveCSS(prop, value)
    );
  }

  async shouldContainText(text: string | RegExp) {
    await step(`Проверка вхождения текста "${text}" в элемент "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен содержать текст "${text}"`).toContainText(
        text
      )
    );
  }

  async shouldHaveText(text: string | RegExp) {
    await step(`Проверка текста "${text}" у элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен иметь текст "${text}"`).toHaveText(text)
    );
  }

  async shouldHaveCount(count: number) {
    await step(`Проверка количества элементов "${this.name}" (ожидается ${count})`, () =>
      expect(this.locator, `Количество элементов "${this.name}" должно быть ${count}`).toHaveCount(
        count
      )
    );
  }

  async shouldHaveCountGreaterThan(count: number) {
    await step(`Проверка, что количество элементов "${this.name}" больше ${count}`, () =>
      expect(async () => {
        const actualCount = await this.locator.count();
        expect(
          actualCount,
          `Количество элементов "${this.name}" должно быть больше ${count}, но было ${actualCount}`
        ).toBeGreaterThan(count);
      }, `Ожидание, что количество элементов "${this.name}" станет больше ${count}`).toPass()
    );
  }

  async shouldHaveValue(value: string | RegExp) {
    await step(`Проверка значения "${value}" у элемента "${this.name}"`, () =>
      expect(this.locator, `Элемент "${this.name}" должен иметь значение "${value}"`).toHaveValue(
        value
      )
    );
  }

  // Прокси для основных действий
  async click() {
    await step(`Клик по элементу "${this.name}"`, () => this.locator.click());
  }

  async fill(value: string) {
    const displayValue = this.name.toLowerCase().includes('password') ? '********' : value;
    await step(`Ввод значения "${displayValue}" в элемент "${this.name}"`, () =>
      this.locator.fill(value)
    );
  }
}
