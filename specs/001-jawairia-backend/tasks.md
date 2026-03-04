# Tasks: Jawairia Backend Initialization

## Phase 1: Setup (Project Initialization)
- [x] T000 Link project to GitHub and push initial `spec.md`, `plan.md`, and `tasks.md`
- [x] T001 Initialize Node.js project with `npm init -y` in repo root
- [x] T002 [P] Install core dependencies: `express`, `prisma`, `@prisma/client`, `dotenv`, `zod`, `jsonwebtoken`, `bcrypt`, `multer`, `cors`, `helmet`, `morgan`
- [x] T003 [P] Install dev dependencies: `typescript`, `@types/node`, `@types/express`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/multer`, `@types/cors`, `@types/morgan`, `ts-node-dev`, `jest`, `ts-jest`, `@types/jest`
- [x] T004 Initialize TypeScript configuration with `npx tsc --init` and customized `tsconfig.json`
- [x] T005 Initialize Prisma with `npx prisma init`
- [x] T006 Create initial `.env` file with placeholders for DB, Redis, and Cloudinary

## Phase 2: Foundational (Infrastructure & Core Logic)
- [x] T007 Create project skeleton: `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/middlewares`, `src/config`, `src/utils`
- [x] T008 [P] Implement global error handler middleware in `src/middlewares/error.middleware.ts`
- [x] T009 [P] Implement logger utility using Morgan in `src/config/logger.ts`
- [x] T010 Implement base Express app and health check endpoint in `src/app.ts`

## Phase 3: [US1] Authentication & Profile
- [x] T011 [US1] Define User model in `prisma/schema.prisma`
- [x] T012 [US1] Create Auth Repository in `src/repositories/auth.repository.ts`
- [x] T013 [US1] Create Auth Service with Register/Login logic in `src/services/auth.service.ts`
- [x] T014 [US1] Implement JWT utility in `src/utils/jwt.ts`
- [x] T015 [US1] Create Auth Controller in `src/controllers/auth.controller.ts`
- [x] T016 [US1] Setup Auth Routes in `src/routes/auth.routes.ts`
- [x] T017 [US1] Implement Auth Middleware for JWT validation in `src/middlewares/auth.middleware.ts`

## Phase 4: [US2] Product Management
- [ ] T018 [US2] Define Product, Variant, and Category models in `prisma/schema.prisma`
- [ ] T019 [US2] Create Product Repository in `src/repositories/product.repository.ts`
- [ ] T020 [US2] Implement Variant generation logic in `src/services/product.service.ts`
- [ ] T021 [US2] Create Product Controller and Routes

## Verification Goals
- T010 completion: `GET /api/health` returns status OK.
- T017 completion: Successful login returns a valid JWT, and protected routes are accessible with it.

## Implementation Strategy
- Focus on Phase 1 & 2 first to have a running foundation.
- US1 (Auth) is the priority to enable subsequent protected features.
- Iterative database schema updates as we progress through user stories.
