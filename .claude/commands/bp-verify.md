# /bp-verify - BrightPearl sync verification

Verify that BrightPearl sync happened correctly for an offer or distributor.

## Usage

- `/bp-verify AX-005 dev2` — check specific offer
- `/bp-verify Airxcel dev2` — check last N synced offers for distributor
- `/bp-verify recent dev2` — show last 10 BP sync events

## Checks to run

### 1. Mapping exists

```sql
SELECT o.sku, d.name as distributor,
       oem.external_mapping_id as bp_product_id,
       oem.source_type, oem.created_at, oem.deleted_at
FROM offer_external_mappings oem
JOIN offers o ON o.id = oem.offer_id
JOIN distributors d ON o.distributor_id = d.id
WHERE oem.source_type = 'brightpearl'
  AND o.sku = '<sku>'   -- or d.name = '<distributor>'
ORDER BY oem.created_at DESC
LIMIT 10;
```

### 2. SKU = friendly_id check

```sql
-- catalog db
SELECT pfi.friendly_id, p.manufacturer_number
FROM product_friendly_ids pfi
JOIN products p ON p.idempotency_key = pfi.product_idempotency_key
WHERE pfi.friendly_id::text = '<sku>';
```

### 3. Output format

```
BP Sync status for <sku> / <distributor>:

  bp_product_id:  <id>         ✅ / ❌ not synced
  source_type:    brightpearl
  synced_at:      <timestamp>
  mapping active: yes / no (deleted_at set)

  SKU = friendly_id: ✅ <friendly_id> / ❌ mismatch (<actual_friendly_id>)
```

If no mapping found — clearly state "not synced to BrightPearl" and check if:

- Feature flag `brightPearlSync.enabled` is on for this env
- Distributor is in `allowedDistributorIdempotencyKeys`
- Offer belongs to Airxcel or Elk Mountain

Now run the verification for what the user provided.
