# AQA-TOAD-SKELETON

Ultimate SDET Framework Skeleton | Playwright + TypeScript + Zod | OrangeHRM Demo

This is a robust, scalable, and maintainable automation framework designed for modern web applications. It implements advanced engineering patterns to ensure test stability, readability, and developer experience.

## 🚀 Key Features

- **Strict Page Object Model (POM)**: All selectors are encapsulated within class properties, keeping tests focused on business logic.
- **Fluent Assertion Wrappers**: Selenide-style `UIElement` wrappers (`element.shouldBeVisible()`) for highly readable and expressive tests.
- **Fail-Fast Configuration**: Environment variables are validated on startup using **Zod**, preventing runtime errors due to missing config.
- **Automated Code Quality**: Integrated **ESLint**, **Prettier**, and **Husky** with pre-commit hooks to maintain a clean codebase.
- **Scalable CI/CD**: Ready-to-use GitHub Actions workflows for linting, type-checking, and nightly regression runs with sharding.
- **Advanced Reporting**: Integrated with **Allure** and a custom **Slack Reporter** for real-time notifications.

## 🛠 Tech Stack

- **Language**: TypeScript (Modern ESNext / Bundler resolution)
- **Test Runner**: [Playwright](https://playwright.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **VCS Hooks**: [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/okonet/lint-staged)
- **Linting/Formatting**: ESLint & Prettier
- **Target App**: [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

## 🏗 Project Structure

```
project-root/
├── .github/workflows/       # CI/CD pipelines (Lint, Nightly)
├── src/
│   ├── config/              # Typed environment configuration
│   ├── core/                # Framework engine (BasePage, UIElement)
│   ├── components/          # Reusable UI components (Table, Modal)
│   ├── pages/               # Page Objects (Real OrangeHRM mapping)
│   ├── fixtures/            # Custom Playwright fixtures (Auth bypass)
│   ├── helpers/             # Utility helpers (Retry, Data Factory)
│   └── reporters/           # Custom test reporters (Slack)
├── tests/                   # Test specs (Smoke, Regression)
└── playwright.config.ts     # Global Playwright settings
```

## 🚦 Getting Started

1.  **Clone and Install**:

    ```bash
    npm install
    npx playwright install
    ```

2.  **Configure Environment**:
    Copy `.env.example` to `.env` and fill in your credentials.

    ```bash
    cp .env.example .env
    ```

3.  **Run Tests**:

    ```bash
    # Run all smoke tests
    npm run test:smoke

    # Run in headed mode (visible browser)
    HEADLESS=false npx playwright test --project=smoke
    ```

## 📋 Operational Workflows

- **Branch Policy**: All changes must go through a feature branch and a Pull Request.
- **Commit Hygiene**: Code is automatically formatted by Prettier on every commit.
- **Type Safety**: No `any` allowed. Always run `npm run typecheck` before pushing.

---

_Stay professional, stay focused._
