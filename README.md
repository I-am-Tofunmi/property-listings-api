# Property Listings API v2

A production-shaped REST API with PostgreSQL, JWT authentication, role-based access control, and a passing test suite.

## Setup

### Prerequisites
- Node.js
- PostgreSQL 16

### Installation

1. Clone the repo and navigate to this folder
2. Install dependencies:
```bash
   npm install
```
3. Create the databases:
```bash
   psql -U postgres -c "CREATE DATABASE property_api;"
   psql -U postgres -c "CREATE DATABASE property_api_test;"
```
4. Copy `.env.example` to `.env` and fill in your values:
```bash
   cp .env.example .env
```
5. Run migrations:
```bash
   npm run migrate:up
```
6. Seed the database:
```bash
   npm run seed
```
7. Start the server:
```bash
   npm start
```

## Testing

Run the full test suite:
```bash
npm test
```

Tests use a separate `property_api_test` database. Migrations must be run against it first:
```bash
$env:DATABASE_URL="postgresql://postgres:<password>@localhost:5432/property_api_test"; npm run migrate:up
```

## Auth Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /auth/register | Public |
| POST | /auth/login | Public |
| POST | /auth/logout | Protected |
| GET | /auth/me | Protected |

## Property Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /properties | Public |
| GET | /properties/:id | Public |
| POST | /properties | Admin only |
| PATCH | /properties/:id | Admin only |
| DELETE | /properties/:id | Admin only |

## Enquiry Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /enquiries | Authenticated |
| GET | /enquiries | Admin only |
| GET | /enquiries/:id | Admin or owner |

## Dev Credentials

After seeding, use these to test:
- Admin: `admin@toobrains.com` / `password123456`
- User: `user@toobrains.com` / `password123456`