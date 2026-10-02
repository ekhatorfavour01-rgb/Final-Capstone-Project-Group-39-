# Backend API

Express and MongoDB API for the Project 39 e-commerce application.

## Run locally

Install dependencies from this directory:

```bash
npm ci
```

Create a local `.env` file in `Backend/` (it is ignored by Git):

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/project39
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

Use a private, randomly generated value for `JWT_SECRET`. Never commit `.env` or share its secret. `CORS_ORIGIN` is the browser frontend origin; comma-separated origins are supported. Ensure MongoDB Community Server is installed and running locally, then start the API:

```bash
npm run dev
```

With the example `.env`, the API base URL is `http://localhost:5001`. The health check is `GET http://localhost:5001/`. If you change `PORT`, use that port instead.

## Seed the product catalog

From `Backend/`, run `npm run seed:products` to insert any missing records from `data/productCatalog.js`. The seed matches by product name and brand, sets stock to `10`, omits mock numeric IDs, and never overwrites or deletes existing records. It preserves the catalog USD prices exactly. Remote MongoDB URIs are refused unless `CONFIRM_REMOTE_PRODUCT_SEED=true` is explicitly set after verifying `MONGO_URI` targets the intended database. The seed preserves existing products such as Classic Black T-Shirt.

## Authentication and user-account endpoints

All API responses use this shape:

```json
{
    "success": true,
    "message": "A description of the result.",
    "data": {}
}
```

| Test                       | Method  | Endpoint             | Auth required | Expected behavior                                                                                                                  |
| -------------------------- | ------- | -------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| API health                 | `GET`   | `/`                  | No            | Returns `200` when the API is running.                                                                                             |
| Register                   | `POST`  | `/api/auth/register` | No            | Valid details create an account and return `201`, a user, and a JWT.                                                               |
| Duplicate registration     | `POST`  | `/api/auth/register` | No            | Reusing an email returns `409 Conflict`.                                                                                           |
| Invalid registration       | `POST`  | `/api/auth/register` | No            | Invalid email, short name/password, missing fields, or unsupported properties are rejected with `400`. A caller cannot set `role`. |
| Login                      | `POST`  | `/api/auth/login`    | No            | Valid credentials return `200`, a user, and a JWT.                                                                                 |
| Invalid login              | `POST`  | `/api/auth/login`    | No            | Unknown email or incorrect password returns `401` with the same generic message.                                                   |
| Read profile               | `GET`   | `/api/users/me`      | Yes           | Returns the authenticated user's profile. The response does not include a password.                                                |
| Read profile without token | `GET`   | `/api/users/me`      | No token      | Returns `401 Unauthorized`.                                                                                                        |
| Update profile             | `PATCH` | `/api/users/me`      | Yes           | Updates the authenticated user's `name`, `email`, or both.                                                                         |
| Invalid profile update     | `PATCH` | `/api/users/me`      | Yes           | Empty body, invalid name/email, or unsupported fields are rejected with `400`.                                                     |
| Attempt to change role     | `PATCH` | `/api/users/me`      | Yes           | A body containing `role` is rejected; profile updates cannot grant admin access.                                                   |

### Postman setup

For register, login, and profile-update requests:

1. Select **Body → raw → JSON**.
2. Use the JSON request bodies below.
3. For profile endpoints, select **Authorization → Bearer Token** and paste the token returned by registration or login.

Registration body:

```json
{
    "name": "Alex Example",
    "email": "alex@example.com",
    "password": "a-password-with-at-least-8-characters"
}
```

Login body:

```json
{
    "email": "alex@example.com",
    "password": "a-password-with-at-least-8-characters"
}
```

Profile-update body:

```json
{
    "name": "Alex Updated"
}
```

The API parses JSON and `application/x-www-form-urlencoded` request bodies. In Postman, do not put profile fields in **Params**. For JSON requests, ensure the request uses `Content-Type: application/json`; multipart form-data is not supported by these endpoints.

## Security and account behavior

- Passwords are hashed with bcrypt before storage and are excluded from serialized user responses.
- Passwords are selected explicitly only for login verification.
- JWT-protected requests verify the token and confirm the user still exists.
- Public registration creates a standard `user`; profile updates cannot change `role` or `password`.
- Profile access is scoped to the authenticated account (`/api/users/me`).

## Automated and live checks

Run the backend unit tests from this directory:

```bash
npm test
```

The authentication tests cover validation, registration/login behavior, user model defaults, password-field privacy, and JWT middleware. The implementation was also exercised against a local MongoDB instance with live requests for registration, login, reading/updating the profile, rejecting missing authorization, and rejecting role escalation. Temporary integration-test accounts were removed after those checks.

## Implemented scope and current limitations

Authentication, user, product, cart, order, and admin routes are mounted in `app.js`. The frontend can use the public product routes, bearer-token cart routes, and authenticated order routes described in `frontend/docs/API.md`.

Checkout currently creates an order and marks its payment status `Paid` for demo purposes. No payment provider processes or verifies a charge. Do not use this behavior for real payments. In production, set `CORS_ORIGIN` to the deployed frontend origin(s); when `NODE_ENV=production` and it is unset, cross-origin browser access is disabled.

## Audit events

Successful registration, login, cart mutations, and order creation are written to MongoDB's `auditlogs` collection. An administrator can list them with `GET /api/admin/audit-logs?page=1&limit=25`, optionally filtering with `userId` or `action`. This endpoint requires an admin bearer token. Events exclude passwords, tokens, shipping addresses, and card information. Audit writes are best-effort; failures are reported to the API logs.
