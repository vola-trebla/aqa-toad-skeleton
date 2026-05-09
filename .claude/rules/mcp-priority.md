# Tool Priority & MCP Usage (Thor-Partfinder)

To conserve context tokens and ensure data integrity, always prefer specialized MCP tools over manual `curl` or `git` commands when interacting with external services.

## 📊 Jira (Jira MCP Server)

When the user provides a Jira key (e.g., `TAE-123`, `TRP-456`) or asks about ticket status/comments:

1. **Never use a browser:** Do not attempt to open Jira in a browser or via Playwright.
2. **Prefer MCP:** Always use `mcp_jira_get_issue` or `mcp_jira_get_comments` as the primary tool.
3. **Fallback to curl:** Only use manual `curl` if the specific action is not available in MCP. Credentials are in `SDET/credentials/CREDENTIALS.md`.

## 🐙 GitHub (GitHub MCP Server)

When the user asks to create branches, PRs, or search code:

1. **Prefer MCP:** Use `mcp_github_create_branch`, `mcp_github_create_pull_request`, etc.
2. **Context:** Use `mcp_github_search_code` for cross-repo lookups to avoid filling context with unrelated file contents.
3. **Branch Naming:** Follow the pattern `feature/[TASK-ID]-[slug]` as defined in `CLAUDE.md`.

## 🛡️ Rationale

Manual `curl` calls return raw JSON which bloats the context window and increases the risk of hallucination. MCP tools return structured, filtered data that is easier for the model to process accurately.
