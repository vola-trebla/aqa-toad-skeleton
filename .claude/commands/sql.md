# /sql - Quick DB query

Run a SQL query against any env. Handles tunnel check automatically.

## Usage

`/sql <env> <db> <query>` or `/sql <env> <db>` (then user provides query next)

Examples:
- `/sql dev2 marketplace SELECT * FROM offers WHERE sku = 'AX-005' LIMIT 5`
- `/sql stage catalog SELECT COUNT(*) FROM products WHERE deleted_at IS NULL`
- `/sql prod catalog` (then wait for query)

## Logic

1. Resolve env from arg (dev1/dev2/stage/prod) - creds from CLAUDE.md DB Credentials table
2. Check tunnel via `lsof -i :<port>` - if missing, bring it up with `/tunnel` logic
3. Run query via `psql`:
   ```bash
   PGPASSWORD='<pass>' psql -h 127.0.0.1 -p <port> -U <user> -d <db> -c "<query>"
   ```
4. Display results
5. If query not provided - ask user for it

## Rules

- prod is READ-ONLY. Reject any INSERT/UPDATE/DELETE/DROP/TRUNCATE/ALTER.
- Default db: marketplace (if not specified)
- For multi-line or complex queries, user can provide them after the command
- Keep output compact - if result is huge, suggest adding LIMIT

Now execute the query for the env/db/query the user provided.
