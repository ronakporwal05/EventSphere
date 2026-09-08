# EventSphere AI — High-Level System Architecture

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## 1. Architecture Overview

EventSphere AI follows a **Modular Monolith** architecture using **Clean Architecture** and **Domain-Driven Design (DDD)** principles. The system is deployed as a single Spring Boot application but internally organized into independent business modules with clear boundaries.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│                                                                      │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│   │  Next.js Web  │    │ Flutter App  │    │  Third-Party  │          │
│   │  (Vercel)     │    │ (Mobile)     │    │  Integrations │          │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │
│          │                    │                    │                  │
└──────────┼────────────────────┼────────────────────┼─────────────────┘
           │                    │                    │
           │         HTTPS / REST (JSON)             │
           │         API Versioning (/api/v1)        │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                                │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │              Spring Boot Application                      │      │
│   │                                                           │      │
│   │   ┌─────────┐  ┌───────────┐  ┌──────────┐  ┌────────┐ │      │
│   │   │  CORS   │  │   Rate    │  │   JWT    │  │ Tenant │ │      │
│   │   │ Filter  │  │  Limiter  │  │  Filter  │  │ Filter │ │      │
│   │   └─────────┘  └───────────┘  └──────────┘  └────────┘ │      │
│   │                                                           │      │
│   │   ┌─────────┐  ┌───────────┐  ┌──────────┐              │      │
│   │   │  CSRF   │  │   Input   │  │  Audit   │              │      │
│   │   │ Filter  │  │ Validator │  │ Intercept│              │      │
│   │   └─────────┘  └───────────┘  └──────────┘              │      │
│   │                                                           │      │
│   │   ┌───────────────────────────────────────────────────┐  │      │
│   │   │          REST Controllers (DTOs + Pagination)     │  │      │
│   │   │          OpenAPI / Swagger Documentation          │  │      │
│   │   └───────────────────────────────────────────────────┘  │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BUSINESS MODULE LAYER                              │
│                                                                      │
│  Row 1: Core Platform                                                │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│   │  Auth  │ │ Tenant │ │  Org   │ │  User  │ │  Role  │          │
│   │ Module │ │ Module │ │ Module │ │ Module │ │ Module │          │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                      │
│  Row 2: Event Operations                                             │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│   │ Event  │ │Session │ │ Venue  │ │ Regist │ │ Ticket │          │
│   │ Module │ │ Module │ │ Module │ │ Module │ │ Module │          │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                      │
│  Row 3: Workflow & Operations                                        │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│   │Workflow│ │Attend. │ │Voluntr │ │  Task  │ │Resource│          │
│   │ Engine │ │ Module │ │ Module │ │ Module │ │ Module │          │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                      │
│  Row 4: Engagement & Intelligence                                    │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│   │Sponsor │ │ Cert   │ │ Notif  │ │Analtic │ │  Doc   │          │
│   │+Vendor │ │ Module │ │ Center │ │ Module │ │ Module │          │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                                      │
│  Row 5: AI & Compliance                                              │
│   ┌────────┐ ┌────────┐                                             │
│   │   AI   │ │ Audit  │                                             │
│   │ Module │ │ Module │                                             │
│   └────────┘ └────────┘                                             │
│                                                                      │
│   Each module contains:                                              │
│   [Controller] → [Service] → [Repository] → [Entity]               │
│   With DTO mapping at controller boundaries                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   DATA & INFRASTRUCTURE LAYER                        │
│                                                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│   │  PostgreSQL   │  │    Redis     │  │   Qdrant     │             │
│   │  (Neon)       │  │   (Cache)    │  │  (Vectors)   │             │
│   │               │  │              │  │              │             │
│   │ • All domain  │  │ • Sessions   │  │ • Event      │             │
│   │   entities    │  │ • Hot data   │  │   embeddings │             │
│   │ • tenant_id   │  │ • Rate limit │  │ • Document   │             │
│   │   on every    │  │   counters   │  │   embeddings │             │
│   │   table       │  │ • Token      │  │ • Feedback   │             │
│   │ • Workflow    │  │   blacklist  │  │   vectors    │             │
│   │   state       │  │ • Email queue│  │ • FAQ data   │             │
│   │ • Resource    │  │ • Attendance │  │              │             │
│   │   allocation  │  │   counters   │  │              │             │
│   └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│   ┌──────────────┐  ┌──────────────┐                                │
│   │  Supabase    │  │  Gemini API  │                                │
│   │  Storage     │  │  + Spring AI │                                │
│   │              │  │              │                                │
│   │ • Banners    │  │ • NL queries │                                │
│   │ • Documents  │  │ • Summaries  │                                │
│   │ • Certificates│  │ • Sentiment │                                │
│   │ • Avatars    │  │ • RAG        │                                │
│   │ • Contracts  │  │ • FAQ Gen    │                                │
│   │ • Brochures  │  │ • Content Gen│                                │
│   │ • Posters    │  │ • Schedule   │                                │
│   └──────────────┘  └──────────────┘                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Communication

