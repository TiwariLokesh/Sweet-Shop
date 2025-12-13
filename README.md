# Sweet Shop Management System

A full-stack sweet shop manager with JWT auth, role-based admin features, and a modern React dashboard. Built with strict TDD using Jest/Supertest (backend) and Vitest/RTL (frontend).

## Features
- Auth: register/login with hashed passwords and JWT; roles `user` and `admin`.
- Sweets: create, list, search (name/category/price range), update, delete (admin only).
- Inventory: purchase (decrement, blocks oversell), restock (admin only).
- UI: responsive SPA with login/register, search & filters, purchase button disabled at zero, admin CRUD/edit/restock/delete.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Jest, Supertest.
- Frontend: React (Vite), Axios, React Router, Vitest, React Testing Library.

## Setup
### Prerequisites
- Node.js 18+
- MongoDB URI (local or hosted)

### Backend
```bash
cd server
cp .env.example .env   # create your env file
npm install
npm start              # or: npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env   # create your env file
npm install
npm run dev            # starts Vite dev server
```

### Environment Variables
Create `.env` files in each package:

`server/.env`
```
MONGO_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=super-secret
PORT=5000
```

`client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Running Tests
- Backend: `cd server && npm test`
- Frontend: `cd client && npm test` (or `npx vitest run --environment jsdom`)

## API Summary
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/sweets` (auth)
- `GET /api/sweets` (auth)
- `GET /api/sweets/search` (auth, query: q, category, minPrice, maxPrice)
- `PUT /api/sweets/:id` (auth)
- `DELETE /api/sweets/:id` (admin)
- `POST /api/sweets/:id/purchase` (auth)
- `POST /api/sweets/:id/restock` (admin)

## Frontend Usage
- Login/Register, then access dashboard.
- Search/filter inputs at top; purchase buttons disable at zero quantity.
- Admins see create form plus edit/restock/delete controls on cards.

## Test Report (latest run)
- Backend: Jest — 2 suites, 19 tests — **pass**
- Frontend: Vitest — 1 suite, 3 tests — **pass**

## My AI Usage
- **GitHub Copilot**: Project scaffolding and repetitive wiring (initial setup, boilerplate configs).
- **ChatGPT**: Backend auth + sweets/inventory design, validation/edge cases, Express/Mongoose service patterns, JWT/role handling.
- **Gemini**: Frontend UX flow, React routing and dashboard interactions, test flows for purchase/admin actions.
- **Manual**: README authoring, environment docs, small fixes/adjustments.

## Screenshots (placeholders)
- `docs/screenshot-login.png`
- `docs/screenshot-dashboard.png`

## Notes
- Controllers stay thin; business logic in services. Errors surfaced with proper status codes.
- JWT required on sweets routes; admin guard on delete/restock.
- Purchase checks prevent negative stock; price/quantity validated non-negative.
