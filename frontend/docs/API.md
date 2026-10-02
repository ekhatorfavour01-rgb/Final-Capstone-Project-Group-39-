# API Documentation

The frontend connects to the separately deployed Express API using `NEXT_PUBLIC_API_BASE_URL` (for example, `http://localhost:5001`). Responses use `{ success, message, data }`.

## Authentication

| Method | Endpoint             | Auth | Body                        | Result             |
| ------ | -------------------- | ---- | --------------------------- | ------------------ |
| POST   | `/api/auth/register` | No   | `{ name, email, password }` | User and JWT token |
| POST   | `/api/auth/login`    | No   | `{ email, password }`       | User and JWT token |

Protected requests send `Authorization: Bearer <token>`. Registration does not allow clients to choose an account role.

## Products

| Method | Endpoint                                       | Auth | Result                     |
| ------ | ---------------------------------------------- | ---- | -------------------------- |
| GET    | `/api/products?search=&category=&page=&limit=` | No   | `{ products, pagination }` |
| GET    | `/api/products/:id`                            | No   | One product                |

Product fields include MongoDB `_id`, `name`, `description`, `price`, `stock`, `category`, and `image`.

## Cart

| Method | Endpoint               | Auth | Body                      |
| ------ | ---------------------- | ---- | ------------------------- |
| GET    | `/api/cart`            | Yes  | —                         |
| POST   | `/api/cart`            | Yes  | `{ productId, quantity }` |
| PATCH  | `/api/cart/:productId` | Yes  | `{ quantity }`            |
| DELETE | `/api/cart/:productId` | Yes  | —                         |
| DELETE | `/api/cart`            | Yes  | Clear cart                |

## Orders

| Method | Endpoint                | Auth | Body                             |
| ------ | ----------------------- | ---- | -------------------------------- |
| POST   | `/api/orders`           | Yes  | `{ shippingAddress }`            |
| GET    | `/api/orders/my-orders` | Yes  | Current user's orders            |
| GET    | `/api/orders/:id`       | Yes  | One of the current user's orders |

The current checkout is a demo only: it creates an order from the server-side cart and the backend marks it `Paid`, but no payment provider or real charge is involved. Do not collect or submit card details through this flow.

## Admin

Admin endpoints are under `/api/admin` and require an admin bearer token. Product creation is `POST /api/admin/products` with `{ name, description, price, stock, category, image? }`; order status updates use `PUT /api/admin/orders/:id/status` with `{ status }`.

| Method | Endpoint                | Query parameters                                                | Result                         |
| ------ | ----------------------- | --------------------------------------------------------------- | ------------------------------ |
| GET    | `/api/admin/audit-logs` | `page`, `limit` (max 100), optional `userId`, optional `action` | Paginated events, newest first |

Audit events are stored in MongoDB's `auditlogs` collection. Successful registration, login, cart add/update/remove/clear, and order creation are recorded. The log stores user/target IDs and limited numeric details; it does not store passwords, JWTs, shipping addresses, or card data. Failed actions are not recorded as successful activity. Audit writes are best-effort: write failures are reported in the backend logs and do not turn a completed user action into an API error.

## Health Check

`GET /` returns `{ success: true, message: "E-commerce API is running" }` and does not require authentication.
