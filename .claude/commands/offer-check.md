# /offer-check - Full offer status check

Look up an offer by SKU or offer_id and show its full status across all relevant systems.

## Usage

User writes `/offer-check AX-005 dev2` or `/offer-check efe5ee89-... dev2`

## What to check

Run all queries against the specified env (default: dev2). Show results in a compact table or bullet list.

### 1. Marketplace DB — offer status
```sql
SELECT o.id, o.sku, o.idempotency_key, o.deleted_at,
       o.original_name, o.original_manufacturer_number,
       d.name as distributor
FROM offers o
JOIN distributors d ON o.distributor_id = d.id
WHERE o.sku = '<sku>'   -- or o.id = '<offer_id>'
ORDER BY o.created_at DESC;
```

### 2. External mappings (Shopify, BrightPearl)
```sql
SELECT oem.source_type, oem.external_mapping_id, oem.created_at, oem.deleted_at
FROM offer_external_mappings oem
WHERE oem.offer_id = '<offer_id>';
```

### 3. Catalog DB — linked product + friendly_id
```sql
-- Connect via same tunnel, db=catalog
SELECT p.idempotency_key, p.manufacturer_number, pfi.friendly_id
FROM products p
JOIN product_friendly_ids pfi ON pfi.product_idempotency_key = p.idempotency_key
WHERE p.manufacturer_number = '<original_manufacturer_number>';
```

### 4. Summary output format

```
Offer: <sku> | <distributor> | <active/deleted>
  name:        <original_name>
  mfr number:  <original_manufacturer_number>
  offer_id:    <uuid>

Product (catalog):
  friendly_id: <friendly_id>
  product_idk: <uuid>

External mappings:
  shopify:     <external_mapping_id> | <active/deleted>
  brightpearl: <external_mapping_id> | <active/deleted>  ← or "not synced"
```

If offer not found — say so clearly and suggest checking deleted_at IS NOT NULL.

Now run the check for the sku/id and env the user provided.
