# 🐸 AQA-TOAD-SKELETON

**The Ultimate SDET Framework Skeleton** | Playwright + TypeScript + Zod

Designed for any web project. Ships with an OrangeHRM Demo as a reference.

This is a production-grade automation framework designed to be **cloned and adapted**. It implements advanced engineering patterns to ensure high cohesion, low coupling, and exceptional test stability.

## 🌟 Why this Skeleton?

- **Universal Core**: Infrastructure is decoupled from the target application.
- **Fail-Fast Configuration**: Environment validation via Zod prevents "why is this failing?" debugging sessions.
- **Domain-Driven POM**: Cleanest possible test specs.
- **Hybrid UI/API Architecture**: Ready-to-use API clients for fast data setup.
- **Professional Tooling**: Pre-configured CI/CD, linting, and reporting.

## 🛠 Adapt for Your Project

This skeleton is built to be yours in minutes. See the **[Adaptation Guide](docs/ADAPTATION_GUIDE.md)** for a step-by-step walkthrough on:

- Switching the Target URL.
- Adding your own API Clients and Page Objects.
- Purging the Demo files.

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
├── .github/workflows/       # CI/CD pipelines (Lint + Typecheck, Smoke, Nightly)
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   └── CONVENTIONS.md       # Test naming, imports, selector and builder rules
├── src/
│   ├── api/                 # Typed API clients (EmployeeApiClient), Zod schemas, ApiError
│   ├── config/              # Zod-validated environment configuration
│   ├── core/                # Base classes: BasePage, BaseComponent, StaticRoutePage
│   ├── components/          # Reusable UI components (OrangeTable)
│   ├── constants/           # Routes, API endpoints, OXD selectors, test tags
│   ├── pages/               # Page Objects (domain actions + assertions, no raw locators)
│   ├── fixtures/            # Fixture chain: auth -> api -> page (worker-scoped auth)
│   ├── helpers/             # BaseBuilder, EmployeeBuilder, waitForApi
│   └── reporters/           # Custom Slack reporter with flaky-test detection
├── tests/                   # Tiered spec suites
│   ├── smoke/               # Fast sanity checks (PR gate)
│   ├── critical/            # Happy-path end-to-end scenarios
│   ├── regression/          # Negative and edge-case scenarios
│   └── api/                 # Contract tests (API shape and semantics)
└── playwright.config.ts     # Projects: smoke, api, regression-chrome
```

## 🚦 Getting Started

1.  **Installation**:

    ```bash
    npm install
    npx playwright install
    ```

2.  **Configuration**:
    Copy `.env.example` to `.env`. For the OrangeHRM demo site, safe defaults are applied automatically.

    ```bash
    cp .env.example .env
    ```

3.  **Execution**:

    ```bash
    # Run smoke tests
    npm run test:smoke

    # Run in headed mode
    HEADLESS=false npx playwright test --project=smoke
    ```

## 📋 Engineering Standards

- **Encapsulation**: Assertions and locators live in Page Objects. Spec files express domain intent only. See [ADR 0001](docs/adr/0001-domain-first-test-api.md).
- **Fixture chain**: `authTest -> apiTest -> test` with worker-scoped storage state. See [ADR 0002](docs/adr/0002-fixture-architecture.md).
- **Selector priority**: `getByRole` first, OXD CSS classes isolated to `src/constants/oxd-selectors.ts`, XPath prohibited. See [ADR 0003](docs/adr/0003-selector-strategy.md).
- **Atomicity**: Tests are independent and manage their own data lifecycle via fixtures.
- **Branching**: Strict "Feature Branch -> Pull Request" workflow enforced by the Git Workflow Manifesto.
- **Type Safety**: No `any` type allowed. Strict TypeScript checking (`noUncheckedIndexedAccess`, `noImplicitOverride`) is part of the CI pipeline.
- **Conventions**: Test naming, import order, builder usage, tag constants - see [CONVENTIONS](docs/CONVENTIONS.md).

---

_Stay professional, stay focused._
