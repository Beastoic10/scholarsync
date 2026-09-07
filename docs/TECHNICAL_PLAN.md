# ScholarSync — Finalized Technical Plan (30% Milestone)

Real-Time Academic Research Collaboration & Workflow Engine.

## 1. Architecture Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application style | Modular monolith, layered (Controller → Service → Repository → Domain) | Matches the AOOP course focus on clean layering and SOLID; avoids distributed-systems overhead. |
| Sync API | REST (JSON) over HTTP for all CRUD and commands | Cacheable, easy to document with OpenAPI, testable with MockMvc. |
| Async API | WebSocket + STOMP (`/ws` endpoint, `/topic/**` broker, `/app/**` app prefix) | Push board mutations, comments and review events; no polling. REST stays the write path, STOMP is the broadcast path (Observer pattern sink). |
| Auth | Spring Security + stateless JWT (`Authorization: Bearer`) | Stateless sessions work identically for REST and WebSocket handshakes. |
| Authorization | Role-based: `TEACHER`, `STUDENT`, `CO_AUTHOR`, enforced with `@EnableMethodSecurity` + domain guards in the State pattern | Approval transitions are restricted to faculty at the domain layer, not the controller. |
| Persistence | Spring Data JPA / Hibernate | ACID relational model; audit trail requires transactional consistency. |
| Database | PostgreSQL 16 (`prod` profile), H2 in-memory (`dev`/tests) | Postgres for the real deployment; H2 keeps the build hermetic and CI-friendly. |
| Schema management | `ddl-auto: update` in dev, `validate` in prod (Flyway to be added at the 60% milestone) | Fast iteration now, controlled migrations before deployment. |
| Frontend | Server-rendered Thymeleaf pages (Home, Login, Register) + vanilla JS calling the REST API | The project is backend-first; the pages prove the endpoints end to end without a separate SPA toolchain. |
| Build tool | Maven (Spring Boot parent 3.3.4, Java 17) | Standard, reproducible, single `mvn spring-boot:run` entrypoint. |
| API docs | springdoc-openapi 2.6 → Swagger UI at `/swagger-ui.html` | Live contract for the grader/reviewer. |
| Testing | JUnit 5 + Spring Boot Test + MockMvc + spring-security-test | Integration tests over the real security filter chain. |

## 2. Package Structure

```
com.scholarsync
├── ScholarSyncApplication.java
├── config/          SecurityConfig, WebSocketConfig, OpenApiConfig
├── controller
│   ├── api/         REST controllers (AuthController, UserController)
│   └── web/         Thymeleaf page controller
├── dto/             Request/response records and validation DTOs
├── domain
│   ├── enums/       Role, TaskState, CitationFormat, FeedbackStatus
│   └── model/       JPA entities
├── exception/       Domain exceptions + @RestControllerAdvice
├── repository/      Spring Data JPA repositories
├── security/        JwtService, JwtAuthenticationFilter, UserDetailsService, JwtProperties
└── service/         Service interfaces
    └── impl/        Service implementations
```

Services are declared as interfaces with `impl` classes so pattern-based implementations (State, Strategy) can be substituted without touching controllers (DIP + OCP).

## 3. Domain Model (implemented entities)

- `User` — email, bcrypt hash, full name, `Role`, institution.
- `ResearchProject` — title, description, advisor (`User`), members (`ManyToMany`), tasks.
- `ResearchTask` — title, description, `TaskState`, due date, project, assignee, artifacts, references.
- `Reference` — title, authors, venue, year, DOI, URL, annotation, linked task.
- `Artifact` — named deliverable attached to a task, owned by a user.
- `ArtifactVersion` — immutable revision (`v1.0`, `v1.1`), storage URI, change summary, submitter.
- `ReviewComment` — body + `FeedbackStatus`, attached to a specific `ArtifactVersion`.
- `ActivityLog` — event type + payload + actor + project (audit ledger).

All entities extend `BaseEntity` (identity, `@CreatedDate`, `@LastModifiedDate` via JPA auditing).

## 4. Design Pattern Roadmap

| Pattern | Where it lands | Milestone |
| --- | --- | --- |
| State | `domain/state/TaskState*` classes driving `ResearchTask` transitions and role checks | 60% |
| Strategy | `service/citation/CitationStrategy` + IEEE/APA/BibTeX implementations resolved by `CitationFormat` | 60% |
| Observer | Spring `ApplicationEvent`s (`ArtifactSubmittedEvent`, `CommentAddedEvent`) with listeners for STOMP broadcast and audit logging | 60% |
| Command + Memento | `ArtifactUpdateCommand` with version snapshots for rollback | 100% |
| Factory | `ActivityLogFactory` / `NotificationFactory` producing payloads per event type | 100% |

The 30% deliverable intentionally ships the skeleton and persistence layer; the pattern classes plug into the seams already created (service interfaces, enums, event-ready entities).

## 5. Implemented in this milestone

- Compiling, runnable Spring Boot app (`mvn spring-boot:run`, port 8080).
- H2 dev database auto-configured; PostgreSQL profile ready via env vars.
- All entities + repositories.
- `POST /api/auth/register` — creates an account, returns a JWT.
- `POST /api/auth/login` — authenticates, returns a JWT.
- `GET /api/users/me` — JWT-protected profile endpoint.
- Pages: `/` (Home), `/login`, `/register`.
- Swagger UI, H2 console, STOMP endpoint registered.
- Integration tests covering the public home page, register→login JWT flow, and rejection of anonymous access to a protected endpoint.

## 6. Running Locally

```bash
mvn spring-boot:run           # http://localhost:8080
mvn test                      # integration tests
```

PostgreSQL profile:

```bash
SPRING_PROFILES_ACTIVE=prod \
SCHOLARSYNC_DB_URL=jdbc:postgresql://localhost:5432/scholarsync \
SCHOLARSYNC_DB_USER=scholarsync SCHOLARSYNC_DB_PASSWORD=secret \
SCHOLARSYNC_JWT_SECRET=<256-bit-secret> mvn spring-boot:run
```
