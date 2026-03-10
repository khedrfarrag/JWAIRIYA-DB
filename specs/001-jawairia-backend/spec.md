# Project Specification: Jawairia (جوايريا) - Backend

## Overview
Jawairia is a backend system built with Node.js, Express, PostgreSQL, and Redis, following a layered architecture with a repository pattern. It is designed for an e-commerce platform with features like authentication, product management, cart, orders, payment integration (Paymob), and real-time activity tracking.

## Core Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Caching**: Redis
- **Auth**: JWT + Refresh Tokens
- **Real-time**: Socket.io
- **Payment**: Paymob SDK
- **Storage**: Cloudinary

## Architecture Pattern
**Layered Architecture + Repository Pattern**
- `Routes`: Handle HTTP requests and validation.
- `Controllers`: Orchestrate data flow between routes and services.
- `Services`: Contain the core business logic.
- `Repositories`: Handle all database interactions via Prisma.
- `Middlewares`: Security, validation, and error handling.

## Database Schema (Prisma)
### Main Models:
- `User`: Auth and role-based access.
- `Product`: Core product info.
- `Variant`: Combinations of color, size, and material with stock.
- `Category`: Categorization with hierarchy.
- `Order` & `OrderItem`: Transactional data.
- `Coupon`: Discount management.
- `Address`: Shipping locations.
- `Review`: Product feedback.
- `TrackingSession`: UTM and visitor tracking.

## Feature Specifications

### 1. Authentication & Authorization
- Email/Password registration and login.
- Google OAuth integration.
- JWT-based authentication with Refresh Tokens.
- RBAC (Role-Based Access Control) with an `Admin` middleware.

### 2. Product Management
- Filtering and searching products.
- Product details with Slug support.
- Automated variant generation (Color x Size x Material).
- Restock alerts for out-of-stock items.
- **Reviews & Ratings**: User-submitted ratings (1-5 stars) and comments with moderation.
- **SEO Optimization**: Custom Meta titles/descriptions for each product.
- **Related Products**: Smart suggestion based on category and tags.

### 3. Cart & Orders
- Guest and User carts with merging capability.
- Coupon validation and application.
- Order creation with `PENDING_PAYMENT` status.
- Paymob integration with webhook callbacks.
- Stock locking (15 mins) during payment process.

### 4. Marketing & Real-time
- UTM tracking and visitor push subscriptions.
- Abandoned cart recovery (Cron job every hour).
- Live viewer counter per product using Socket.io and Redis.

## API Endpoints Summary
Refer to the `jawairia-backend.docx` or extracted text for the full list of endpoints (~40+ endpoints).

## Folder Structure
```text
src/
├── routes/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── jobs/
├── sockets/
├── config/
├── utils/
└── app.ts
```

## Success Criteria
- Fully functional REST API according to the spec.
- 100% Type safety with TypeScript.
- Secure authentication system.
- Reliable stock management and payment flow.
- Real-time updates for product viewers.
