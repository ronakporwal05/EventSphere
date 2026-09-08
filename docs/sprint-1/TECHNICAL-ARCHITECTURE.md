# EventSphere AI — Sprint 1: Technical Architecture & Project Foundation

**Version:** 1.0 | **Date:** August 2026 | **Status:** Approved Blueprint  
**Role:** Lead Software Architect, EventSphere AI  

---

## 1. High-Level Architecture Diagram

EventSphere AI is designed as a **Modular Monolith** with clear bounded contexts, deployed as a single Spring Boot artifact backed by PostgreSQL, Redis, Qdrant, and Supabase Storage.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│  ┌───────────────────────────┐    ┌───────────────────────────┐             │
│  │   Next.js 14+ Web App     │    │   Flutter Mobile App      │             │
│  │   (Organizer/Admin/Web)   │    │   (Attendee/Scanner)      │             │
│  └─────────────┬─────────────┘    └─────────────┬─────────────┘             │
└────────────────┼────────────────────────────────┼───────────────────────────┘
                 │                                │
                 │        HTTPS REST API (JSON)   │
                 ▼                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY / SECURITY LAYER                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    Spring Boot Security Filter Chain                  │  │
│  │  [CORS] → [Rate Limit] → [CSRF] → [JWT Auth Filter] → [Tenant Filter]  │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION / CORE LAYER                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                 Spring Boot 3.3.x Application Context                 │  │
│  │                                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │ Core Modules │  │ Ops Modules  │  │ Engagement   │  │ Platform  │  │  │
│  │  │ (Auth, Tenant│  │ (Event, Reg, │  │ (Sponsor,    │  │ (AI, Audit│  │  │
│  │  │  Org, User)  │  │  Session)    │  │  Cert, Doc)  │  │  Workflw) │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA & INFRASTRUCTURE LAYER                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  ┌─────────────┐  │
│  │ PostgreSQL   │    │ Redis Cloud  │    │ Qdrant Cloud │  │ Supabase    │  │
│  │ (Neon) DB    │    │ Caching &    │    │ Vector DB    │  │ Object      │  │
│  │ Relational   │    │ Rate Limit   │    │ Embeddings   │  │ Storage     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Low-Level Architecture

Each module follows **Clean Architecture** principles inside its module package boundary. Inter-module communication occurs exclusively via public Java interfaces or Spring Domain Events.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MODULE INTERNAL LAYOUT                             │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  API / CONTROLLER LAYER                                             │   │
│   │  - REST Controllers (@RestController)                               │   │
│   │  - Request / Response DTOs                                          │   │
│   │  - OpenAPI annotations (@Operation, @ApiResponse)                  │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  SERVICE / DOMAIN LAYER                                             │   │
│   │  - Service Interfaces & Implementations (@Service)                  │   │
│   │  - Business Rules Enforcement & Invariant Checks                    │   │
│   │  - Domain Event Publisher (ApplicationEventPublisher)               │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  INFRASTRUCTURE / DATA ACCESS LAYER                                 │   │
│   │  - Spring Data JPA Repositories (@Repository)                        │   │
│   │  - Domain Entities (@Entity) with Hibernate @TenantFilter           │   │
│   │  - Mappers (MapStruct for Entity ↔ DTO conversion)                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Complete Modular Monolith Architecture

The application is structured into **22 distinct business modules**. Direct cross-module database joins are strictly prohibited. 

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           22 BUSINESS MODULES                               │
│                                                                             │
│ [Core Platform]                                                             │
│ 1. auth          2. tenant        3. organization  4. user       5. role    │
│                                                                             │
│ [Event Operations]                                                          │
│ 6. event         7. session       8. venue         9. registration          │
│ 10. ticket       11. attendance                                             │
│                                                                             │
│ [Operations & Tasks]                                                        │
│ 12. workflow     13. resource     14. task         15. volunteer            │
│                                                                             │
│ [Engagement & Commercials]                                                  │
│ 16. sponsor      17. certificate  18. notification 19. analytics           │
│ 20. document                                                                │
│                                                                             │
│ [Intelligence & Compliance]                                                 │
│ 21. ai           22. audit                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spring Boot Package Structure