### 2.1 Client → Backend

| Client | Protocol | Authentication | Description |
|--------|----------|---------------|-------------|
| Next.js Web App | HTTPS REST (JSON) | JWT Bearer Token in `Authorization` header | All CRUD operations, dashboard data, admin actions |
| Flutter Mobile App | HTTPS REST (JSON) | JWT Bearer Token in `Authorization` header | Event browsing, QR scanning, check-in, attendee features, offline ticket cache |
| Third-Party Systems | HTTPS REST (JSON) | API Key in `X-API-Key` header | Webhook callbacks, external integrations |

**API Standards:**
- All endpoints versioned under `/api/v1/`
- Pagination via `page`, `size`, `sort` query parameters
- Filtering via query parameters per resource
- OpenAPI 3.0 documentation auto-generated via Swagger

**Tenant Resolution:** Every request includes tenant context via one of:
- `X-Tenant-ID` header (for API clients)
- Subdomain extraction (e.g., `gla.eventsphere.ai`)
- JWT claim (embedded `tenant_id` in token payload)

### 2.2 Backend → PostgreSQL (Neon)

| Aspect | Detail |
|--------|--------|
| ORM | Hibernate via Spring Data JPA |
| Connection | HikariCP connection pool (max 20 connections) |
| Tenant Isolation | `@TenantFilter` annotation auto-appends `WHERE tenant_id = ?` |
| Transactions | `@Transactional` on all service methods with write operations |
| Migrations | Flyway for versioned schema migrations |

### 2.3 Backend → Redis

| Use Case | Pattern | TTL |
|----------|---------|-----|
| User session cache | `session:{userId}` → JSON | 30 min |
| Event details cache | `event:{eventId}` → JSON | 5 min |
| Rate limiting | `ratelimit:{ip}:{endpoint}` → counter | 1 min |
| Token blacklist | `blacklist:{jti}` → "1" | Matches token expiry |
| Real-time attendance count | `attendance:{eventId}` → counter | No expiry (reset on event end) |
| Email queue | `email:queue` → list | Until processed |
| Resource availability | `resource:{resourceId}:available` → boolean | 5 min |

### 2.4 Backend → Qdrant (Vector Database)

| Use Case | Description |
|----------|-------------|
| Event Knowledge Base | Event descriptions, session abstracts, and historical data embedded as vectors |
| RAG Retrieval | AI assistant queries retrieve relevant context from Qdrant before prompting Gemini |
| Feedback Analysis | Feedback text embedded for similarity search and clustering |
| Document RAG | Uploaded brochures, rulebooks, policies indexed for AI Q&A |
| FAQ Generation | Historical Q&A and event data used to auto-generate FAQ responses |

### 2.5 Backend → Gemini API (via Spring AI / LangChain4j)

