# /schema - DB schema reference

Quick lookup of tables and columns. Use when writing SQL queries.

## Usage

`/schema` - show all tables grouped by DB
`/schema offers` - show columns for a specific table
`/schema marketplace` - show all tables in a DB

---

## Databases per environment

| DB | dev1 | dev2 | stage | prod |
|----|------|------|-------|------|
| catalog | + | + | + | + (read-only) |
| marketplace | + | + | + | + (read-only) |
| users | + | + | + | + (read-only) |
| oem | + | + | + | ? |
| fulfillment | + (3 tables) | + (empty) | ? | ? |
| shopify_connector | + (empty) | + (empty) | ? | ? |

Schema is identical across envs unless noted. Differences below.

---

## catalog DB

| Table | Key columns |
|-------|-------------|
| **products** | id, idempotency_key(uuid), manufacturer_id, manufacturer_number, name, description, product_type_id, barcode, source_weight, deleted_at, b2c_available, original_manufacturer_number, default_shipping_method, slug |
| **product_friendly_ids** | id, product_idempotency_key(uuid), friendly_id(bigint) |
| **product_images** | id, product_id, url, type, alt_text, sort_order |
| **product_categories** | category_id, product_id |
| **product_documents** | product_id, document_id, sort |
| **product_manufacturer_numbers** | id, product_id, number |
| **product_properties** | product_id, property_id, value |
| **product_types** | id, idempotency_key, name |
| **manufacturers** | id, idempotency_key, name, slug, info, external_id |
| **original_manufacturer_names** | id, idempotency_key, original_name, manufacturer_id, source, status, status_updated_at |
| **categories** | id, idempotency_key, name, sort, parent_id, slug, external_parent_id, is_active |
| **assemblies** | id, product_id, name, description, sort, idempotency_key |
| **assembly_parts** | id, parent_assembly_id, assembly_id, product_id, description, reference_number, quantity, sort, idempotency_key |
| **assembly_images** | id, assembly_id, url, type, description |
| **documents** | id, manufacturer_id, url, title, idempotency_key, description, deleted_at |
| **document_categories** | id, idempotency_key, name, slug, parent_id, description |
| **document_document_category** | category_id, document_id |
| **admin_product_notes** | id, product_id, note_text |
| **assembly_part_admin_notes** | id, external_id, assembly_part_id, note_text |
| **user_product_notes** | id, external_id, company_idempotency_key, user_idempotency_key, product_id, note_text, deleted_at |
| **properties** | id, name, type, measurement_unit_id |
| **measurement_units** | id, name, short_name |
| **superseding_parts** | old_product_id, new_product_id |

---

## marketplace DB

| Table | Key columns |
|-------|-------------|
| **offers** | id, idempotency_key, sku, distributor_id, product_idempotency_key, catalog_page, original_name, original_manufacturer_number, original_manufacturer_name, is_b2c, deleted_at, sell_if_no_stock_b2b, sell_if_no_stock_b2c, b2c_available, b2b_available, b2c_price_override, allow_b2c |
| **offer_external_mappings** | id, offer_id, external_mapping_id, source_type, deleted_at |
| **offer_external_ids** | id, offer_id, external_id, source_type *(dev2 only, not on dev1/prod)* |
| **distributors** | id, idempotency_key, name, email, website, offers_free_shipping, color, is_active, deleted_at, always_show_to_all, phone_number, fax, address, city, state, zip_code, display_name |
| **prices** | id, offer_id, price_type_id, amount(int, cents), deleted_at |
| **price_types** | id, external_id, name, idempotency_key |
| **price_lists** | id, name, idempotency_key, distributor_id, deleted_at |
| **price_list_prices** | id, price_list_id, offer_id, price_type_id, amount, idempotency_key, deleted_at |
| **company_price_lists** | id, price_list_id, company_id, idempotency_key, deleted_at |
| **company_markups** | id, company_id, price_from, price_to, markup(real), price_type_id, idempotency_key, markup_type, deleted_at |
| **company_markup_settings** | company_id, markup_type, deleted_at |
| **distributor_preferences** | id, distributor_id, company_id, is_enabled, sort_level, idempotency_key, deleted_at, always_enabled |
| **org_distributor_preferences** | id, distributor_id, company_id, is_enabled, sort_level, idempotency_key, account_number, contact_person, notes, phone_number, email, website, fax, address, city, state, zip_code |
| **distributor_companies** | id, distributor_id, company_id, external_id, deleted_at |
| **distributor_organizations** | id, distributor_id, organization_id, external_id, deleted_at |
| **inventory** | id, warehouse_id, product_idempotency_key, quantity, deleted_at |
| **warehouses** | id, external_id, distributor_id, name, location, deleted_at |
| **map_prices** | id, product_idempotency_key, amount *(not on prod)* |
| **b2c_price_overrides** | id, product_idempotency_key, amount |
| **product_b2c_blacklist** | product_idempotency_key |