```
com.eventsphere
├── EventSphereApplication.java
├── common/                        # Shared Infrastructure & Utilities
│   ├── config/                    # Security, Redis, Async, OpenAPI, Database configs
│   ├── security/                  # JWT Provider, TenantFilter, SecurityFilter
│   ├── tenant/                    # TenantContext, TenantFilterAspect
│   ├── exception/                 # GlobalExceptionHandler, Base Exceptions
│   ├── dto/                       # Standard ApiResponse, PageResponse
│   ├── audit/                     # AuditAspect, Auditable annotation
│   └── util/                      # Crypto, QR, PDF, Date utilities
├── auth/                          # Authentication Module
├── tenant/                        # Multi-Tenancy Management Module
├── organization/                  # Organization & Department Module
├── user/                          # User Management Module
├── role/                          # RBAC & Permissions Module
├── event/                         # Event Management Module
├── session/                       # Session Scheduling Module
├── venue/                         # Venue & Room Management Module
├── registration/                  # Registration & Team Module
├── ticket/                        # QR Ticketing Module
├── attendance/                    # Attendance Tracking Module
├── workflow/                      # Workflow Engine Module
├── resource/                      # Resource Inventory Module
├── task/                          # Task Management Module
├── volunteer/                     # Volunteer Shift Module
├── sponsor/                       # Sponsor & Vendor Module
├── certificate/                   # Certificate Generation Module
├── notification/                  # Notification Center Module
├── analytics/                     # Platform Analytics Module
├── document/                      # Document & Asset Management Module
├── ai/                            # AI Assistant & RAG Module
└── audit/                         # Security & Operational Audit Log Module
```

---

## 5. Module Dependency Diagram

```
                              ┌──────────┐
                              │  Audit   │ ◄─── Consumes Events from all modules
                              └──────────┘
                                   ▲
  ┌──────────┐               ┌─────┴────┐
  │  Tenant  │ ◄──────────── │   Auth   │
  └────┬─────┘               └──────────┘
       │
       ▼
  ┌──────────┐               ┌──────────┐
  │   Org    │ ────────────► │   User   │
  └────┬─────┘               └────┬─────┘
       │                          │
       ▼                          ▼
  ┌──────────┐               ┌──────────┐
  │  Event   │ ────────────► │   Role   │
  └────┬─────┘               └──────────┘
       │
       ├──────────────────────────────┬──────────────┐
       ▼              ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Session  │  │  Venue   │  │ Sponsor  │  │ Resource │
  └──────────┘  └──────────┘  │ +Vendor  │  └──────────┘
       │                       └──────────┘
       ▼
  ┌──────────┐       ┌──────────┐
  │  Regist. │ ◄───► │ Workflow │ ◄─── Orchestrates automations
  └────┬─────┘       └──────────┘
       │
       ▼
  ┌──────────┐       ┌──────────┐
  │  Ticket  │ ────► │  Notif.  │
  └────┬─────┘       └──────────┘
       │
       ▼
  ┌──────────┐       ┌──────────┐
  │ Attend.  │ ────► │  Cert    │
  └────┬─────┘       └──────────┘
       │
       ├──────────────────────────────┐
       ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Volunteer│  │   Task   │  │ Document │
  └──────────┘  └──────────┘  └────┬─────┘
                                   │
       ┌───────────────────────────┘
       ▼
  ┌──────────┐       ┌──────────┐
  │ Analytics│ ◄──── │    AI    │
  └──────────┘       └──────────┘
```

---

## 6. Complete Database Entity List (49 Entities)

