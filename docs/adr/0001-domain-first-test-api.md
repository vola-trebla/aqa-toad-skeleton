# ADR 0001 - Domain-first test API

Date: 2026-05-10
Status: Accepted

## Context

The project initially had multiple competing styles for writing tests:

- DSL wrappers over Playwright.
- Raw `expect(locator)` in spec files.
- Raw `page.locator(...)` in spec files.
- Public element fields on Page Objects exposing Playwright locators.

This created inconsistency at scale and made maintenance harder.

## Decision

**Domain-first specs, Playwright-first internals.**

- Spec files describe scenarios and page/component contracts (domain intent).
- Page Objects and Components own Playwright locators and `expect` calls.
- Locators are private fields on Page Objects/Components.
- Public API of a Page Object is its domain actions and domain assertions.
- Fine-grained DOM checks may exist as private helpers grouped into larger contracts.

## Consequences

### Positive

- Specs read as scenarios: `examplePage.assertOpen()`, `examplePage.login(user, pass)`.
- DOM changes do not require touching test files.
- New test authors and AI agents have one obvious place to look (Page Object) for the public API.
- Test failures point at meaningful business operations, not DOM-level assertions.

### Negative

- Adding a new test that needs a new check requires extending the Page Object first.
- More boilerplate than raw Playwright for one-off checks.

## Rejected alternatives

### Pure Locator-first

`await expect(loginPage.passwordInput).toBeVisible()` in specs.
Rejected because it leaks DOM details into scenarios and makes tests verbose.

### Framework DSL

`await pageObject.element.shouldBeVisible()`.
Rejected because it builds a second Playwright on top of Playwright, adds maintenance cost, and gives no real value over `expect(locator)` inside Page Objects.
