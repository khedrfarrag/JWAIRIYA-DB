# Jawairia (جوايريا) Constitution

## Core Principles

### I. Layered Architecture & Repository Pattern
The project must strictly follow a 4-layer architecture:
- **Routes**: External API interface and request validation.
- **Controllers**: Request handling and service orchestration.
- **Services**: Business logic, third-party integrations, and complex workflows.
- **Repositories**: Direct data access using Prisma. This ensures database portability and easier testing.

### II. Strict Type Safety & Validation
- **TypeScript**: 100% type coverage is required. Avoid `any` except when strictly necessary for third-party compatibility.
- **Zod**: All request bodies, parameters, and query strings must be validated using Zod schemas before reaching the controller.

### III. Spec-Driven Development
- Every implementation must refer back to `spec.md`, `plan.md`, and `tasks.md`.
- Documentation should be updated concurrently with code changes to prevent drift.

### IV. Security & RBAC
- **Authentication**: JWT-based security for all non-public endpoints.
- **Authorization**: Mandatory role-checks (Admin/User) for sensitive operations using `adminMiddleware`.
- **Secrets**: No secrets should be hardcoded; use `.env` exclusively.

### V. API Documentation (Swagger)
- All routes must be documented using Swagger JSDoc.
- Accurate request/response schemas should be provided to enable frontend integration.

## Technical Constraints
- **Runtime**: Node.js v20+
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis for real-time tracking and performance.
- **Testing**: Jest/Supertest for automated verification (Non-negotiable for core logic).

## Development Workflow
1. **Plan**: Define the feature in `spec.md` and update `tasks.md`.
2. **Execute**: Implement the feature following the repository pattern.
3. **Verify**: Ensure code passes linting and manual/automated health checks.

**Version**: 1.0.0 | **Ratified**: 2024-03-06 | **Last Amended**: 2024-03-06
