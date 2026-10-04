# RateHub - Store Rating & Management Platform

## Overview

RateHub is a premium SaaS-style web application that allows administrators to manage stores and users, store owners to view deep analytics on their ratings, and normal users to discover stores and submit unique 1-5 star ratings securely.

## Features

### Core Functionality
- **3-Tier Role System:** Admin, Store Owner, and Normal User roles with strict backend enforcement
- **Store Discovery:** Users can browse and search for stores
- **Rating System:** Secure 1-5 star rating system with one rating per store per user
- **Store Owner Analytics:** Deep analytics dashboard with rating distributions and averages
- **Admin Management:** Complete control over users and stores

### Technical Features
- **Server-Side Data Operations:** Scalable pagination, debounced search, and multi-column sorting implemented at the database level
- **Robust Security:** Firebase Google Auth intercepted via Admin SDK tokens; PostgreSQL UNIQUE constraints guarantee one rating per store per user
- **Custom Design System:** Premium SCSS-driven variables, cards, toasts, and skeleton components. No Tailwind or Bootstrap
- **Real-time Updates:** Toast notifications for user feedback
- **Responsive Design:** Mobile-friendly interface

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool and dev server
- **TypeScript 6** - Type safety
- **React Router 7** - Client-side routing
- **SCSS** - Styling with custom design system
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Firebase 12** - Client-side authentication

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript 7** - Type safety
- **pg** - PostgreSQL driver
- **Firebase Admin SDK 14** - Server-side authentication
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Database & Infrastructure
- **PostgreSQL 15** - Relational database
- **Docker & Docker Compose** - Containerization and orchestration

## Project Structure

```
Ratehub/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components (Header, Footer)
│   │   │   ├── Button.tsx      # Button component
│   │   │   ├── Card.tsx        # Card component
│   │   │   ├── Input.tsx       # Input component
│   │   │   ├── Rating.tsx      # Star rating component
│   │   │   ├── Table.tsx       # Data table component
│   │   │   ├── KpiCard.tsx     # KPI card component
│   │   │   ├── EmptyState.tsx  # Empty state component
│   │   │   └── PageHeader.tsx  # Page header component
│   │   ├── config/             # Configuration files
│   │   ├── contexts/           # React contexts (Auth, Toast)
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── owner/          # Store owner dashboard pages
│   │   │   ├── user/           # User dashboard pages
│   │   │   └── Login.tsx       # Login page
│   │   ├── services/           # API services
│   │   ├── styles/             # Global styles and SCSS variables
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── .env.example            # Environment variables template
│   ├── Dockerfile              # Docker configuration
│   ├── package.json            # Dependencies and scripts
│   └── vite.config.ts          # Vite configuration
│
├── server/                      # Backend Express application
│   ├── database/               # Database files
│   │   ├── schema.sql          # Database schema
│   │   └── seed.sql            # Seed data
│   ├── src/
│   │   ├── config/             # Configuration (database, Firebase)
│   │   ├── controllers/        # Route controllers
│   │   ├── database/           # Database connection and queries
│   │   ├── middleware/         # Express middleware (auth, roles)
│   │   ├── routes/             # API route definitions
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Server entry point
│   ├── .env.example            # Environment variables template
│   ├── Dockerfile              # Docker configuration
│   ├── package.json            # Dependencies and scripts
│   └── tsconfig.json           # TypeScript configuration
│
├── docker-compose.yml          # Docker Compose configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Prerequisites

Before running RateHub, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (for local development, optional if using Docker)
- **Docker & Docker Compose** (for containerized setup)
- **Firebase Project** with Google Sign-In enabled

## Installation & Setup

### Option 1: Docker (Recommended)

The easiest way to run RateHub is using Docker Compose.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ratehub
   ```

