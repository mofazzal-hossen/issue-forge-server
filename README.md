# 🛡️ Issue Forge Server - Backend Architecture

A production-ready, enterprise-grade backend service built with **Express**, **TypeScript**, **PostgreSQL**, **JWT Authentication**, **Role-Based Access Control (RBAC)**, and **Clean Architecture** principles.

---

## 🚀 Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) (v5)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL ([Neon Serverless Postgres](https://neon.tech/) / `postgres.js`)
- **Authentication**: JWT (`jsonwebtoken`), `bcrypt` password hashing, `cookie-parser`
- **Development Tooling**: `tsx` watch mode, `tsup` bundler

---

## 🏛️ Clean Architecture Principles

This project follows a **Feature-Modular Clean Architecture** pattern designed for high maintainability, testability, and enterprise scalability:

```text
  ┌─────────────────────────────────────────────────────────┐
  │                 Presentation Layer                      │
  │     (Express Routes, Controllers, Middlewares)          │
  └──────────────────────────┬──────────────────────────────┘
                             │ calls
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │                Application Service Layer                │
  │        (AuthService, UserService, OrderService)         │
  └──────────────────────────┬──────────────────────────────┘
                             │ calls (via Interfaces)
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │                   Domain / Entity Layer                 │
  │           (User, Order, DTOs, Custom Errors)            │
  └──────────────────────────▲──────────────────────────────┘
                             │ implements interfaces
  ┌──────────────────────────┴──────────────────────────────┐
  │               Infrastructure / DB Layer                 │
  │      (UserRepository, PostgreSQL, JWT, Bcrypt)          │
  └─────────────────────────────────────────────────────────┘
```

---

## 📁 Recommended Folder Structure

```text
issue-forge-server/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── tsup.config.ts                   # Production build configuration
├── src/
│   ├── app.ts                       # Express app setup & global middleware
│   ├── server.ts                    # Server startup & graceful shutdown
│   │
│   ├── @types/                      # Global TypeScript ambient definitions
│   │   └── express.d.ts             # Custom Express Request type (req.user)
│   │
│   ├── config/                      # Environment variables & DB config
│   │   ├── env.config.ts            # Zod-validated environment config
│   │   └── index.ts                 # Main config export
│   │
│   ├── constants/                   # Application constants
│   │   ├── http-status.constant.ts  # HTTP status code definitions
│   │   └── user-roles.constant.ts   # User role enums (USER, ADMIN, SUPER_ADMIN)
│   │
│   ├── errors/                      # Custom Error Classes
│   │   ├── app-error.ts             # Base AppError class
│   │   ├── unauthorized-error.ts    # 401 Unauthorized Error
│   │   └── forbidden-error.ts       # 403 Forbidden Error
│   │
│   ├── middleware/                  # Global Express Middlewares
│   │   ├── globalErrorHandler.ts    # Global centralized error handler
│   │   └── logger.ts                # Request logger middleware
│   │
│   ├── utils/                       # Shared Stateless Utilities
│   │   ├── async-handler.ts         # Async controller wrapper
│   │   ├── auth.ts                  # Auth & role verification middleware helpers
│   │   ├── jwt.ts                   # JWT signing & verification logic
│   │   └── sendResponse.ts          # Standardized API response utility
│   │
│   ├── db/                          # Database Client & Migrations
│   │   └── index.ts                 # Database client & schema initialization
│   │
│   └── modules/                     # Domain Feature Modules (Clean Architecture)
│       ├── auth/                    # Auth Module (Signup, Login, Refresh Token)
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.route.ts
│       │   └── auth.validation.ts
│       ├── users/                   # Users Module
│       └── orders/                  # Orders Module
```

---

## 🔑 Key Responsibilities by File Type

- **`*.route.ts`**: Defines URL endpoints and binds validation/auth middlewares.
- **`*.controller.ts`**: Handles incoming HTTP requests/responses, delegates work to services, and formats output.
- **`*.service.ts`**: Contains pure business rules and orchestrates data flow between repositories and utilities.
- **`*.repository.ts`**: Executes SQL queries directly against the PostgreSQL database.
- **`*.validation.ts`**: Defines Zod validation schemas for request bodies, query params, and route params.
- **`*.interface.ts`**: Defines TypeScript interfaces, domain entities, and DTOs.

---

## 🛠️ Features & API Endpoints

### 1. Authentication Module (`/auth`)
- `POST /auth/signup` - Register a new user (`name`, `email`, `password`, `age`, `role`)
- `POST /auth/login` - Authenticate user & receive Access Token + HttpOnly Refresh Token Cookie
- `POST /auth/refresh` - Refresh short-lived Access Token using valid Refresh Token Cookie

### 2. User & Order Modules
- Role-based authorization (`user`, `admin`, `super_admin`) for protected routes.
- Order management linked via customer relationship.

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@ep-example.neon.tech/dbname?sslmode=require
ACCESS_SECRET=your_super_secret_access_key
REFRESH_SECRET=your_super_secret_refresh_key
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

---

## 📦 Production Build & Deployment Guide

### Add Scripts to `package.json`
```json
"scripts": {
  "dev": "tsx watch ./src/server.ts",
  "build": "tsup",
  "start": "node dist/server.js"
}
```

### Install Production Bundler
```bash
npm i -D tsup
```

### `tsup.config.ts`
```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm", "cjs"],
  target: "esnext",
  outDir: "dist",
  clean: true,
  bundle: true,
  sourcemap: true,
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
```

### Deploying to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

---

## 🔒 Security Best Practices

1. **Short-Lived Access Tokens**: Keep access token lifespan short (15 mins) and refresh tokens in `HttpOnly`, `Secure` cookies.
2. **Input Sanitation**: Validate all incoming payloads using Zod schemas.
3. **HTTP Security Headers**: Use `helmet()` to set safe security headers.
4. **Rate Limiting**: Protect authentication endpoints against brute-force attacks using `express-rate-limit`.
