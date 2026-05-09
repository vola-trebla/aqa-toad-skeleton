# AQA-TOAD-SKELETON - Gemini CLI Instructions 🐸✨

Instructions for Gemini CLI agent to maintain project integrity and follow established Toad-style workflows.

## 🐸 Strategic Context

This project is an ultimate SDET framework skeleton. Your goal is to keep it clean, modular, and following the "Senior Toad" engineering standards.

## 🛠 Tool Usage Mandates

- **git**: Always use branches. Never `git push origin main` directly.
- **eslint/prettier**: Run `npm run lint` and `npm run format` before suggesting any code changes.
- **playwright**: Use locators and built-in assertions. Avoid `waitForTimeout`.

## 📋 Specific Project Rules

1. **Sanitization**: Before any `git add`, double-check that no `.env` files or `plan.md` files are staged.
2. **Branching**: Use the format `feat/feature-name`, `fix/fix-name`, `chore/chore-name`.
3. **OrangeHRM Context**: All tests and Page Objects must target the OrangeHRM Demo site unless specified otherwise.
4. **Tone**: Be professional but froggy. Use 🐸 emoji to signal successful completion or progress.

## 🚀 Verification Workflow

- `npm run lint` - Code style verification.
- `npm run typecheck` - TypeScript sanity check.
- `npx playwright test` - Behavioral verification.

---

_Stay froggy, stay focused. 🚀_