| Category | Entity Name | Primary Purpose |
|----------|-------------|-----------------|
| **Core** | `tenants` | Root multi-tenant account details |
| | `users` | Global identity profiles across all tenants |
| | `tenant_memberships` | User roles and access per tenant |
| | `roles` | RBAC role definitions |
| | `permissions` | Fine-grained action permissions |
| | `role_permissions` | Role-to-permission mapping table |
| **Org** | `organizations` | Tenant organization profile |
| | `departments` | Internal teams/departments inside an organization |
| **Event** | `events` | Core event definition (9-state lifecycle) |
| | `event_custom_fields` | Dynamic registration form fields |
| | `sessions` | Individual talks/workshops in an event |
| | `session_speakers` | Speaker assignment mapping to sessions |
| **Venue** | `venues` | Physical or virtual locations |
| | `rooms` | Specific halls/rooms within a venue |
| **Registration** | `registrations` | Attendee event registrations |
| | `teams` | Group/Hackathon registration teams |
| | `team_members` | Individual team memberships |
| | `tickets` | QR-coded tickets issued for registrations |
| | `waitlist_entries` | Overflow waitlist for full capacity events |
| **Attendance** | `attendance_records` | Checked-in attendees per event |
| | `session_attendance` | Checked-in attendees per session |
| **Workflow** | `workflow_definitions` | Configurable event lifecycle rules |
| | `workflow_instances` | Active workflow execution tracking |
| | `approval_records` | Approval/rejection decisions history |
| **Resource** | `resources` | Physical asset catalog (cameras, rooms, laptops) |
| | `resource_allocations` | Assigned assets with start/end timestamps |
| **Task** | `tasks` | Assigned tasks for staff and volunteers |
| **Volunteer** | `volunteer_assignments` | Volunteer registrations to events |
| | `volunteer_shifts` | Volunteer shift schedules |
| **Sponsor/Vendor**| `sponsors` | Sponsor profiles and package tiers |
| | `vendors` | Vendor profiles for exhibitions/stalls |
| | `booth_allocations` | Physical booth numbers for vendors/sponsors |
| | `vendor_leads` | Opt-in lead records collected by sponsors/vendors |
| **Certificate** | `certificate_templates` | Certificate HTML/PDF layouts |
| | `certificates` | Issued certificates with verification QR codes |
| **Notification** | `notification_templates` | Configurable message templates |
| | `notifications` | Audit trail of sent/queued messages |
| | `audience_segments` | Filtered user target groups |
| **Feedback** | `feedback_forms` | Survey forms for events |
| | `feedback_responses` | Submitted attendee feedback |
| **Document** | `documents` | Metadata for uploaded assets |
| | `document_versions` | Version history for uploaded documents |
| **AI** | `ai_conversations` | Chat history threads |
| | `ai_messages` | Prompts and responses in chat threads |
| | `ai_generated_content` | Saved AI summaries, FAQs, and drafts |
| **Audit** | `audit_logs` | Immutable change logs across all entities |
| | `login_history` | Audit log of login attempts |
| | `ticket_validation_logs` | Audit log of QR scan checks |
| **Auth Token** | `refresh_tokens` | Tracked JWT refresh token hashes |

---

## 7. ER Diagram (Conceptual)

```
┌─────────────┐       1:N       ┌──────────────────┐
│   tenants   ├─────────────────<  organizations   │
└──────┬──────┘                 └────────┬─────────┘
       │                                 │ 1:N
       │ 1:N                             ▼
       │                        ┌──────────────────┐
       │                        │      events      │
       │                        └────────┬─────────┘
       │                                 │
       │         ┌───────────────────────┼───────────────────────┐
       │         │ 1:N                   │ 1:N                   │ 1:N
       ▼         ▼                       ▼                       ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│users (Global)│ │   sessions   │ │registrations │ │  resources   │
└──────┬───────┘ └──────────────┘ └──────┬───────┘ └──────────────┘
       │                                 │ 1:1
       │ 1:N                             ▼
       │                         ┌──────────────┐
       ├─────────────────────────<   tickets    │
       │                         └──────┬───────┘
       │                                 │ 1:1
       ▼                                 ▼
┌──────────────┐                 ┌──────────────┐
│  certificates│ ◄───────────────┤ attendance   │
└──────────────┘                 └──────────────┘
```

---

## 8. Entity Relationships

1. **Tenant Isolation Core:** Every entity (except `users`, `roles`, `permissions`, `login_history`) contains a non-nullable `tenant_id` foreign key referencing `tenants(id)`.
2. **User Membership:** `users` to `tenants` is a Many-to-Many relationship mediated by `tenant_memberships` (contains `user_id`, `tenant_id`, `role_id`).
3. **Event Containment:** An `organization` owns `events`. An `event` owns child `sessions`, `registrations`, `sponsors`, `vendors`, and `tasks`.
4. **Registration to Ticket:** A `registration` produces exactly one `ticket` upon approval.
5. **Ticket to Attendance:** A `ticket` produces an `attendance_record` upon successful QR scanning.