---

## users DB

| Table | Key columns |
|-------|-------------|
| **users** | id, external_id, company_id, first_name, last_name, username, email, password_hash, is_active, deleted_at |
| **companies** | id, external_id, name, is_active, company_code, type, organization_id, meyer_address_code, enable_cost, enable_markup_recommended_retail_price, enable_stock_check |
| **organizations** | id, name, deleted_at, meyer_customer_number |
| **user_companies** | user_id, company_id |
| **company_details** | id, company_id, first_name, last_name, phone, email, country, state, city, zip_code, address, time_zone, hourly_shop_labor_rate, website, fax |
| **company_administrators** | company_id, user_id |
| **platform_administrators** | user_id |
| **company_user_settings** | id, user_id, hide_cost, cart_enabled |
| **subscriptions** | id, external_id, company_id, name, is_active, type |
| **allowed_companies** | id, company_code, is_active |
| **refresh_tokens** | id, user_id, token_hash, issued_at, expires_at |

---

## oem DB

| Table | Key columns |
|-------|-------------|
| **oems** | id, name, idempotency_key, deleted_at |
| **makes** | id, oem_id, name, idempotency_key, deleted_at |
| **models** | id, make_id, name, is_active, idempotency_key, deleted_at |
| **rv_classes** | id, external_id, name, idempotency_key, deleted_at |
| **rv_types** | id, rv_class_id, model_id, year, is_active, idempotency_key, deleted_at |
| **rv_type_products** | id, rv_type_id, is_original, product_idempotency_key, deleted_at |
| **rv_type_vins** | rv_type_id, vin, idempotency_key, deleted_at |

---

## fulfillment DB

| Table | Key columns |
|-------|-------------|
| **order_mappings** | id, shopify_order_id, external_ordering_system_type, external_ordering_system_id, status, total_price, external_customer_id |
| **order_line_items** | id, order_mapping_id, shopify_product_variant_id, sku, quantity, fulfilled_quantity |
| **sent_fulfillment_parts** | id, order_mapping_id, external_id |

---

## Gotchas (common mistakes)

**Wrong DB:**
- offers -> **marketplace** (not catalog)
- products -> **catalog** (not marketplace)
- organizations, companies, users -> **users** (not marketplace)

**Wrong column names:**
- users.companies has `company_code` (not `code`)
- users.companies has `is_active` (not `deleted_at`)
- users.organizations has NO `idempotency_key`
- marketplace table is `offer_external_mappings` (not offer**s**_external_mappings)

**Types:**
- prices.amount is integer (cents, not dollars)
- product_friendly_ids.friendly_id is bigint
- product_friendly_ids.product_idempotency_key is uuid -> joins to products.idempotency_key

**Env differences:**
- `offer_external_ids` - dev2 only (not on dev1/prod)
- `map_prices` - not on prod
- fulfillment tables - only populated on dev1
- stage creds differ from dev2 (need clarification)

---

Now answer the user's schema question, or if no question, show the relevant section.