| Use Case | Flow |
|----------|------|
| Event Planning Assistant | User query → Retrieve context from Qdrant → Augment prompt → Gemini generates response |
| Post-Event Summary | Aggregate event data → Generate structured summary via Gemini |
| Sentiment Analysis | Batch feedback text → Gemini classifies sentiment (positive/neutral/negative) |
| Schedule Optimization | Attendee preferences + speaker availability → Gemini suggests optimal schedule |
| FAQ Generation | Event data + past queries → Gemini generates FAQ document |
| Content Generation | Event details → Gemini generates descriptions, social media posts, email drafts |
| Report Generation | Analytics data → Gemini generates narrative event success reports |

### 2.6 Backend → Supabase Storage

| Use Case | Bucket |
|----------|--------|
| Organization logos/banners | `org-assets/{tenantId}/` |
| Event banners | `event-assets/{tenantId}/{eventId}/` |
| Generated certificates | `certificates/{tenantId}/{eventId}/` |
| User avatars | `avatars/{tenantId}/` |
| Documents (brochures, posters, rulebooks) | `documents/{tenantId}/{eventId}/` |
| Sponsor/Vendor contracts | `contracts/{tenantId}/{eventId}/` |
| Speaker presentations | `presentations/{tenantId}/{eventId}/` |

### 2.7 Backend → Email (SMTP)

| Trigger | Template |
|---------|----------|
| Registration confirmation | `registration-confirmed.html` |
| Ticket issuance | `ticket-ready.html` (with PDF attachment) |
| Event reminder (configurable schedule) | `event-reminder.html` |
| Schedule/venue change | `schedule-update.html` |
| Certificate available | `certificate-ready.html` |
| Feedback request | `feedback-request.html` |
| Password reset | `password-reset.html` |
| Broadcast message | `broadcast.html` |
| Emergency notification | `emergency.html` |

**Email Infrastructure:**
- Background queue (Redis-backed) for async delivery
- Retry mechanism with exponential backoff (3 retries)
- Delivery tracking and status logging
- Audience segmentation for targeted sends

---

## 3. Why Modular Monolith?

### Decision Rationale

| Factor | Monolith | Microservices | Modular Monolith ✅ |
|--------|----------|---------------|---------------------|
| Deployment complexity | Simple | High (K8s, service mesh) | Simple |
| Development speed | Fast | Slow (distributed tracing, API contracts) | Fast |
| Data consistency | Easy (single DB) | Hard (saga pattern, eventual consistency) | Easy |
| Team size fit | ≤5 devs | 10+ devs | ≤5 devs |
| Future scalability | Hard to split | Already split | Designed to split |
| Operational cost | Low | High | Low |

**Key Principle:** Each module communicates through **well-defined interfaces (Java interfaces/services)**, not direct entity access. This means any module can be extracted into its own service in the future by replacing the interface implementation with an HTTP/gRPC client.

---

## 4. Multi-Tenant Architecture Decision

### Approach: Shared Database + Shared Schema + `tenant_id`

**Why this approach over alternatives:**

| Approach | Isolation | Cost | Complexity | Chosen? |
|----------|-----------|------|------------|---------|
| Separate DB per tenant | Highest | Very High (one DB per org) | High (connection management) | ❌ |
| Shared DB, Separate Schema | High | High (schema per org) | Medium (migrations per schema) | ❌ |
| **Shared DB, Shared Schema, tenant_id** | **Medium** | **Low (single DB)** | **Low** | **✅** |

**Justification:**
1. **Cost efficiency** — Neon PostgreSQL free tier supports the entire platform. Separate DBs would require paid plans per tenant.
2. **Operational simplicity** — Single database means single migration path, single backup strategy, single connection pool.
3. **Sufficient isolation** — Row-level security via `tenant_id` on every table. Enforced at the repository layer, not the application layer, making bypass nearly impossible.
4. **Query simplicity** — Cross-tenant analytics (for Super Admin) are simple JOINs, not distributed queries.
5. **Scalability path** — If a tenant outgrows the shared model, they can be migrated to a dedicated schema or database without architectural changes.

