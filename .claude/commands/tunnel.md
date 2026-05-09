# /tunnel - Check and bring up SSH DB tunnel

Check if the requested tunnel is active. If not — bring it up automatically.

## Usage

User writes `/tunnel dev2` or `/tunnel stage` etc.

## Logic

1. Run `lsof -i :<port>` for the requested env
2. If active — confirm and done
3. If not active — `chmod 600` the key, run the SSH command, verify it came up

## Env map

| Env   | Port  | RDS Host       | Key            | Bastion        |
|-------|-------|----------------|----------------|----------------|
| dev1  | 15431 | <RDS_HOST_1>   | <SSH_KEY_1>    | <BASTION_1>    |
| dev2  | 15433 | <RDS_HOST_2>   | <SSH_KEY_2>    | <BASTION_2>    |
| stage | 15432 | <RDS_HOST_3>   | <SSH_KEY_3>    | <BASTION_3>    |
| prod  | 15434 | <RDS_HOST_4>   | <SSH_KEY_4>    | <BASTION_4>    |

## DB Credentials

| Env        | User       | Password       | Databases                      |
|------------|------------|----------------|--------------------------------|
| dev2/stage | <DB_USER>  | <DB_PASSWORD>  | catalog, marketplace, users... |
| prod       | <DB_USER_P>| <DB_PASSWORD_P>| catalog (read-only)            |

## After bringing up tunnel

Confirm with a quick `psql` ping:
```bash
PGPASSWORD='<pass>' psql -h 127.0.0.1 -p <port> -U <user> -d catalog -c "SELECT 1;"
```

Now execute the tunnel check/setup for the env the user requested.
