# /shopify-connector - Shopify Connector sync verification guide

Reference guide for manually verifying Shopify Connector sync in any scenario.
Use this when you need to check that an action in our admin panel correctly synced to Shopify.

---

## How the sync works

```
Admin action (GraphQL mutation)
    ↓
Shopify Connector picks up event (Kafka)
    ↓
Shopify Admin API call (create/update/delete)
    ↓
Verify in Shopify Admin API + our DB
```

Sync is async — after triggering an action, wait ~15-30 sec before checking.

---

## Credentials

> Exact creds TBD — clarify with team when needed. General structure below.

### Our GraphQL Admin API

Two roles available:

- **platform_admin** — full access, can manage orgs, companies, offers, users
- **company_admin** — scoped to one company

Auth flow (same for all envs):

```bash
# Step 1: get JWT
curl -s -X POST "https://<gateway>/graphql" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <key>" \
  -d '{"query": "mutation { login(companyId: <id>, login: \"<user>\", password: \"<pass>\") { userTokens { accessToken } } }"}'

# Step 2: use token
# Regular mutations: POST /graphql
# Admin mutations:   POST /graphql/admin
-H "Authorization: Bearer <token>"
-H "x-company-id: <company_id>"
```

See CLAUDE.md for dev2/stage credentials.

### Shopify Admin API

```bash
# Endpoint
POST https://<store>.myshopify.com/admin/api/2024-01/graphql.json

# Header
X-Shopify-Access-Token: <SHOPIFY_TOKEN>

# Tokens per env (from CLAUDE.md):
# dev1/dev2: <SHOPIFY_TOKEN_DEV> (store: <STORE_DEV>)
# stage:     <SHOPIFY_TOKEN_STAGE> (store: <STORE_STAGE>)
```

---

## Key entities and how they map

| Our system              | Shopify                                         |
| ----------------------- | ----------------------------------------------- |
| Organization            | Company (`externalId` = our org ID)             |
| Company (linked to org) | CompanyLocation (`externalId` = our company ID) |
| User                    | Customer + CompanyContact                       |
| Order                   | Order / DraftOrder                              |

---

## Verification patterns

### Check if org synced to Shopify as Company

```graphql
# Shopify Admin API
query {
  companies(first: 5, query: "external_id:<our_org_id>") {
    nodes {
      id
      name
      externalId
      locationsCount {
        count
      }
    }
  }
}
```

### Check if company location synced

```graphql
# Shopify Admin API — find location inside company
query {
  companies(first: 5, query: "external_id:<our_org_id>") {
    nodes {
      locations(first: 50) {
        nodes {
          id
          name
          externalId # should match our company ID
        }
      }
    }
  }
}
```

### Check user synced as Shopify customer

```graphql
# Shopify Admin API
query {
  customers(first: 5, query: "email:<user_email>") {
    nodes {
      id
      firstName
      lastName
      email
      state
    }
  }
}
```

### Check offer synced as Shopify product variant

```graphql
# Shopify Admin API
query {
  productVariants(first: 5, query: "sku:<offer_sku>") {
    nodes {
      id
      sku
      title
      product {
        id
        title
      }
    }
  }
}
```

---

## Our DB checks (marketplace DB)

### Organization exists

```sql
SELECT id, name, idempotency_key, deleted_at
FROM organizations
WHERE name LIKE '%<search>%';
```

### Company linked to org

```sql
SELECT c.id, c.name, c.code, oc.organization_id
FROM companies c
JOIN organization_companies oc ON oc.company_id = c.id
WHERE oc.organization_id = '<org_id>';
```

### Shopify external mapping for offer

```sql
SELECT oem.source_type, oem.external_mapping_id, oem.created_at
FROM offer_external_mappings oem
JOIN offers o ON o.id = oem.offer_id
WHERE o.sku = '<sku>' AND oem.source_type = 'shopify';
```

---

## Typical verification flow

1. **Trigger action** via GraphQL mutation (create org, update name, link company, etc.)
2. **Note the ID** returned from mutation
3. **Wait ~30 sec** for async sync
4. **Check Shopify** via Admin API query using `externalId`
5. **Check our DB** if needed (mappings, status)

---

## If sync didn't happen — where to look

- Shopify Connector logs: `kubectl logs -f deployment/thor-partfinder-shopify-connector -n <env>`
- Check feature flags in App Configs (`Thor-Partfinder-App-Configs/shopify-connector/<env>.yml`)
- Check `allowedDistributors` config if offer-related
- Verify the action actually triggered a Kafka event (check Fulfillment/Connector logs)

---

## Reference: existing automated tests

`Thor-Partfinder-API-Autotests/connector/tests/` — 3 tests already cover:

- `test_create_org_syncs_to_shopify` — org creation → Shopify Company
- `test_company_linked_creates_shopify_location` — link company → Shopify Location
- `test_update_org_name_syncs_to_shopify` — name update → Shopify Company name

Use these as reference for query/mutation patterns when building new checks.
