# /s3-csv - S3 operations and CSV format guide

Reference for working with S3 delta buckets and CSV files in Thor-Partfinder pipeline.

---

## CSV Format Rules

**CRITICAL: separator is `;` (semicolon), NOT comma.**
Encoding: UTF-8. Always include header row.

```
field1;field2;field3
value1;value2;value3
```

### action column (required in most CSVs)

- `insert` - create new record
- `update` - update existing
- `delete` - soft delete

### Common gotchas

- JSON fields (categories, assemblies, etc.) must be valid JSON inside the CSV cell
- Double quotes inside JSON strings must be escaped as `""` (CSV escaping)
- Example: `"[{""id"": ""11"", ""nm"": ""Other""}]"`
- Numeric prices — in cents as integer (e.g. `1500` = $15.00)
- Empty fields — just leave blank between semicolons: `val1;;val3`

---

## S3 Buckets

| Env   | Delta bucket           | Export sources bucket           |
| ----- | ---------------------- | ------------------------------- |
| dev2  | partfinder-dev2-delta  | partfinder-dev2-export-sources  |
| stage | partfinder-stage-delta | partfinder-stage-export-sources |
| prod  | partfinder-prod-delta  | partfinder-prod-export-sources  |

**Distributor CSV path:** `s3://partfinder-{env}-delta/distributors/<Distributor Name>/`
**Other paths:** `s3://partfinder-{env}-delta/user/`, `s3://partfinder-{env}-delta/company/`

---

## AWS CLI Setup

```bash
# dev2
export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID_DEV2>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY_DEV2>
export AWS_DEFAULT_REGION=us-east-2

# stage
export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID_STAGE>
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY_STAGE>
export AWS_DEFAULT_REGION=us-east-2
```

Or inline per command:

```bash
AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_DEFAULT_REGION=us-east-2 aws s3 ...
```

---

## Common S3 Operations

### Upload CSV to trigger pipeline

```bash
aws s3 cp local_file.csv \
  "s3://partfinder-dev2-delta/distributors/Airxcel/airxcel_$(date +%Y%m%d_%H%M%S).csv"
```

> Filename must be unique — append timestamp to avoid collisions.

### List files in bucket path

```bash
aws s3 ls "s3://partfinder-dev2-delta/distributors/Airxcel/" | tail -10
```

### Download file

```bash
aws s3 cp "s3://partfinder-dev2-delta/distributors/Airxcel/filename.csv" ./local.csv
```

### Read file content directly (without downloading)

```bash
aws s3 cp "s3://partfinder-dev2-delta/distributors/Airxcel/filename.csv" -
```

### S3 Select — search inside large CSV without downloading

```bash
aws s3api select-object-content \
  --bucket partfinder-dev2-export-sources \
  --key "artifacts/Keystone/filename.csv" \
  --expression "SELECT * FROM S3Object s WHERE s._2 = '77058'" \
  --expression-type SQL \
  --input-serialization '{"CSV": {"FileHeaderInfo": "NONE", "FieldDelimiter": ";"}}' \
  --output-serialization '{"CSV": {}}' /dev/stdout
```

> `FileHeaderInfo: NONE` = columns are `_1`, `_2`, etc.
> `FileHeaderInfo: USE` = columns by header name.

### List all files recursively (search across distributor)

```bash
aws s3 ls "s3://partfinder-dev2-delta/distributors/" --recursive | grep -i "airxcel"
```

---

## Pipeline flow after CSV upload

```
Upload CSV to S3
    ↓ SNS notification (~immediate)
    ↓ Importer picks up file
    ↓ Parses rows, publishes Kafka events
    ↓ Target service consumes (Catalog / Marketplace / Users)
    ↓ Writes to DB

Wait: ~30-60 sec after upload before checking DB
```

### Verify import happened

```sql
-- Check offers appeared (marketplace db)
SELECT o.sku, o.deleted_at, d.name
FROM offers o
JOIN distributors d ON o.distributor_id = d.id
WHERE d.name = 'Airxcel'
  AND o.sku IN ('<sku1>', '<sku2>')
ORDER BY o.created_at DESC;
```

---

## Distributor CSV structure (offers)

Minimal required columns:

```
offer_id;offer_sku;manufacturer_number;name;other_manufacturer_numbers;categories;
documents;assemblies;assembly_parts;type;barcode;inventory;
original_manufacturer_number;original_manufacturer_name;original_offer_name;
other_manufacturer_numbers;description;image_urls;
offer_price_dealer;offer_price_retail;manufacturer_id;manufacturer_name;action
```

Extended (Elk Mountain / Airxcel) — additional columns:

```
sell_if_no_stock_b2b;sell_if_no_stock_b2c;dimensions;allow_b2c;b2c_price_override
```

> Always check an existing real CSV from the same distributor before creating a test one.
> Column set can differ between distributors.

---

Now help the user with whatever S3 or CSV task they need.
