# 🎯 Production Codebase Technical Interview Guide & Preparation Plan
## Project: `issue-forge-server`

---

## 🧐 Executive Codebase Technical Breakdown & Audit

### 1. Codebase Inventory & Tech Stack
- **Framework**: Express.js (v5)
- **Language**: TypeScript (`tsx`, `esnext`, ES Modules)
- **Database**: PostgreSQL (via `@neondatabase/serverless` HTTP connection)
- **Authentication**: JWT (`jsonwebtoken`), `bcrypt` password hashing, `cookie-parser`
- **Logging**: Custom file-appender (`fs.appendFile` to `logger.txt`)

---

### 2. Deep Technical Analysis & Findings

#### A. Bugs & Code Smells
1. **Express Route Stubs (`src/api/routes/auth.route.ts`)**:
   - Endpoints `GET /me`, `PUT /update/:id`, `DELETE /delete/:id` use empty arrow functions `() => {}`. Incoming HTTP requests to these endpoints will hang indefinitely until timing out, as they never call `res.send()` or `next()`.
2. **Typo & Status Code Flaws (`src/utils/auth.ts`)**:
   - In `authorizeRole`, unauthorized responses return raw string `"toy don't have permission"` with default HTTP status `200 OK` instead of proper JSON with `403 Forbidden`.
   - In `auth` middleware, access token validation failure message reads `"invalid refresh token "` instead of `"invalid access token"`.
   - Console typo in `src/server.ts`: `"server is raining 5000"`.
3. **Double Token Exposure (`src/api/controller/auth.controller.ts`)**:
   - In `login` and `refresh`, the refresh token is set as an HTTP-only cookie AND returned inside the JSON response body (`data: { accessToken, refreshToken }`). This invalidates the security benefit of HTTP-only cookies.

#### B. Security Vulnerabilities
1. **JWT Payload Over-Exposure (`src/utils/jwt.ts`)**:
   - `signToken` passes the entire user payload (`{ id, name, age, email, role }`) into `jwt.sign()`. Storing mutable user details in JWT causes payload bloat and prevents instant role updates.
2. **Excessive Access Token TTL**:
   - Access token expiration is set to `'1d'` (24 hours). Industry standard for access tokens is 15 minutes.
3. **Lack of Refresh Token Invalidation**:
   - Refresh tokens are stateless and lack database tracking, token versioning, or whitelist/blacklist checks. Stolen refresh tokens remain valid until expiration.
4. **Hardcoded Secure Cookie Flag**:
   - In `login` and `refresh` controllers, cookie option `secure: false` is hardcoded regardless of `NODE_ENV`.

#### C. Performance & Architectural Flaws
1. **File System I/O Bottleneck (`src/middleware/logger.ts`)**:
   - `fs.appendFile("logger.txt", ...)` is called on every single incoming HTTP request. Disk I/O creates heavy event loop delay under high concurrency.
2. **Service Layer Coupling (`src/api/service/auth.Service.ts`)**:
   - Direct raw SQL queries inside service methods violate the Repository Pattern.
3. **Database Initialization anti-pattern (`src/db/index.ts`)**:
   - `initDB()` executes `CREATE TABLE IF NOT EXISTS` on server boot instead of using version-controlled SQL migrations.

---

## 📚 Interview Roadmap & Curriculum Overview

| Level | Focus | Topics Covered |
| :--- | :--- | :--- |
| **Level 1 — Junior** | Core JS/TS, Express routing, Basic SQL, Async/Await | Callbacks vs Promises, Event Loop, Basic Express Handlers, PostgreSQL SELECT/INSERT |
| **Level 2 — Mid-Level** | Middleware design, JWT auth, Error handling, RBAC | JWT signing/verification, Cookie security, Middleware flow, Transactions |
| **Level 3 — Senior** | Clean Architecture, Security, Performance, DB design | Repository pattern, Refresh token rotation, Disk I/O bottlenecks, Database indexing |
| **Level 4 — Lead Engineer** | Distributed Systems, Scalability, System Design, HR | Microservices, High availability, DB pooling, Team leadership & Conflict resolution |

---

## ❓ FAANG & Tier-1 Interview Syllabus (1,000 Questions Index)

- **JavaScript Core (100 Questions)**: Event loop, Promises, ES Modules, Memory leaks, Closures.
- **TypeScript Advanced (100 Questions)**: Utility types, Generics, Casing consistency, Type narrowing.
- **Node.js Internals (100 Questions)**: Event Loop phases, Stream I/O vs File append, Process termination.
- **Express.js Architecture (100 Questions)**: Middleware pipeline, Express 5 error handling, Route definitions.
- **PostgreSQL & SQL (100 Questions)**: Connection pooling, Neon HTTP driver vs `pg` pool, DDL vs Migrations, Indexing.
- **Authentication & Security (100 Questions)**: JWT vs Sessions, Cookie flags, CSRF, XSS, Bcrypt salt rounds.
- **Project-Specific Questions (100 Questions)**: Auditing `auth.controller.ts`, `auth.Service.ts`, `logger.ts`, `jwt.ts`.
- **Debugging Challenges (100 Questions)**: Diagnosing hanging requests, unhandled rejections, memory leaks.
- **Scenario-Based System Design (100 Questions)**: Scaling Auth Service to 1M daily active users.
- **HR & Behavioral (100 Questions)**: Handling technical debt, code reviews, architectural trade-offs.

---

## 🎯 Live Interactive Interview Protocol

1. Questions are presented **ONE AT A TIME**.
2. Candidates answer each question in detail.
3. Candidates are evaluated across 8 dimensions:
   - **Score (/10)**
   - **Mistakes identified**
   - **Better Answer**
   - **Senior-level Answer**
   - **Follow-up Question**
   - **Interviewer Expectations**
   - **Local Company (Bangladesh) Hiring Recommendation**
   - **International Company (FAANG/Tier-1) Hiring Recommendation**
