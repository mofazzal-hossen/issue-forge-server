# 🔬 Enterprise Technical Audit & Engineering Report
**Project Name**: `issue-forge-server`  
**Auditor**: Senior Staff Engineer / Principal Architect  
**Workspace Path**: `/Users/munna/Desktop/Now I am Working This Folder File/issue-forge-server`

---

## 1. Project Summary
`issue-forge-server` is a Node.js / Express backend service written in TypeScript. It provides authentication (signup, login, refresh token generation), role-based authorization (user, admin, super_admin), and schema models for managing users and orders. The service connects to a PostgreSQL database via Neon Serverless (`@neondatabase/serverless`).

---

## 2. Architecture Overview
The current architecture follows a semi-layered structure:
- **Server Entry**: `src/server.ts` -> `src/app.ts`
- **Routing**: `src/api/routes/auth.route.ts`
- **Controllers**: `src/api/controller/auth.controller.ts`
- **Services**: `src/api/service/auth.Service.ts`
- **Database**: `src/db/index.ts`
- **Utilities & Middlewares**: `src/utils/`, `src/middleware/`

### Architectural Gap:
The service layer (`auth.Service.ts`) directly executes raw SQL queries via `@neondatabase/serverless`, bypassing a Repository abstraction. Presentation and business layers lack request validation (e.g. Zod/Joi schemas).

---

## 3. Dependency Analysis
- **`express` (^5.2.1)**: Modern Express 5.x version supporting automatic promise rejection handling.
- **`@neondatabase/serverless` (^1.1.0) & `pg` (^8.22.0)**: Redundant DB client declarations. Neon serverless is initialized for HTTP SQL queries while `pg` is installed but unutilized.
- **`bcrypt` (^6.0.0)**: Used for salted password hashing (10 rounds).
- **`jsonwebtoken` (^9.0.3)**: Used for issuing and verifying HMAC SHA-256 JWT access and refresh tokens.
- **`cookie-parser` (^1.4.7)**: Parses incoming request `Cookie` headers into `req.cookies`.
- **`tsx` (^4.23.1)**: Used for fast TypeScript execution in development.

---

## 4. Authentication Flow
```text
Client (POST /auth/login)
  │ (req.body: email, password)
  ▼
auth.controller.ts (login)
  │ calls validateUser(email, password)
  ▼
auth.Service.ts
  │ queries DB: SELECT * FROM users WHERE email = ${email}
  │ compares bcrypt hash
  ▼
auth.controller.ts
  │ calls signToken(user) -> generates accessToken & refreshToken
  │ res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false })
  ▼
Returns JSON Response with accessToken AND refreshToken payload
```

---

## 5. Authorization Flow
```text
Protected Route Request (e.g., GET /auth/test)
  │ Headers: Authorization = <JWT>
  ▼
utils/auth.ts (auth middleware)
  │ verifyToken(Token, "access")
  │ authService.getUserById(payload.id)
  │ attaches req.user = user
  ▼
utils/auth.ts (authorizeRole middleware)
  │ checks if roles.includes(req.user.role)
  │ PASS -> next() | FAIL -> res.send("toy don't have permission")
```

---

## 6. Database Flow
The database connection is established stateless over HTTP using Neon Serverless:
- `src/db/index.ts` creates `export const sql = neon(config.database_url)`.
- SQL queries execute via tagged template strings (`sql`SELECT ...``).
- Schema initialization runs dynamically via `initDB()` on application startup.

---

## 7. Request Lifecycle
1. `Incoming HTTP Request` -> `src/server.ts` -> `src/app.ts`
2. `logger` middleware appends request info to `logger.txt`.
3. `cookieParser()` parses request cookies.
4. `express.json()` parses JSON body.
5. Express Router (`authRoute`) matches endpoint path.
6. Handlers execute async service calls.
7. `globalErrorHandler` catches thrown errors.

---

## 8. Folder Architecture Review
- **Current**: Mix of feature routes (`src/api/`) and global directories (`src/utils/`, `src/middleware/`).
- **Issues**: Non-standard naming (`auth.Service.ts` vs `auth.controller.ts`), lack of a `modules/` or `repositories/` layer.

---

## 9. API Design Review
- `POST /auth/signup`: Returns 200 instead of 201 Created.
- `POST /auth/login`: Returns access & refresh tokens in body as well as cookies.
- `GET /auth/refresh`: Reads refresh token from cookie and re-issues tokens.
- `GET /auth/me`, `PUT /auth/update/:id`, `DELETE /auth/delete/:id`: Empty hanging handlers `() => {}`.

---

## 10. Middleware Flow
Order in `src/app.ts`:
1. `logger` (File I/O append)
2. `cookieParser()`
3. `express.json()`
4. `app.get('/')`
5. `app.use('/auth', authRoute)`
6. `globalErrorHandler`

---

