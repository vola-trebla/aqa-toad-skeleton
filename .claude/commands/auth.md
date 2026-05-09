# /auth - Get JWT token for env

Authenticate against GraphQL API and return a ready-to-use Bearer token.

## Usage

`/auth <env>` - default platform_admin credentials
`/auth <env> <login> <password>` - custom credentials

Examples:
- `/auth dev2`
- `/auth stage`
- `/auth dev2 Rachel 4Rachel@QCo`

## Logic
1. Resolve env - gateway URL, x-api-key, company_id, login, password from CLAUDE.md tables.
2. **Prefer MCP (if Jira/GitHub context exists):** If the user is asking in the context of a Jira ticket, use the MCP Jira tools first to verify deployment status.
3. Run login mutation:
   ```bash
   # Use MCP for GraphQL if available, or fallback to curl:
   curl -s -X POST "https://<gateway>/graphql" \
...
     -H "Content-Type: application/json" \
     -H "x-api-key: <key>" \
     -d '{"query": "mutation { login(companyId: <id>, login: \"<login>\", password: \"<pass>\") { userTokens { accessToken refreshToken } } }"}'
   ```
3. Extract accessToken from response
4. Display token and ready-to-paste headers:
   ```
   Token: eyJ...

   Headers:
   -H "Authorization: Bearer eyJ..."
   -H "x-company-id: <company_id>"
   ```

## Rules

- If login fails - show error, suggest checking credentials
- Token is valid ~15 min - mention this
- For admin mutations remind: use /graphql/admin endpoint

Now get the token for the env the user specified.
