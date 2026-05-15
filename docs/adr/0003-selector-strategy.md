# ADR 0003 - Selector Strategy

Date: 2026-05-11
Status: Accepted

## Context

Consistency in selector choice is critical for maintainability. Without a strategy, different developers will use different patterns (CSS, XPath, Text, ARIA), leading to a brittle and hard-to-read codebase.

## Decision

Apply Playwright locators in a strict priority order (Accessibility-first).

### Priority table

| Priority | Locator type                  | Example                                  | Why?                                            |
| -------- | ----------------------------- | ---------------------------------------- | ----------------------------------------------- |
| 1        | `getByRole` + accessible name | `getByRole('button', { name: 'Login' })` | Most resilient and accessible.                  |
| 2        | `getByLabel`                  | `getByLabel('First Name')`               | Stable form associations.                       |
| 3        | `getByPlaceholder`            | `getByPlaceholder('Username')`           | Good for forms without labels.                  |
| 4        | `getByText`                   | `getByText('Dashboard')`                 | Great for static navigation items.              |
| 5        | `getByTestId`                 | `getByTestId('submit-form')`             | If you control the frontend, this is preferred. |
| 6        | Semantic HTML attribute       | `locator('input[name="firstName"]')`     | Standard HTML attributes.                       |
| 7        | CSS / XPath                   | -                                        | **Last resort**. Requires a comment.            |

### Rules

1. **Avoid Brittle CSS**: Never use auto-generated classes or long DOM paths.
2. **XPath is Prohibited**: Use it only if no other way exists and justify it with a comment.
3. **Encapsulation**: Keep all complex selector strings inside Page Objects or separate constants if they are shared across components.

## Consequences

### Positive

- Tests are more resilient to UI changes.
- Encourages accessible frontend development.
- Uniform code style across the team.

### Negative

- Requires more thought when choosing selectors compared to just "copying the CSS path" from DevTools.