## 11. Database Relationship Diagram
```text
┌────────────────────────────────────────┐
│                 users                  │
├────────────────────────────────────────┤
│ id (PK, SERIAL)                        │
│ name (VARCHAR 100)                     │
│ email (VARCHAR 250, UNIQUE)            │
│ password_hash (TEXT)                   │
│ age (INT)                              │
│ role (VARCHAR 20 DEFAULT 'user')       │
│ created_at (TIMESTAMP)                 │
│ updated_at (TIMESTAMP)                 │
└───────────────────┬────────────────────┘
                    │ 1
                    │
                    │ N
┌───────────────────▼────────────────────┐
│                 orders                 │
├────────────────────────────────────────┤
│ id (PK, SERIAL)                        │
│ customer_id (FK -> users.id)           │
│ quantity (INT CHECK > 0)               │
│ food (TEXT)                            │
│ price (NUMERIC 10,2)                   │
│ created_at (TIMESTAMP)                 │
│ updated_at (TIMESTAMP)                 │
└────────────────────────────────────────┘
```

---

## 12. JWT Lifecycle
- **Signing**: `signToken()` in `src/utils/jwt.ts` signs both tokens using `jsonwebtoken`.
- **Payload**: Full user object (`id`, `name`, `email`, `age`, `role`).
- **TTL**: Access Token = `1d`, Refresh Token = `15d`.
- **Verification**: `verifyToken()` verifies signature against secrets.

---

## 13. Security Review
| Finding | File Path | Line | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| Sensitive Data in JWT Payload | `src/utils/jwt.ts` | 14-27 | **High** | Entire user object signed into JWT payload. |
| Hardcoded Cookie `secure: false` | `src/api/controller/auth.controller.ts` | 38, 78 | **High** | Insecure HTTP cookie setting in production. |
| Exposed Refresh Token | `src/api/controller/auth.controller.ts` | 45, 86 | **Medium** | Refresh token exposed in JSON body alongside cookie. |
| Long Access Token TTL | `src/utils/jwt.ts` | 16 | **Medium** | 1-day access token lifetime. |
| Lack of Rate Limiting | `src/app.ts` | 8-11 | **High** | `/auth/login` vulnerable to brute-force attacks. |

---

## 14. Performance Review
| Finding | File Path | Line | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| Synchronous/Blocking Disk I/O | `src/middleware/logger.ts` | 11-17 | **High** | `fs.appendFile` on every HTTP request creates event loop lag. |
| DB Queries Over HTTP | `src/db/index.ts` | 4 | **Low** | Neon HTTP stateless driver has round-trip latency overhead compared to TCP pool. |

---

## 15. Scalability Review
- Stateless application design allows horizontal scaling behind a load balancer.
- Lack of centralized logging (e.g. stdout streams) hinders log aggregation in containerized environments (Docker/Kubernetes).

---

## 16. Maintainability Review
- Lack of request validation schemas leads to repetitive manual validation checks.
- Inconsistent file naming (`auth.Service.ts` vs `auth.controller.ts`).

---

## 17. Code Smells
- Empty hanging route handlers (`() => {}`) in `src/api/routes/auth.route.ts#L15-L17`.
- Typo in string response: `"toy don't have permission"` in `src/utils/auth.ts#L39`.
- Typo in logger output: `"server is raining"` in `src/server.ts#L11`.

---

## 18. Anti Patterns
- Dynamic Schema Creation on Boot (`initDB()` in `src/db/index.ts`).
- Service Layer directly executing SQL queries (`src/api/service/auth.Service.ts`).

---

## 19. SOLID Violations
- **Single Responsibility Principle (SRP)**: `auth.Service.ts` handles password hashing, database querying, and business validation.
- **Dependency Inversion Principle (DIP)**: Controllers directly depend on concrete `authService` singleton instead of abstractions.

---

## 20. Clean Code Violations
- Returning string responses instead of consistent JSON error objects (`src/utils/auth.ts#L35, L39`).

---

## 21. TypeScript Issues
- Environment variables cast unsafely (`as string`) in `src/config/index.ts#L7-L11` without validation.
- `err: unknown` handled via `err instanceof Error` without typed custom operational error classes (`src/middleware/globalErrorHandler.ts#L6`).

---

## 22. SQL Issues
- Table schema lacks index on `users(email)` (though `UNIQUE` implicitly creates an index, explicit indexing on foreign key `orders(customer_id)` is missing).

---

## 23. Express Issues
- Missing `express-rate-limit`, `helmet`, and `cors` security middlewares in `src/app.ts`.

---

## 24. Node.js Issues
- Missing process shutdown listeners (`process.on('SIGTERM')`, `process.on('unhandledRejection')`) in `src/server.ts`.

---

## 25. Missing Best Practices
- SQL Migration scripts.
- Input validation library (Zod).
- Structured logger (Pino / Winston).
- Unit and Integration tests.

---

## 26. Refactoring Suggestions
1. Introduce Zod for request validation.
2. Abstract database logic into a Repository layer.
3. Replace startup `initDB()` with version-controlled migrations.
4. Implement short-lived Access Tokens (15m) and secure Refresh Token Rotation.

---

## 27. Production Readiness Score: `42 / 100` ❌
- **Reasoning**: Critical security flaws (unprotected cookies, long-lived access tokens, lack of rate-limiting, unhandled route stubs) prevent immediate production deployment.

## 28. Interview Readiness Score: `68 / 100` ⚠️
- **Reasoning**: Good grasp of fundamental Express, JWT, and PostgreSQL concepts, but requires deeper understanding of enterprise clean architecture, security hardening, and performance optimization.
