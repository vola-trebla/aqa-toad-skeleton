Да, вот картина целиком 🐸

---

## Ситуация

Альберт — Senior SDET с 8+ лет опыта, TypeScript + Playwright. Проходит собеседование в **Alloy Software** на позицию **SDET / QA Automation Lead**.

Alloy делают ITSM/ITAM продукт — **Alloy Navigator**. Внутри у них:

- 1 автоматизатор, 3 ручных QA, 1 лид который разрывается
- Регресс 100% ручной — это их главная боль
- Разработчики сами пишут e2e потому что QA не успевает
- Ждут визионера который придёт и выстроит всё с нуля
- Стек: Playwright + TypeScript — прямое попадание

HR-созвон уже прошёл, всё хорошо. Ждём следующий этап.

---

## Что делаем параллельно

Пока ждём — строим реальный фреймворк на **OrangeHRM Demo** (opensource-demo.orangehrmlive.com) — живая система с похожей механикой: роли, workflows, state machine, формы, таблицы.

Репозиторий: **github.com/vola-trebla/aqa-toad-skeleton**

Скелет уже есть:

- Структура src/core, pages, fixtures, components, helpers
- Zod-валидация конфига
- Husky + ESLint + Prettier
- CLAUDE.md и GEMINI.md — AI-правила в проекте
- GitHub Actions с шардингом
- Allure + Slack reporter

---

## Что нужно докрутить до понедельника

**Технически:**

- Fixtures — авторизация через API + тестовые данные с teardown
- Page Objects с инкапсулированными проверками и локаторами в конструкторе
- Component Objects — таблица, модалка, форма
- Step-обёртка вместо test.step везде
- 5-7 читаемых тестов на критичные flows
- CI зелёный

**Паттерны которые покажут уровень:**

- Builder pattern для тестовых данных
- UIElement обёртки — `element.shouldBeVisible()`
- Авторизация через API, не через UI
- Zod-валидация API-ответов
- Многоуровневая стратегия: smoke → critical → regression

---

## Цель

В понедельник отправить HR короткое сообщение:

> Привет! Пока жду следующего этапа, не сидел без дела — набросал скелет automation-фреймворка на Playwright + TypeScript, как я это вижу для продукта похожего на ваш. Если у CTO или команды будет пара минут глянуть — буду рад фидбеку. Вот репозиторий: github.com/vola-trebla/aqa-toad-skeleton

---

Завтра открываем Claude Code, подключаешь меня к проекту — и идём руками по всем этим паттернам 🐸
