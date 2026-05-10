## Situation

Albert — Senior SDET with 8+ years of experience, TypeScript + Playwright. Interviewing at **Alloy Software** for the **SDET / QA Automation Lead** position.

Alloy builds an ITSM/ITAM product — **Alloy Navigator**. Their current state:

- 1 automation engineer, 3 manual QAs, 1 lead stretched thin.
- Regression is 100% manual — their primary pain point.
- Developers write e2e tests because the QA team is overloaded.
- Looking for a visionary to build the entire framework from scratch.
- Tech Stack: Playwright + TypeScript — a perfect match.

The HR interview is already completed. Waiting for the next stage.

---

## Current Progress

Building a production-grade framework targeting **OrangeHRM Demo** (opensource-demo.orangehrmlive.com) — a live system with similar mechanics: roles, workflows, state machines, forms, and tables.

Repository: **github.com/vola-trebla/aqa-toad-skeleton**

Framework Skeleton is ready:

- Modular structure: src/core, pages, fixtures, components, helpers.
- Typed configuration with Zod validation.
- Automated quality: Husky + ESLint + Prettier.
- AI-assisted workflow: CLAUDE.md and GEMINI.md instructions.
- CI/CD: GitHub Actions with sharding support.
- Reporting: Allure integration + Slack reporter.

---

## Goals for Monday

**Technical Requirements:**

- Fixtures: API-based authentication + automated test data with teardown.
- Page Objects: Encapsulated assertions and locators initialized in the constructor.
- Component Objects: Reusable Table, Modal, and Form components.
- Global `step` wrapper for streamlined Allure reporting.
- 5-7 readable tests for critical business flows.
- Green CI pipeline.

**Advanced Patterns to Showcase Seniority:**

- **Builder Pattern** for test data generation.
- **Fluent UIElement Wrappers**: `element.shouldBeVisible()`.
- **API-First Authentication**: Bypassing UI for faster execution.
- **Contract Testing**: Zod validation for API responses.
- **Tiered Strategy**: Smoke → Critical → Regression.

---

## Objective

On Monday, send a short message to the HR:

> "Hi! While waiting for the next stage, I've put together a skeleton of an automation framework using Playwright + TypeScript, reflecting my vision for a product similar to yours. If the CTO or the team has a few minutes to check it out, I'd value their feedback. Repository link: github.com/vola-trebla/aqa-toad-skeleton"

---

Finalize the implementation, ensure all patterns are correctly applied, and prepare the repository for final review.
