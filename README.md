# RateHub - Store Rating & Management Platform

## Overview
RateHub is a premium SaaS-style web application that allows administrators to manage stores and users, store owners to view deep analytics on their ratings, and normal users to discover stores and submit unique 1-5 star ratings securely.

## Features
- **3-Tier Role System:** (Admin, Store Owner, Normal User) with strict Backend enforcement.
- **Server-Side Data Operations:** Scalable Pagination, Debounced Search, and Multi-column Sorting implemented at the database level.
- **Robust Security:** Firebase Google Auth intercepted via Admin SDK tokens; PostgreSQL UNIQUE constraints guarantee one rating per store per user.
- **Custom Design System:** Premium SCSS-driven variables, cards, toasts, and skeleton components. No Tailwind or Bootstrap.
- **Analytics:** Store Owner dashboard features calculated averages and live rating distributions.

## Tech Stack
- **Frontend:** React (Vite), TypeScript, React Router, SCSS, Axios, Lucide React (Icons).
- **Backend:** Node.js, Express, TypeScript, pg (PostgreSQL driver).
- **Authentication:** Firebase (Google Sign-In) + Firebase Admin SDK.
- **Infrastructure:** Docker & Docker Compose.

## Architecture

React SPA (Vite)
      ↓ (HTTP + Bearer Token)
Express REST API
      ↓ (Firebase Admin SDK verifyIdToken)
Authentication & Role Middleware
      ↓ (Controllers / Business Logic)
PostgreSQL Database

*Responsibilities:*
- **Frontend:** Pure UI, route-level protection, UX states (loading, toast, forms).
- **Middleware:** Token decoding, DB role checking. Blocks unauthorized routes before logic executes.
- **Backend Controllers:** SQL execution, logic, payload validation.
- **Database:** Final source of truth for constraints (UNIQUE rating).

## API Documentation

### POST `/api/auth/sync`
- **Role:** ANY (Authenticated)
- **Description:** Syncs Firebase user with PostgreSQL. Creates them if they don't exist.

### GET `/api/admin/dashboard`
- **Role:** ADMIN
- **Description:** Returns total counts of users, stores, and ratings.

### GET `/api/admin/users`
- **Role:** ADMIN
- **Query:** `?search=abc&role=USER&sort=name&order=asc&page=1&limit=10`
- **Description:** Server-side paginated, filtered, and sorted list of users.

### POST `/api/stores/:id/rating`
- **Role:** USER
- **Request:** `{ "rating": 5 }`
- **Description:** UPSERTs a rating. If user already rated, it updates the record safely.

## Database Schema Highlights
- `users`: id (UUID), name, email, role (ENUM), firebase_uid.
- `stores`: id (UUID), name, email, address, owner_id (FK to users).
- `ratings`: id (UUID), user_id, store_id, rating. Includes `UNIQUE(user_id, store_id)` for data integrity.

## Local Setup
1. `cd server` & `npm install`
2. `cd client` & `npm install`
3. Fill `.env` files using the `.env.example` templates.
4. Run `npm run dev` in both folders.

## Docker Setup
Run `docker compose up --build` at the root. This spins up the Postgres Database (and seeds it automatically via `schema.sql` and `seed.sql`), the backend API on port 5000, and the frontend on port 5173.

## Interview Talking Points

### Why PostgreSQL?
Because the application relies heavily on relational entities (Users -> Stores -> Ratings) and requires deep SQL analytics (`AVG()`, `COUNT()`, `GROUP BY`) and constraints (`UNIQUE`, `ON DELETE CASCADE`) which NoSQL databases struggle with natively.

### Why UNIQUE(user_id, store_id)?
Frontend checks or API-level checks are prone to race conditions. The database constraint guarantees mathematical impossibility of duplicate ratings.

### Why Firebase Authentication?
It securely offloads the complexity of Google OAuth providers, password resets, and session management, while allowing us to control the exact Authorization (Roles) on our own PostgreSQL backend using the Firebase Admin SDK token verifier.

### Why Server-Side filtering/pagination?
Loading 10,000 stores into a React state and filtering them via JavaScript is extremely non-performant. Server-side parameters ensure the browser only handles exactly what it needs to render (e.g., 10 rows), while PostgreSQL handles index-backed lookups.

## Demo Flow
1. **Google Login** as the predefined Admin account.
2. View the **Admin Dashboard** KPIs. Navigate to Users.
3. Demonstrate **Server-Side Sorting** (click columns) and search (type a name).
4. **Log out** and log in as a **Normal User**.
5. Go to the **User Dashboard**. Search for "Bob's Burgers".
6. **Submit a 4-Star Rating**. The UI updates via the Toast system.
7. Click 5-stars to demonstrate the `UPSERT` update functionality.
8. **Log out** and log in as **Store Owner (Bob)**.
9. Observe the Dashboard: The rating distribution chart shows the exact 5-star rating dynamically.
