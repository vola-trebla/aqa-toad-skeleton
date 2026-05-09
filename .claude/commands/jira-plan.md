# /jira-plan - QA Test Plan from Jira Ticket

You are a senior SDET on Thor-Partfinder. Fetch the Jira ticket provided by the user, read the AC, understand the feature, and produce a concrete QA test plan ready to execute.

## Input

User provides a ticket key (e.g. `TRP-12345`). 

## Step 0 - Fetch Issue & Dev Status

1. **Fetch Issue:** Use `mcp_jira_get_issue` to get the summary, description, and acceptance criteria.
2. **Fetch Dev Status:** Use `mcp_jira_get_dev_status` (if available) or the Jira REST API to find linked PRs:

```bash
# Fallback if MCP is not available for dev-status:
ISSUE_ID=$(mcp_jira_get_issue --issueKey <KEY> | jq -r '.id')
...

From the response extract for each PR:
- `repositoryName` - which service/repo
- `source.branch` - feature branch
- `destination.branch` - target branch (develop / staging / main)
- `status` - OPEN / MERGED
- `lastUpdate` - when merged

Then map target branch → environment:

| Target branch | Likely env |
|---------------|------------|
| `develop`     | dev2       |
| `staging`     | stage      |
| `main` / `master` | prod   |

If status is OPEN - flag as blocker (PR not merged yet).
If multiple PRs across multiple repos - list all of them; the plan may need to verify several services.

Include this in the **Environment** section of the plan as:
- Repo(s) and PR(s): `#N - status - merged into branch`
- Recommended env derived from target branch

## What to produce

A ready-to-execute test plan. Not theory — concrete steps with real data, real queries, real API calls based on what you know about the project (envs, DBs, GraphQL endpoints, S3 paths).

## Structure

```
## Test Plan — TRP-XXXXX: <title>

### What's being tested
(1-3 sentences: feature summary in plain language)

### Environment
- Recommended env and why
- Prerequisites (tunnels, feature flags, test data, deployments needed)

### Test Cases

#### TC-1: <scenario name>
**Goal:** what this checks
**Steps:**
1. ...
2. ...
**Expected:** what should happen
**Verify:** SQL / GraphQL / S3 check to confirm

#### TC-2: ...

### Edge cases to consider
(bullet list of non-obvious scenarios worth checking — data boundaries, concurrency, missing data, wrong distributor, etc.)

### Out of scope
(what's explicitly NOT tested and why)
```

## Rules

- Base test cases directly on AC — one AC can produce one or more TCs
- Use real env details: correct DB names (`marketplace`, `catalog`, etc.), real S3 paths, real GraphQL endpoints from CLAUDE.md
- For DB checks — write actual SQL snippets
- For GraphQL — write actual mutation/query skeletons
- If test data needs to be found first — include a SQL to find it
- Flag any missing prerequisites (feature flag off, PR not merged, no test data) as blockers upfront
- If AC is vague or contradictory — flag it as a question before writing the plan
- Keep steps short and actionable — no narration, just what to do

## Style

- English for the plan output
- Code blocks for SQL, GraphQL, shell commands
- Terse and direct — this is a working document, not a report

---

Now fetch the ticket the user provided and generate the test plan.
