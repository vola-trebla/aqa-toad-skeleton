# 📜 Git Toad Manifesto 🐸

Rules for managing the AQA-TOAD-SKELETON repository to ensure engineering excellence and "froggy" order.

## 1. Sacred Waters (Main Branch Protection)

- **NEVER** push directly to `main`. It is a protected sanctuary.
- All changes must be reviewed and merged via Pull Requests.

## 2. Personal Lily Pads (Feature Branching)

- Every task must have its own branch.
- Use naming conventions: `feat/feature-name`, `fix/bug-fix`, `chore/task-name`.

## 3. Clean Paws (Sanitization)

- Before `git add .`, double-check for sensitive files.
- Ensure `.env`, `plan.md`, and `.auth/` artifacts are **NEVER** tracked.
- Use `.gitignore` as your primary shield. 🛡️

## 4. Toad Marks (Commit Hygiene)

- Commit messages must be clear, concise, and professional.
- **Mandatory**: Every commit message must include the 🐸 emoji.
- Use `git commit -m "..."` to avoid interactive editors.

## 5. Order in the Reeds (Cleanup)

- Delete local and remote feature branches immediately after a successful merge.
- Keep the workspace free of unused artifacts.

## 6. Secure Leaps (Non-interactive execution)

- Always use non-interactive commands (e.g., `git merge -m "..."`) to prevent process hangs.
- When creating PRs, use `gh pr create` with automated titles and bodies.

---

_Stay green, stay froggy. 🐸_
