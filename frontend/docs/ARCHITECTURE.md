# Architecture

## Overview

The application has two separately deployed services:

- `frontend/` is a Next.js/React storefront. `lib/api.ts` sends browser requests to the backend origin configured by `NEXT_PUBLIC_API_BASE_URL`.
- `Backend/` is an Express API using Mongoose and MongoDB. Its routes are mounted under `/api`; its root route is a health check.

The frontend can run without the API URL using its local demo catalog. API mode loads products and uses MongoDB IDs, bearer-token authentication, and a persistent server-side cart.

## Request Flow

1. The storefront requests `GET /api/products` for the catalog.
2. Registration or login returns a JWT. The frontend sends it in `Authorization: Bearer <token>` for protected requests.
3. Cart reads and changes use `/api/cart` and `/api/cart/:productId`.
4. Checkout sends `{ shippingAddress }` to `POST /api/orders`. The backend creates an order from the authenticated user's cart, updates stock, and clears the cart.

## Deployment Configuration

The frontend needs only the public backend origin in `NEXT_PUBLIC_API_BASE_URL`. The backend separately needs `MONGO_URI`, `JWT_SECRET`, `PORT`, and a production `CORS_ORIGIN` matching the frontend origin. Never put database credentials or the JWT signing secret in the frontend.

The current order flow is a demo, not a payment integration: order creation sets `paymentStatus` to `Paid`, but no provider processes or verifies money.
