# ScholarSync — 

Real-Time Academic Research Collaboration & Workflow Engine.
This milestone covers: project skeleton, database wiring, and two working,
JWT-secured endpoints (register, login) plus a protected home endpoint.

## Requirements
- JDK 17+
- Maven 3.9+ (or use your IDE's bundled Maven — IntelliJ/Eclipse both work out of the box)
- Internet connection on first build (to pull dependencies)

## Run it

```bash
mvn spring-boot:run
```

The app starts on `http://localhost:8080` using an **in-memory H2 database**
(no setup needed — data resets each restart). To use PostgreSQL instead,
run with the `prod` profile and set the `DB_HOST`, `DB_NAME`, `DB_USER`,
`DB_PASSWORD`, and `JWT_SECRET` environment variables:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Explore the API
Swagger UI (interactive docs + "try it out"): `http://localhost:8080/swagger-ui.html`
H2 console (inspect the DB directly): `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:scholarsync`, user `sa`, blank password

## The three working endpoints

**1. Register** — `POST /api/auth/register`
```json
{
  "fullName": "Dr. Ada Lovelace",
  "email": "ada@university.edu",
  "password": "SecurePass123",
  "role": "TEACHER"
}
```
Returns a JWT + user info. Roles: `TEACHER`, `STUDENT`, `CO_AUTHOR`.

**2. Login** — `POST /api/auth/login`
```json
{ "email": "ada@university.edu", "password": "SecurePass123" }
```
Returns a fresh JWT.

**3. Home (protected)** — `GET /api/home`
Requires header: `Authorization: Bearer <token from register/login>`
Returns a personalized welcome message + the caller's role.

Quick end-to-end test with curl:
```bash
# Register and capture the token
TOKEN=$(curl -s -X POST localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Dr. Ada Lovelace","email":"ada@university.edu","password":"SecurePass123","role":"TEACHER"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Call the protected home endpoint
curl -s localhost:8080/api/home -H "Authorization: Bearer $TOKEN"
```

## Package structure
```
com.scholarsync
 ├── config/       SecurityConfig, OpenApiConfig
 ├── controller/   AuthController, HomeController  (thin, no business logic)
 ├── service/      AuthService, CustomUserDetailsService
 ├── repository/   UserRepository, ResearchTaskRepository (Spring Data JPA)
 ├── model/        User, Role, ResearchTask, TaskStatus (JPA entities/enums)
 ├── dto/          RegisterRequest, LoginRequest, AuthResponse
 ├── security/     JwtUtil, JwtAuthFilter
 └── exception/    ApiException, GlobalExceptionHandler
```

## What's scaffolded for the next milestone
- `ResearchTask` + `TaskStatus` model classes exist already, so the **State
  Pattern** for the Kanban lifecycle (Proposed → ... → Approved) has a home
  to plug into next.
- `spring-boot-starter-websocket` is already a dependency, ready for the
  STOMP-based real-time sync feature.
- `GlobalExceptionHandler` and the DTO layer are in place so new features
  don't need to re-solve error handling or entity leakage.

## Notes on this milestone's scope
Password hashing uses BCrypt via Spring Security. JWTs are stateless
(no server-side session). Citation export (Strategy), Observer-based
notifications, and Command/Memento versioning are intentionally **not**
implemented yet — they depend on the `ResearchTask` workflow landing first
and are scoped to the next milestone per the proposal's Section 4.