2. **Create environment file**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_NAME=ratehub
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_SERVICE_ACCOUNT={"type": "service_account", "project_id": "...", "private_key": "..."}
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker compose up --build
   ```

   This will:
   - Start PostgreSQL database and automatically run schema.sql and seed.sql
   - Build and start the backend API on port 5000
   - Build and start the frontend on port 5173

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

### Option 2: Local Development

#### Step 1: Set up PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `ratehub`
3. Run the schema and seed files:
   ```bash
   psql -U postgres -d ratehub -f server/database/schema.sql
   psql -U postgres -d ratehub -f server/database/seed.sql
   ```

#### Step 2: Configure Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file using `.env.example` as template:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=ratehub
   DB_PASSWORD=your_password
   DB_PORT=5432
   FIREBASE_SERVICE_ACCOUNT={"type": "service_account", "project_id": "...", "private_key": "..."}
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:5000

#### Step 3: Configure Frontend

1. Navigate to the client directory (in a new terminal):
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file using `.env.example` as template:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:5173

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_PORT` | PostgreSQL port (default: 5432) | No |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON string | Yes |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    role user_role DEFAULT 'USER',
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Ratings Table
```sql
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);
```

### Indexes
- `idx_users_email` on users(email)
- `idx_users_name` on users(name)
- `idx_users_role` on users(role)
- `idx_stores_name` on stores(name)
- `idx_stores_address` on stores(address)
- `idx_ratings_store_id` on ratings(store_id)
- `idx_ratings_user_id` on ratings(user_id)

## API Documentation

### Authentication

All API endpoints (except auth sync) require a valid Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints

#### POST `/api/auth/sync`
- **Role:** Any authenticated user
- **Description:** Syncs Firebase user with PostgreSQL. Creates user if they don't exist.
- **Request Headers:**
  - `Authorization: Bearer <firebase_id_token>`
- **Response:**
  ```json
  {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "USER"
  }
  ```

#### GET `/api/admin/dashboard`
- **Role:** ADMIN
- **Description:** Returns total counts of users, stores, and ratings.
- **Response:**
  ```json
  {
    "totalUsers": 5,
    "totalStores": 2,
    "totalRatings": 3
  }
  ```

#### GET `/api/admin/users`
- **Role:** ADMIN
- **Query Parameters:**
  - `search` (optional): Search by name or email
  - `role` (optional): Filter by role (ADMIN, USER, STORE_OWNER)
  - `sort` (optional): Sort column (name, email, role)
  - `order` (optional): Sort order (asc, desc)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Example:** `GET /api/admin/users?search=john&role=USER&sort=name&order=asc&page=1&limit=10`