---

## 9. Database Indexing Strategy

To guarantee **sub-50ms query execution times** under production loads:

1. **Multi-Tenant Filter Indexes:** Every tenant-scoped entity has a B-Tree index on `(tenant_id)`.
2. **Composite Lookup Indexes:**
   - `idx_events_tenant_status_date`: `(tenant_id, status, start_date)`
   - `idx_registrations_event_status`: `(event_id, status)`
   - `idx_tickets_code_tenant`: `(ticket_code, tenant_id)` (Unique B-Tree)
   - `idx_resource_alloc_time`: `(resource_id, start_time, end_time)` (Double-booking prevention)
3. **Audit Time-Series Indexes:**
   - `idx_audit_logs_timestamp`: `(tenant_id, timestamp DESC)`
   - `idx_login_history_user`: `(user_id, timestamp DESC)`

---

## 10. Multi-Tenant Database Design

### Strategy: Shared Database, Shared Schema with Row-Level Filtering

- **Mechanism:** Hibernate `@TenantFilter` combined with Spring Security `TenantFilter`.
- **Tenant Context Resolution:** Executed on every HTTP request via `TenantFilter`:
  1. Extract `X-Tenant-ID` header or JWT `tenant_id` claim.
  2. Store value in `TenantContext` (ThreadLocal wrapper).
  3. Enable Hibernate filter `tenantFilter` on current Entity Manager session passing `TenantContext.getTenantId()`.
- **Zero Data Leakage Rule:** Integration tests verify that queries executed without `TenantContext` return 0 records by default.

---

## 11. API Standards

1. **Protocol & Format:** REST over HTTPS, JSON payload bodies (`application/json`).
2. **Base URI Pattern:** `/api/v1/{tenant_id}/{module-resource}` (or tenant resolved via header).
3. **HTTP Verb Conventions:**
   - `GET`: Retrieve resource(s) (Idempotent).
   - `POST`: Create resource or trigger action (Non-idempotent).
   - `PUT`: Full replacement of resource (Idempotent).
   - `PATCH`: Partial update of resource (Idempotent).
   - `DELETE`: Soft or physical remove (Idempotent).
4. **Pagination Standard:** All collection endpoints require `page` (0-indexed), `size` (default 20, max 100), and `sort` (e.g. `sort=createdAt,desc`).

---

## 12. Response Format Standards

