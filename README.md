# ScholarSync

Real-Time Academic Research Collaboration & Workflow Engine — a Spring Boot backend for faculty advisors and student researchers.

- Kanban research lifecycle: `PROPOSED → LITERATURE_REVIEW → EXPERIMENTATION → UNDER_ADVISOR_REVIEW → APPROVED`
- Literature & annotation vault with IEEE / APA / BibTeX export
- Versioned artifact submissions with status-tagged advisor feedback
- Real-time board sync over STOMP WebSockets and a full audit ledger

## Stack

Java 17 · Spring Boot 3.3 · Spring Security (JWT) · Spring Data JPA · H2 (dev) / PostgreSQL (prod) · Thymeleaf · springdoc-openapi · Maven

## Quick start

```bash
mvn spring-boot:run
```

| URL | Description |
| --- | --- |
| http://localhost:8080/ | Home page |
| http://localhost:8080/register | Registration page |
| http://localhost:8080/login | Login page |
| http://localhost:8080/swagger-ui.html | API documentation |
| http://localhost:8080/h2-console | Dev database console (JDBC `jdbc:h2:mem:scholarsync`, user `sa`) |

## API

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@university.edu","password":"supersecret1","fullName":"Ada Lovelace","role":"STUDENT"}'

curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@university.edu","password":"supersecret1"}'

curl http://localhost:8080/api/users/me -H "Authorization: Bearer <token>"
```

Roles: `TEACHER`, `STUDENT`, `CO_AUTHOR`.

## Tests

```bash
mvn test
```

See [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md) for the finalized architecture and design-pattern roadmap.