**Isolation enforcement:**
- Every entity has a `tenant_id` column (NOT NULL, indexed)
- A Hibernate `@Filter` automatically appends `tenant_id` to all queries
- A `TenantContext` ThreadLocal holds the current tenant, set by the `TenantFilter` in the request pipeline
- Integration tests verify cross-tenant queries return zero results

---

## 5. Security Architecture

```
Request Flow:
                                                                    
[Client] → HTTPS → [CORS] → [CSRF] → [Rate Limiter] → [JWT Filter] → [Tenant Filter] → [Input Validator] → [Controller]
                                            │                │                │
                                            ▼                ▼                ▼
                                       Validate JWT    Resolve tenant_id   Sanitize input
                                       Extract roles    Set TenantContext   Prevent XSS
                                       Check perms      Apply data filter   Prevent SQLi
```

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS/TLS enforced |
| Authentication | JWT with RS256 signing, refresh token rotation |
| Authorization | Spring Security with `@PreAuthorize` annotations |
| Tenant Isolation | `TenantFilter` + Hibernate `@Filter` |
| Rate Limiting | Redis-backed sliding window (100 req/min for auth, 1000 req/min general) |
| Input Validation | Jakarta Bean Validation on all DTOs |
| CORS | Allowlist of frontend origins |
| CSRF | CSRF protection for browser-based requests |
| XSS Prevention | Output encoding, Content Security Policy headers |
| SQL Injection Prevention | Parameterized queries via JPA, no raw SQL |
| Password Policy | Minimum 8 chars, complexity requirements, BCrypt strength 12 |
| Email Verification | Required before full account activation |
| Account Locking | Lock after 5 failed attempts, auto-unlock after 30 min |
| Audit | Every mutation logged to audit table with before/after state |

---

## 6. Deployment Architecture

```
┌──────────────────┐     ┌──────────────────┐
│   Vercel          │     │   App Stores      │
│   (Next.js)       │     │   (Flutter APK)   │
│   eventsphere.ai  │     │                   │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │     HTTPS REST API     │
         ▼                        ▼
┌──────────────────────────────────────────┐
│   Render                                  │
│   (Spring Boot Docker Container)          │
│   api.eventsphere.ai                      │
└─────┬──────────┬──────────┬──────────────┘
      │          │          │
      ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌─────────────┐
│   Neon   │ │ Redis  │ │  Supabase   │
│ Postgres │ │ Cloud  │ │  Storage    │
└──────────┘ └────────┘ └─────────────┘
```

| Service | Provider | Tier | Purpose |
|---------|----------|------|---------|
| Backend API | Render | Free / Starter | Spring Boot application |
| Web Frontend | Vercel | Free | Next.js SSR/SSG |
| Database | Neon PostgreSQL | Free | Relational data |
| Cache | Redis (Render) | Free | Caching, rate limiting, sessions, email queue |
| File Storage | Supabase Storage | Free | Uploads, certificates, contracts, assets |
| Vector DB | Qdrant Cloud | Free | AI embeddings, RAG |
| AI | Gemini API | Free | LLM inference (assistant, reports, FAQ, content gen) |
| CI/CD | GitHub Actions | Free | Build, test, deploy pipelines |

---

## 7. Performance Targets

Based on realistic production load analysis:

| Metric | Target |
|--------|--------|
| Attendees per event | 5,000+ |
| Concurrent active users | 500 |
| QR scans per minute | 100 |
| Registrations per hour | 1,000 |
| API response time (P95) | < 500ms |
| QR scan-to-response | < 3 seconds |
| Email delivery success | > 98% |
| QR validation accuracy | > 99% |
| System availability | 99.5% |
