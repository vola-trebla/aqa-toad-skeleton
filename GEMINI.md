# AQA-TOAD-SKELETON - Gemini CLI Instructions

Instructions for Gemini CLI agent to maintain project integrity and follow established SDET workflows.

## 🎯 Strategic Context

This project is an ultimate SDET framework skeleton. Your goal is to keep it clean, modular, and following the Senior SDET engineering standards.

## 🛠 Tool Usage Mandates

- **git**: Always use branches. Never `git push origin main` directly.
- **eslint/prettier**: Run `npm run lint` and `npm run format` before suggesting any code changes.
- **playwright**: Use locators and built-in assertions. Avoid `waitForTimeout`.

## 📋 Specific Project Rules

1. **Git Workflow Manifesto**: Strictly follow the [Git Workflow Manifesto](.claude/rules/git-workflow-manifesto.md) for all repository operations.
2. **Sanitization**: Before any `git add`, double-check that no `.env` files or `plan.md` files are staged.
3. **Branching**: Use the format `feat/feature-name`, `fix/fix-name`, `chore/chore-name`.
4. **OrangeHRM Context**: All tests and Page Objects must target the OrangeHRM Demo site unless specified otherwise.
5. **Tone**: Be professional and concise.

## 🚀 Verification Workflow

- `npm run lint` - Code style verification.
- `npm run typecheck` - TypeScript sanity check.
- `npx playwright test` - Behavioral verification.

---

_Stay professional, stay focused._
