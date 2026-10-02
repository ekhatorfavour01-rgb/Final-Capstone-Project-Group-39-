# Database

## Source of truth

The production application uses MongoDB through Mongoose in `Backend/`. The backend database is the source of truth for products, carts, and orders. In API mode, the storefront loads products from `GET /api/products`; it does not merge those records with the frontend demo catalog. The demo catalog is used only when the API URL is not configured.

## Collections

| Collection | Purpose |
| --- | --- |
| `users` | Customer and administrator accounts; passwords are stored as hashes. |
| `products` | Product details, including brand, category, price, stock, and storefront metadata. |
| `carts` | One persisted cart per user, with product ObjectIds and quantities. |
| `orders` | Completed demo orders with item snapshots, `totalAmount`, status, and shipping address. |
| `auditlogs` | Limited activity events for account, cart, and order actions. |

The corresponding Mongoose models are in `Backend/Models/`. Order line items are embedded snapshots, so the order retains the product name, unit price, and quantity used at checkout. Product and order identifiers are MongoDB ObjectIds.

## Prices

Product `price` and optional `oldPrice` values are numeric USD amounts. The application preserves those numbers and displays them with `$`; it performs no currency conversion. Order totals are calculated by the backend from the authenticated user's persisted cart and saved as `totalAmount` in USD.

## Product catalog seed

The 40 storefront catalog records live in `Backend/data/productCatalog.js`. From `Backend/`, run `pnpm run seed:products` to insert missing products. MongoDB generates ObjectIds, and missing catalog products receive stock `10`. The seed matches records by name and uses insert-only upserts, so rerunning it does not duplicate catalog records or overwrite existing products.

The seed loads `Backend/.env` relative to its own script location. It permits local MongoDB by default and refuses remote database URIs unless `CONFIRM_REMOTE_PRODUCT_SEED=true` is explicitly set after verifying the target. It never deletes existing products.

## Demo mode

When `NEXT_PUBLIC_API_BASE_URL` is unset, the storefront uses its local demo catalog and in-memory cart. This data is not persisted to MongoDB. When the API URL is configured, catalog, cart, and orders use the backend and MongoDB IDs.