- **Response:**
  ```json
  {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

#### GET `/api/stores`
- **Role:** USER, STORE_OWNER, ADMIN
- **Query Parameters:**
  - `search` (optional): Search by name or address
  - `sort` (optional): Sort column (name, address)
  - `order` (optional): Sort order (asc, desc)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response:**
  ```json
  {
    "stores": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 20,
      "totalPages": 2
    }
  }
  ```

#### GET `/api/stores/:id/analytics`
- **Role:** STORE_OWNER (owner only), ADMIN
- **Description:** Returns analytics for a specific store.
- **Response:**
  ```json
  {
    "averageRating": 4.5,
    "totalRatings": 10,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
  ```

#### POST `/api/stores/:id/rating`
- **Role:** USER
- **Request Body:**
  ```json
  {
    "rating": 5
  }
  ```
- **Description:** UPSERTs a rating. If user already rated, it updates the record safely.
- **Response:**
  ```json
  {
    "id": "uuid",
    "rating": 5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

## Architecture

### System Architecture

```
React SPA (Vite)
      ↓ (HTTP + Bearer Token)
Express REST API
      ↓ (Firebase Admin SDK verifyIdToken)
Authentication & Role Middleware
      ↓ (Controllers / Business Logic)
PostgreSQL Database
```

### Component Responsibilities

#### Frontend
- Pure UI rendering and state management
- Route-level protection using React Router
- UX states (loading, toasts, forms)
- Client-side validation
- Firebase authentication integration

#### Backend Middleware
- Token decoding using Firebase Admin SDK
- Database role checking
- Blocks unauthorized routes before logic executes
- Request logging with Morgan
- Security headers with Helmet

#### Backend Controllers
- SQL execution and query building
- Business logic implementation
- Payload validation
- Response formatting

#### Database
- Final source of truth for all data
- Enforces constraints (UNIQUE rating per user per store)
- Handles cascading deletes
- Supports complex analytics queries

## Demo Flow

1. **Google Login** as the predefined Admin account (admin@ratehub.local)
2. View the **Admin Dashboard** KPIs showing total users, stores, and ratings
3. Navigate to Users page and demonstrate:
   - **Server-Side Sorting** (click column headers)
   - **Search** (type a name or email)
   - **Pagination** (navigate through pages)
4. **Log out** and log in as a **Normal User** (user1@ratehub.local)
5. Go to the **User Dashboard** and search for "Bob's Burgers"
6. **Submit a 4-Star Rating** - observe the toast notification
7. Update to 5-stars to demonstrate the `UPSERT` update functionality
8. **Log out** and log in as **Store Owner (Bob)** (bob@ratehub.local)
9. Observe the Dashboard:
   - Rating distribution chart shows the exact 5-star rating dynamically
   - Average rating updates in real-time

## Development Scripts

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
npm run preview  # Preview production build
```

### Server
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript
npm run start    # Start production server
```

## Technical Decisions

### Why PostgreSQL?
The application relies heavily on relational entities (Users → Stores → Ratings) and requires deep SQL analytics (`AVG()`, `COUNT()`, `GROUP BY`) and constraints (`UNIQUE`, `ON DELETE CASCADE`) which NoSQL databases struggle with natively. PostgreSQL provides robust ACID compliance and powerful indexing capabilities.

### Why UNIQUE(user_id, store_id)?
Frontend checks or API-level checks are prone to race conditions. The database constraint guarantees mathematical impossibility of duplicate ratings, ensuring data integrity even under concurrent requests.

### Why Firebase Authentication?
It securely offloads the complexity of Google OAuth providers, password resets, and session management, while allowing us to control the exact Authorization (Roles) on our own PostgreSQL backend using the Firebase Admin SDK token verifier. This provides a best-of-both-worlds approach.

### Why Server-Side filtering/pagination?
Loading 10,000 stores into a React state and filtering them via JavaScript is extremely non-performant. Server-side parameters ensure the browser only handles exactly what it needs to render (e.g., 10 rows), while PostgreSQL handles index-backed lookups efficiently.

### Why Custom SCSS instead of Tailwind/Bootstrap?
A custom design system provides:
- Complete control over the visual identity
- Optimized bundle size (no unused utility classes)
- Consistent design tokens across components
- Ability to create specialized components (toasts, skeletons) that match the brand

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check that environment variables match your database configuration
- Verify the database exists: `psql -U postgres -l`

### Firebase Authentication Errors
- Verify Firebase project configuration in Firebase Console
- Ensure Google Sign-In is enabled
- Check that the service account JSON is correctly formatted
- Verify the Firebase API key in the frontend .env file

### Docker Issues
- Ensure Docker and Docker Compose are installed and running
- Check that ports 5432, 5000, and 5173 are not in use
- Try rebuilding containers: `docker compose down && docker compose up --build`

### CORS Errors
- Verify the `VITE_API_BASE_URL` in the frontend .env file
- Check that CORS middleware is configured correctly in the backend

## Security Considerations

- All API endpoints (except auth sync) require valid Firebase authentication
- Role-based access control is enforced at the middleware level
- Database constraints prevent duplicate ratings
- CORS is configured to allow only specific origins
- Helmet middleware adds security headers
- Environment variables are never committed to version control
- Firebase service account is handled securely

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or contributions, please open an issue on the repository or contact the development team.