### Standard Success Response Format (`ApiResponse<T>`)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-05T21:54:00Z"
}
```

### Standard Paginated Response Format (`PagedResponse<T>`)

```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 145,
    "totalPages": 8,
    "last": false
  },
  "timestamp": "2026-08-05T21:54:00Z"
}
```

### Standard Error Response Format (`ErrorResponse`)

```json
{
  "success": false,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Event with ID 'evt_9872' was not found",
  "details": ["Event ID does not exist in current tenant context"],
  "path": "/api/v1/events/evt_9872",
  "timestamp": "2026-08-05T21:54:00Z"
}
```

---

## 13. Exception Handling Strategy

Centralized handling via `@RestControllerAdvice` (`GlobalExceptionHandler`):

| Exception | HTTP Status | Error Code |
|-----------|-------------|------------|
| `ResourceNotFoundException` | `404 NOT FOUND` | `RESOURCE_NOT_FOUND` |
| `TenantAccessDeniedException` | `403 FORBIDDEN` | `TENANT_ACCESS_DENIED` |
| `ResourceConflictException` | `409 CONFLICT` | `RESOURCE_ALREADY_EXISTS` / `DOUBLE_BOOKING` |
| `MethodArgumentNotValidException` | `400 BAD REQUEST` | `VALIDATION_FAILED` |
| `UnauthorizedException` | `401 UNAUTHORIZED` | `AUTHENTICATION_FAILED` |
| `Unhandled Exceptions` | `500 INTERNAL ERROR` | `INTERNAL_SERVER_ERROR` |

---

## 14. Logging Strategy

1. **Framework:** SLF4J facade with Logback implementation.
2. **Structured Logging:** JSON format in production with MDC (Mapped Diagnostic Context):
   - `traceId`: Distributed trace ID.
   - `tenantId`: Active tenant ID.
   - `userId`: Authenticated user ID.
3. **Log Levels:**
   - `ERROR`: System failures requiring developer action.
   - `WARN`: Business invariant violations or retried operations.
   - `INFO`: Lifecycle milestones (e.g., event status change, user login).
   - `DEBUG`: Internal state details (disabled in production).

---

## 15. Audit Strategy

- **Mechanism:** Aspect-Oriented Programming (`@Aspect`) intercepting methods annotated with `@Auditable`.
- **Storage:** Persisted into `audit_logs` table asynchronously to prevent slowing HTTP responses.
- **Payload Logged:** Entity Name, Entity ID, Action (`CREATE`, `UPDATE`, `DELETE`), Actor User ID, IP Address, Tenant ID, Before State (JSON), After State (JSON).
- **Immutability:** Database level permissions revoke `UPDATE` and `DELETE` on the `audit_logs` table.

---

## 16. Validation Strategy

- **Input Layer Validation:** Jakarta Bean Validation (`@NotNull`, `@Size`, `@Email`, `@NotBlank`, `@Future`) on all Controller DTOs.
- **Domain Layer Validation:** Explicit invariant checks inside Domain Services (e.g. `checkCapacityAvailable()`, `preventDoubleBooking()`).
- **Sanitization:** Custom HTML/Script sanitizer filters on String fields to eradicate XSS vectors before processing.

---

## 17. Security Architecture

```
[Request] ──► [TLS 1.3 Encryption]
                 │
                 ▼
              [Rate Limiting Filter] (Redis Sliding Window)
                 │
                 ▼
              [CORS Filter] (Configured White-list Origins)
                 │
                 ▼
              [CSRF Token Filter]
                 │
                 ▼
              [JWT Token Filter] (RS256 Signature + Expiry + Blacklist Check)
                 │
                 ▼
              [Tenant Isolation Filter] (Context setup + Hibernate filter)
                 │
                 ▼
              [Method Security] (@PreAuthorize("hasAuthority('EVENT:WRITE')"))
```

- **JWT Specs:** RS256 Asymmetric Key Pair. Access Token TTL = 15 mins. Refresh Token TTL = 7 days (stored as SHA-256 hash in Redis/DB with automatic rotation).

---

## 18. Complete Project Directory Structure

```
eventsphere-ai/
├── backend/                       # Java 21 Spring Boot Monolith
│   ├── src/main/java/com/eventsphere/...
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   ├── application-prod.yml
│   │   └── db/migration/         # Flyway Migrations
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                      # Next.js 14+ React App
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   ├── package.json
│   └── Dockerfile
├── mobile/                        # Flutter App
│   ├── lib/
│   ├── pubspec.yaml
│   └── Android/iOS manifests
├── database/                      # DB Documentation & Raw Scripts
│   ├── migrations/
│   └── seeds/
├── infrastructure/                # Docker & Deployment Orchestration
│   ├── docker-compose.yml
│   └── render.yaml
└── docs/                          # Architecture Specifications
    ├── sprint-0/
    └── sprint-1/
```

---

## 19. Git Branching Strategy

- **Branch Model:** Modified Git-Flow.
- **Protected Branches:** `main` (Production) and `develop` (Staging). Direct pushes strictly prohibited.
- **Feature Branches:** `feature/{module-name}-{description}` created off `develop`.
- **Commit Format:** Conventional Commits (`feat(auth): add RS256 token validator`).
- **PR Rules:** Requires 1 code approval, passing CI pipeline (Build + Unit Tests + Lint), and zero merge conflicts before squash-merging into `develop`.

---

## 20. Coding Standards

1. **Java Version:** Java 21 LTS syntax (Records, Pattern Matching, Sealed Classes).
2. **Formatting:** Google Java Style Guide (enforcement via Spotless Maven Plugin).
3. **Immutability:** Prefer Java `record` for DTOs and value objects.
4. **Lombok Usage:** Restricted to `@Getter`, `@Setter`, `@Builder`, and `@Slf4j` on Domain entities/services.
5. **No Nulls:** Use `Optional<T>` for optional return types; never return bare `null` for collections (return `Collections.emptyList()`).

---

## 21. Maven Dependencies Specifications (`pom.xml`)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    
    <!-- AI Integration -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-gemini-spring-boot-starter</artifactId>
        <version>1.0.0-M1</version>
    </dependency>

    <!-- Database & Migrations -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-database-postgresql</artifactId>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <dependency>
        <groupId>com.google.zxing</groupId>
        <artifactId>core</artifactId>
        <version>3.5.3</version>
    </dependency>
</dependencies>
```

