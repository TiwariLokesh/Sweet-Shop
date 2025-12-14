# Sweet Shop Management System

A full-stack sweet shop manager with JWT auth, role-based admin features, and a modern React dashboard. Users can browse and purchase sweets; admins can add, edit, restock, and delete inventory. Logout is available for all roles.

## What’s Inside
- **Auth**: Register/login with hashed passwords, JWT, role-based access (`user`, `admin`), logout.
- **Inventory**: Create, list, search (name/category/price range), update, delete (admin only), restock, purchase with oversell protection.
- **UI**: Responsive React SPA with filters, KPI tiles, admin CRUD panel, and disabled purchase when out of stock.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Jest, Supertest.
- Frontend: React (Vite), Axios, React Router, Tailwind CSS, Vitest, React Testing Library.

## Local Setup
### Prerequisites
- Node.js 18+
- MongoDB URI (local or hosted)

### 1) Clone
```bash
git clone https://github.com/TiwariLokesh/Sweet-Shop.git
cd Sweet-Shop
```

### 2) Backend (API)
```bash
cd server
cp .env.example .env          # set your secrets
npm install
npm start                     # production-like
# or hot reload during dev
npm run dev
```

Env (`server/.env`):
```
MONGO_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=super-secret
PORT=5000
```

### 3) Frontend (Vite)
```bash
cd ../client
cp .env.example .env          # point API to backend
npm install
npm run dev                   # Vite dev server
```

Env (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 4) Open the app
- Backend defaults to `http://localhost:5000`
- Frontend dev server defaults to `http://localhost:5173`

## Running Tests
- Backend: `cd server && npm test`
- Frontend: `cd client && npm test` (Vitest + jsdom)

## Test Report (latest run)
- **Backend (Jest)**: 2 suites, 19 tests — **pass** (10.6s)
- **Frontend (Vitest, jsdom)**: 1 suite, 3 tests — **pass** (2.3s)
	- Notes: React Router v7 future-flag warnings only; no failures.

## Screenshots
- Login and auth flow  
	![Login and auth flow](images/Screenshot%202025-12-14%20155930.png)
- Dashboard overview with filters and KPIs  
	![Dashboard overview with filters and KPIs](images/Screenshot%202025-12-14%20155951.png)
- Purchase flow with stock guardrails  
	![Purchase flow with stock guardrails](images/Screenshot%202025-12-14%20160036.png)
- Dashboard for User  
	![Dashboard for User](images/Screenshot%202025-12-14%20160108.png)

## API Quick Reference
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/sweets` (auth)
- `GET /api/sweets` (auth)
- `GET /api/sweets/search` (auth; q, category, minPrice, maxPrice)
- `PUT /api/sweets/:id` (auth)
- `DELETE /api/sweets/:id` (admin)
- `POST /api/sweets/:id/purchase` (auth)
- `POST /api/sweets/:id/restock` (admin)

## My AI Usage
- **Tools used**: GitHub Copilot (inline suggestions in VS Code) and ChatGPT — GPT-5.1-Codex-Max (Preview).
- **How I used them**: Copilot for quick scaffolds, JSX/Tailwind completions, and small refactors; ChatGPT for API design trade-offs, test strategy ideas, and README phrasing.
- **Reflection**: AI sped up repetitive code and documentation, but I verified auth rules, DB schema choices, and tests manually to avoid hidden assumptions.

## Deployment
- Not yet deployed. Deploy to Vercel/Netlify (frontend) + Render/Heroku/Fly.io (backend) or a single full-stack host, then add the live URL here.
