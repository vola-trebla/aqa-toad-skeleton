# Database SSH tunnels (Thor-Partfinder)

When any task needs PostgreSQL on dev1 / dev2 / stage / prod and the connection to `127.0.0.1` on the mapped port fails (`Connection refused`, `server closed the connection unexpectedly`), **do not** end with “tunnel is down” as the final outcome.

1. **Check** which tunnel should be active: `lsof -i :15431,15432,15433,15434` (ports from `CLAUDE.md`).
2. **If the needed port is not listening**, bring up the tunnel for that environment using the exact `ssh -f -N -L ...` command from `CLAUDE.md`, after `chmod 600` on the matching key under `SDET/AQA/db-access/keys/`.
3. **Retry** the SQL or connection once the tunnel is listening.
4. Only if `ssh` fails (auth, host unreachable), report that and suggest checking VPN/bastion access.

Remember: marketplace data (e.g. `offers`, `map_prices`) is often in the **`marketplace`** database, not `catalog` - use the correct DB name when connecting through the tunnel.
