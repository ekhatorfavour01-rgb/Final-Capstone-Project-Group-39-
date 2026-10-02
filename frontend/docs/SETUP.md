# Local Setup

The application has a Next.js storefront and an Express API backed by MongoDB.

## Backend

1. Start MongoDB locally or use a reachable MongoDB Atlas cluster.
2. In `Backend/`, create an ignored `.env` file with the backend settings:

   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/project39
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

   Keep real database credentials and `JWT_SECRET` out of Git and the frontend.
3. Run `npm ci`, then `npm run dev` from `Backend/`.
4. Check `http://localhost:5001/` for the API health response.

## Frontend

1. In `frontend/`, copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001`. Use the backend origin only; do not append `/api`.
3. Run `pnpm install` and `pnpm dev` from `frontend/`.
4. Open `http://localhost:3000`, create an account, add an available product, and place a demo order with a shipping address.

Without `NEXT_PUBLIC_API_BASE_URL`, the page uses its local demo catalog and cart. Restart the frontend after changing `.env.local`.

## Catalog and pricing

In API mode, MongoDB is the source of truth for the catalog. To insert missing copies of the 40 storefront products into the configured database, run `pnpm run seed:products` from `Backend/`. The repeatable seed generates MongoDB ObjectIds, assigns stock `10` to new catalog records, leaves existing records untouched, and does not delete data. It preserves each product's numeric USD price; the storefront displays prices with `$` and does not convert currencies.

The seed loads `Backend/.env` from its script-relative path. It allows local MongoDB by default. For a remote URI, it refuses to run unless `CONFIRM_REMOTE_PRODUCT_SEED=true` is explicitly set after verifying the database target. Confirm that the URI targets the intended environment before running a remote seed.

Product creation is admin-only at `POST /api/admin/products`; public registration creates a normal customer account. Provision administrator access securely on the backend.

## Audit logs

An administrator can inspect recorded activity with `GET /api/admin/audit-logs?page=1&limit=25` using an admin bearer token. Optional filters include `userId` and an action such as `cart.item_added`. Events are stored in MongoDB's `auditlogs` collection.

## Demo checkout

Checkout creates an order from the user's persisted MongoDB cart. The backend calculates the USD total from product prices and quantities and records the demo order as paid. No payment provider is connected, and no real payment is processed.
