# Deployment

Deploy the frontend and backend as separate services. The browser connects to the API using the public backend origin.

## Backend API

Deploy `Backend/` to a Node.js host such as Render or Railway. Configure these server-side environment variables:

- `MONGO_URI`: a production MongoDB Atlas connection string with network access enabled for the host
- `JWT_SECRET`: a long, random secret; keep it private
- `PORT`: use the port assigned by the host, or `5001` if running on a fixed-port host
- `JWT_EXPIRES_IN`: optional, defaults to `7d`
- `CORS_ORIGIN`: the deployed frontend origin, for example `https://your-store.example.com`

Use `node app.js` as the start command. Verify the deployed API by opening its root URL; `GET /` is the health check.

## Frontend

Deploy `frontend/` to Vercel (set the project root directory to `frontend`). Add this environment variable in the hosting dashboard:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-deployed-api.example.com
```

Do not append `/api` to the value. Redeploy after changing this variable because Next.js reads public environment variables at build time. Do not add `MONGO_URI` or `JWT_SECRET` to the frontend project.

## Verify the Full Flow

1. Confirm the API health endpoint is reachable over HTTPS.
2. Confirm MongoDB has at least one product with available stock. Product creation requires an admin token at `POST /api/admin/products`.
3. Open the deployed frontend and create a user account.
4. Add a product, change its quantity, and confirm the cart survives a refresh.
5. Enter a shipping address and place a demo order. Confirm the order ID appears and the cart is cleared.

The checkout marks demo orders `Paid`; no payment provider is integrated. Use a provider's verified sandbox/webhook flow before production payments.
