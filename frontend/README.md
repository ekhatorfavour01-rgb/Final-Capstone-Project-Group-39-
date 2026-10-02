# E-Commerce Order System

An e-commerce web application designed to provide a complete online shopping experience, including product browsing, search, filtering, cart management, checkout, order tracking, authentication, payment processing, and administration.

## Project Overview

The E-Commerce Order System is being developed as a collaborative capstone project.

The application is structured as a full-stack system, with the frontend serving as the user-facing layer and backend services providing persistent data, authentication, order processing, and payment functionality.

### Current Development Stage

The storefront can run in demo mode or connect to the team's separate Express/MongoDB API. When `NEXT_PUBLIC_API_BASE_URL` is set, products, authentication, cart changes, and demo order placement use the backend. Without it, the page keeps its local demo catalog and cart.

---

## Current Features

The current frontend implementation includes:

- Product catalogue
- Product categories
- Product search
- Product filtering
- Product sorting
- Product cards
- Product images
- Discount displays
- Wishlist interface
- Shopping cart
- Quantity management
- Checkout interface
- Account registration and sign-in
- Backend-backed cart and order creation
- Responsive layouts
- Demo catalog fallback when the API URL is not configured
- Persistent backend cart and demo orders when connected

---

## User Flow

The current frontend follows the intended e-commerce user journey:

```text
Storefront
    ↓
Browse Products
    ↓
Search / Filter
    ↓
View Product
    ↓
Add to Cart
    ↓
Review Cart
    ↓
Checkout
    ↓
Create Demo Order
```

---

## Technology

The project is built around a modern web application architecture.

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend API

- Express
- MongoDB with Mongoose
- JWT authentication

### Payment Behavior

Checkout currently creates a backend order for testing; it does not use a payment provider or charge money.

---

## Project Structure

```text
.
├── app/page.tsx       # Next.js storefront
├── lib/api.ts         # Express API client
├── .env.example       # Public API origin example
└── docs/              # Setup, API, and deployment guides
```

---

## Running the Current Frontend

The API URL is configured in `frontend/.env.local`. Start MongoDB and the backend first, then start the frontend. See [docs/SETUP.md](docs/SETUP.md) for exact steps. Without the API URL, the frontend starts in demo mode.

### Install Dependencies

If dependencies have not already been installed:

```bash
pnpm install
```

### Start the Development Server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Integration Notes

When connected, the page loads products from `GET /api/products`, authenticates through `/api/auth/register` and `/api/auth/login`, persists cart changes through `/api/cart`, and creates orders through `POST /api/orders`. See [docs/API.md](docs/API.md) for the actual request contracts.

Without the API environment variable the existing in-memory demo catalog remains available. The backend checkout is also a demo: it creates an order and marks it paid without processing a payment. No card information is required or accepted.

---

## Development Roadmap

### Current

- Frontend application structure
- Storefront interface
- Product catalogue
- Product categories
- Search
- Filtering
- Cart interface
- Checkout interface
- API-backed sign-in, cart, and demo order creation
- Responsive layouts
- Mock data

### Still Needed for Production Payments

- Payment provider sandbox integration
- Server-side payment verification/webhooks
- Review token storage and production security

---

## Documentation

Additional project documentation is organized in the `docs` directory.

| File              | Description                            |
| ----------------- | -------------------------------------- |
| `ARCHITECTURE.md` | Overall application architecture       |
| `DATABASE.md`     | Database structure                     |
| `API.md`          | Express API endpoints and contracts    |
| `SETUP.md`        | Project setup instructions             |
| `SECURITY.md`     | Security considerations                |
| `TESTING.md`      | Testing strategy                       |
| `DEPLOYMENT.md`   | Deployment process                     |
| `GIT_WORKFLOW.md` | Collaboration and Git workflow         |
| `TASKS.md`        | Project tasks and development tracking |
| `REPORT.md`       | Current implementation report          |

---

## Development Approach

The frontend and API are separate services. Set the backend origin in the frontend environment rather than exposing database credentials in browser code.

---

## Project Status

**Current stage: Frontend connected to Express/MongoDB API with demo checkout**

---

## License

This project is developed as a collaborative capstone project for educational and demonstration purposes.
