# /os-search - OpenSearch quick search

Search products or offers in OpenSearch index.

## Usage

`/os-search <index> <query>` - search by keyword/SKU/ID
`/os-search product <manufacturer_number or name>`
`/os-search offer <sku>`
`/os-search id <uuid>` - direct document lookup

Examples:

- `/os-search product 77058`
- `/os-search offer AX-005`
- `/os-search id 81d04eba-5c92-5cb2-89a3-a42a3ecec2ee`

## OpenSearch credentials (dev1)

- URL: `<OPENSEARCH_URL>`
- Access Key: `<OS_ACCESS_KEY>`
- Secret Key: `<OS_SECRET_KEY>`

## Logic

### Direct ID lookup

```bash
curl -s --aws-sigv4 "aws:amz:us-east-2:es" \
  --user "<access_key>:<secret_key>" \
  "https://<url>/products_index/_doc/<uuid>?pretty"
```

### Search by field

```bash
curl -s --aws-sigv4 "aws:amz:us-east-2:es" \
  --user "<access_key>:<secret_key>" \
  -H "Content-Type: application/json" \
  "https://<url>/<index>/_search?pretty" \
  -d '{
    "size": 5,
    "query": {
      "multi_match": {
        "query": "<search_term>",
        "fields": ["manufacturer_number", "name", "sku", "idempotency_key"]
      }
    }
  }'
```

### Indices

- `products_index` - products (search by name, manufacturer_number, idempotency_key)
- `offers_index` - offers (search by sku, offer_id)

## Rules

- Only dev1 OpenSearch available currently
- Show key fields from hits: id, name/sku, manufacturer_number, idempotency_key
- If no results - suggest checking spelling or trying DB directly
- Keep output compact - show top 5 hits max

Now execute the search.