---

## 22. Spring Boot Configuration Specifications (`application.yml`)

```yaml
spring:
  application:
    name: eventsphere-ai
  profiles:
    active: dev
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/eventsphere}
    username: ${DB_USER:postgres}
    password: ${DB_PASS:postgres}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASS:}
  flyway:
    enabled: true
    baseline-on-migrate: true

server:
  port: 8080
  error:
    include-message: always
```

---

## 23. Redis Integration Strategy

- **Primary Roles:**
  1. **HTTP Session Cache:** Storing token blacklists and active user sessions.
  2. **Rate Limiter:** Token Bucket algorithm for API requests per IP/Tenant.
  3. **High-Frequency Counters:** Real-time event check-in counts.
  4. **Async Task Queue:** Email/Notification delivery queues.
- **TTL Strategy:**
  - Token Blacklist: Dynamic matching token expiry.
  - Analytics Counters: 5-minute cache TTL.
  - User Sessions: 30-minute rolling TTL.

---

## 24. Qdrant Vector Integration Strategy

- **Role:** High-dimensional vector database for retrieval-augmented generation (RAG) and semantic similarity search.
- **Collections:**
  1. `events_embeddings`: Vectorized event descriptions, tags, and abstracts.
  2. `documents_embeddings`: Vectorized text chunks from uploaded brochures, policy documents, and rulebooks.
  3. `feedback_embeddings`: Vectorized attendee feedback for sentiment clustering.
- **Embedding Model:** Google Gemini `text-embedding-004` (768 dimensions).
- **Search Pipeline:** Query Vectorized → Qdrant Cosine Similarity Search (top 5 matches) → Relevant context injected into Gemini LLM prompt.

---

## 25. Storage Strategy

- **Provider:** Supabase Object Storage (S3-compatible API).
- **Bucket Hierarchy:**
  - `org-assets/`: Logos, branding banners (`/tenant_id/org_id/`)
  - `event-assets/`: Event covers, promotional posters (`/tenant_id/event_id/`)
  - `certificates/`: Generated certificate PDFs (`/tenant_id/event_id/`)
  - `documents/`: Uploaded brochures, rulebooks, presentations (`/tenant_id/event_id/`)
- **Access Control:** Public read for event assets; pre-signed signed URLs with 15-minute expiration for private documents and contracts.

---

## 26. Deployment Architecture

```
┌───────────────────────────┐      ┌───────────────────────────┐
│     Frontend Web App      │      │     Mobile App Bundles    │
│   (Vercel Edge Network)   │      │  (App Store / Play Store) │
└─────────────┬─────────────┘      └─────────────┬─────────────┘
              │                                  │
              └─────────────────┬────────────────┘
                                │ HTTPS / TLS 1.3
                                ▼
              ┌──────────────────────────────────┐
              │    Render Cloud Container Service│
              │  (Spring Boot Docker Deployment) │
              └─────────────────┬────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│     Neon     │        │ Redis Cloud  │        │ Qdrant Cloud │
│  PostgreSQL  │        │ Cache/Queue  │        │ Vector DB    │
└──────────────┘        └──────────────┘        └──────────────┘
```

---

> **STOP:** Sprint 1 Architecture & Technical Foundation document is complete and saved to `docs/sprint-1/TECHNICAL-ARCHITECTURE.md`.
> **Status:** Awaiting user approval to proceed to Sprint 2 implementation.
