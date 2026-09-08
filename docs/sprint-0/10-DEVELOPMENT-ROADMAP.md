# EventSphere AI — Development Roadmap

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## Roadmap Overview

The project is broken into **16 sprints** (Sprint 0–15), each lasting **1–2 weeks** depending on complexity. The roadmap follows a strict dependency order — each sprint builds on the output of the previous. Updated to include Workflow Automation, Resource Management, Task Management, and expanded modules.

```
Sprint 0   ─► Sprint 1   ─► Sprint 2   ─► Sprint 3   ─► Sprint 4
Architecture   Auth          Tenants &     Events        Registration
                             Organizations (9-state       & Teams
                                           lifecycle)

    ─► Sprint 5   ─► Sprint 6   ─► Sprint 7      ─► Sprint 8
       QR            Attendance     Workflow         Certificates
       Ticketing                    Automation

    ─► Sprint 9     ─► Sprint 10  ─► Sprint 11  ─► Sprint 12
       Notifications    Analytics    Resources,   AI
       (Expanded)       + Audit      Tasks &      Integration
                        (Full)       Volunteers   (7 Features)

    ─► Sprint 13  ─► Sprint 14  ─► Sprint 15
       Frontend      Flutter       Docker &
       (Next.js)     Mobile        CI/CD
```

---

## Sprint 0 — Architecture & Planning ✅ (Complete)

**Duration:** 1 week
**Status:** Complete

### Deliverables
| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Product Requirement Document (PRD) | ✅ Complete |
| 2 | Software Requirement Specification (SRS) | ✅ Complete |
| 3 | High-Level System Architecture | ✅ Complete |
| 4 | Module Breakdown (22 modules) | ✅ Complete |
| 5 | User Role Permission Matrix (9 roles) | ✅ Complete |
| 6 | User Journeys | ✅ Complete |
| 7 | Database Planning (~49 tables) | ✅ Complete |
| 8 | Folder Structure | ✅ Complete |
| 9 | Git Strategy | ✅ Complete |
| 10 | Development Roadmap | ✅ Complete |

### Exit Criteria
- [ ] All 10 documents reviewed and approved
- [ ] Repository initialized with folder structure
- [ ] Development environment setup guide written
- [ ] Team alignment on architecture decisions

---

## Sprint 1 — Authentication & Authorization

**Duration:** 2 weeks
**Dependencies:** Sprint 0

### Objectives
- Set up Spring Boot project with Maven, JPA, PostgreSQL, Redis
- Implement user registration with email verification
- Implement login with password complexity validation
- Implement JWT (access + refresh token) with RS256 signing and refresh token rotation
- Implement password reset via email OTP
- Implement RBAC with Spring Security (9 roles)
- Implement account locking after failed attempts
- Set up rate limiting on auth endpoints
- Set up CSRF protection and XSS prevention
- Set up global exception handling
- Set up Flyway database migrations
- Set up login history tracking

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Spring Boot project scaffold | pom.xml, application.yml, profiles |
| User entity & repository | users table, BCrypt password hashing (strength 12) |
| Auth controller & service | POST /api/v1/auth/register, /login, /refresh, /logout |
| Email verification | Verify email before account activation |
| JWT infrastructure | JwtTokenProvider, JwtAuthenticationFilter, RS256 key pair |
| Refresh token rotation | New refresh token issued on every refresh |
| RBAC foundation | 9 roles, Permission entities; @PreAuthorize annotations |
| Password reset flow | OTP generation, email sending, OTP verification |
| Account locking | Lock after 5 failed attempts, auto-unlock 30 min |
| Security filters | RateLimitFilter, XssPreventionFilter, InputSanitizer |
| Global error handling | GlobalExceptionHandler with standardized error responses |
| Login history | Track all login attempts with IP and device info |
| Database migrations | V1-V3 Flyway scripts for users, roles, permissions |
| OpenAPI documentation | Swagger/OpenAPI for auth endpoints |
| Unit & integration tests | Auth flow tests, JWT validation tests |

### Key Decisions
- JWT access token: 15 min TTL, refresh token: 7 day TTL
- RS256 (asymmetric) signing for JWT
- Refresh token rotation: new refresh token issued on every refresh
- All APIs versioned under `/api/v1/`
- Pagination, filtering, sorting on all list endpoints

---

## Sprint 2 — Tenant & Organization Management

**Duration:** 2 weeks
**Dependencies:** Sprint 1

### Objectives
- Implement tenant CRUD (Super Admin only)
- Implement TenantContext and TenantFilter
- Implement Hibernate @Filter for automatic tenant_id filtering
- Implement organization CRUD with teams and departments
- Implement user invitation and team management
- Implement tenant-scoped user roles (TenantMembership)

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Tenant entity & APIs | CRUD with slug, branding, status, subscription tier |
| TenantContext | ThreadLocal tenant resolution from JWT/header |
| TenantFilter | Servlet filter to set tenant context per request |
| Hibernate tenant filter | @Filter annotation auto-appending tenant_id to queries |
| Organization entity & APIs | CRUD within tenant scope |
| Department entity & APIs | Teams and departments within organizations |
| TenantMembership | User-tenant-role mapping, multi-tenant membership |
| User invitation flow | Invite via email → verify → accept → join org with role |
| Tenant isolation tests | Integration tests proving cross-tenant isolation |

### Key Decisions
- TenantContext stored in ThreadLocal, cleared after request
- Every tenant-scoped repository extends TenantAwareRepository
- Tenant resolution order: JWT claim → X-Tenant-ID header → subdomain

---

## Sprint 3 — Event Management (Expanded Lifecycle)

**Duration:** 2 weeks
**Dependencies:** Sprint 2

### Objectives
- Implement event CRUD with expanded 9-state lifecycle
- Implement event types (Conference, Hackathon, Workshop, etc.) and categories
- Implement multi-day event support
- Implement session and schedule management
- Implement venue and room management
- Implement speaker assignment to sessions
- Implement custom registration form fields
- Implement event cloning and templates

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Event entity & APIs | Full CRUD with 9-state transitions |
| Event state machine | Draft → Review → Approved → Published → Registration Open → Live → Completed → Certificate Generated → Archived |
| Event templates | Save/clone events as reusable templates |
| Session entity & APIs | Session CRUD, multi-track scheduling |
| Venue & Room entities | Venue/room CRUD, conflict detection |
| Speaker assignment | Map speakers to sessions (many-to-many) |
| Custom fields | EventCustomField entity for dynamic registration forms |
| Event cloning | Clone event with sessions, venues, custom fields |

---

## Sprint 4 — Registration & Teams

**Duration:** 1.5 weeks
**Dependencies:** Sprint 3

### Objectives
- Implement public event registration
- Implement team registration for hackathons
- Implement registration form with custom fields
- Implement capacity management
- Implement waitlist system
- Implement registration moderation (approve/reject)
- Implement bulk operations (bulk approve, export)

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Registration entity & APIs | Register, approve, reject, cancel |
| Team registration | Team entity, team members, team-based registration |
| Public registration endpoint | Unauthenticated registration for published events |
| Capacity enforcement | Auto-close registration at capacity (BR-04) |
| Waitlist | Queue management, auto-promotion on cancellation |
| Moderation flow | Pending → Approved/Rejected workflow |
| Bulk operations | Bulk approve, bulk export (CSV) |
| Registration status tracking | Status transitions with audit logging |

---

## Sprint 5 — QR Ticketing (Enhanced Security)

**Duration:** 1.5 weeks
**Dependencies:** Sprint 4

### Objectives
- Implement QR code generation with digital signatures
- Implement encrypted QR payload (Ticket ID, Event ID, User ID, Tenant ID, Expiry)
- Implement ticket PDF generation
- Implement ticket validation endpoint
- Implement ticket revocation and expiry
- Integrate Supabase Storage for ticket PDFs

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Ticket entity & APIs | Generate, validate, revoke (5 states incl. EXPIRED) |
| QR code generation | Digitally signed + encrypted QR payloads |
| QR payload contents | Ticket ID, Event ID, User ID, Tenant ID, Signature, Expiry |
| PDF generation | Ticket PDF with attendee info, QR code, event details |
| Ticket validation API | Validate QR payload → signature, status, expiry, tenant check |
| Ticket validation logging | Log every scan attempt to ticket_validation_logs |
| Supabase integration | Upload ticket PDFs to Supabase Storage |
| Anti-forgery measures | Digital signature validation, expiry enforcement |

---

## Sprint 6 — Attendance

**Duration:** 1 week
**Dependencies:** Sprint 5

### Objectives
- Implement QR scan check-in endpoint
- Implement manual check-in fallback
- Implement duplicate check-in prevention (BR-05)
- Implement session-level attendance
- Implement real-time attendance counter (Redis)
- Implement live attendance dashboard data
- Implement attendance export

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Attendance entity & APIs | QR check-in, manual check-in, session attendance |
| QR scan endpoint | POST /api/v1/attendance/check-in with QR payload |
| Manual check-in | Fallback for edge cases (no QR) |
| Duplicate prevention | Unique constraint + application-level check |
| Redis live counter | Real-time attendance count per event |
| Live dashboard data | Attendance feed for real-time dashboard |
| Attendance export | CSV/Excel export for organizers |

---

## Sprint 7 — Workflow Automation (NEW)

**Duration:** 1.5 weeks
**Dependencies:** Sprint 6

### Objectives
- Implement configurable workflow engine
- Implement event approval workflow (Draft → Review → Approved)
- Implement registration approval automation
- Implement auto QR ticket generation after registration approval
- Implement configurable reminder automation
- Implement certificate eligibility verification
- Implement auto-feedback request after event completion
- Implement auto-report generation after event completion

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Workflow engine | Configurable workflow definitions and execution |
| Event approval flow | Submit for review → approve/reject with comments |
| Approval records | Track all approval decisions with timestamps |
| Auto-ticket generation | Workflow triggers ticket creation on registration approval |
| Reminder automation | Configurable scheduled reminders (24h, 1h before event) |
| Certificate auto-eligibility | Determine eligibility based on attendance rules |
| Post-event automation | Auto-trigger feedback requests and report generation |
| Workflow status tracking | Dashboard showing active workflows and their status |

> **🎯 MVP Checkpoint:** At the end of Sprint 7, the backend MVP is complete. The system can manage tenants, events, registrations, tickets, attendance, and has workflow automation — all via API.

---

## Sprint 8 — Certificates

**Duration:** 1 week
**Dependencies:** Sprint 7

### Objectives
- Implement certificate template management
- Implement bulk certificate generation (async, workflow-triggered)
- Implement QR verification codes and public verification URLs
- Implement certificate download for attendees
- Implement public certificate verification page

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Certificate template entity | Template CRUD, HTML-based templates |
| Bulk generation service | Async batch job, workflow-triggered generation |
| QR verification | Each cert gets QR code linking to public verification page |
| Verification system | Unique codes, public /api/v1/verify/{code} endpoint |
| Certificate download | Attendee dashboard download, Supabase Storage |
| Auto-notification | Workflow triggers "certificate ready" notification |

---

## Sprint 9 — Communication & Notification Center (Expanded)

**Duration:** 2 weeks
**Dependencies:** Sprint 8

### Objectives
- Implement email notification service with queue and retry
- Implement in-app notification system
- Implement notification templates for all 9 types (registration, reminder, schedule update, venue change, certificate, feedback, broadcast, emergency, password reset)
- Implement scheduled notifications
- Implement audience segmentation for targeted notifications
- Implement delivery tracking (sent/delivered/failed)
- Implement bulk and broadcast notification sending
- Implement email retry mechanism with exponential backoff

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Email service | SMTP + Redis queue, HTML templates (Thymeleaf), retry with backoff |
| In-app notifications | Notification entity, user notification center API |
| Template engine | 9 notification templates with variable substitution |
| Scheduled notifications | Schedule future delivery (reminder campaigns) |
| Audience segmentation | Target by role, registration status, attendance |
| Delivery tracking | Track send/deliver/fail status per notification |
| Broadcast & emergency | Send to all users in event/org, high-priority alerts |
| Event triggers | Auto-send on: registration, ticket, reminder, certificate, feedback |

---

## Sprint 10 — Analytics & Audit (Full)

**Duration:** 1.5 weeks
**Dependencies:** Sprint 9

### Objectives
- Implement event-level analytics (registrations, check-ins, no-shows)
- Implement organization-level analytics (trends across events)
- Implement platform-level analytics (Super Admin)
- Implement volunteer performance analytics
- Implement sponsor/vendor analytics
- Implement report export (PDF, CSV)
- Implement Redis caching for dashboard queries
- Finalize audit module with login history, approval logs, ticket validation logs

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Analytics service | Aggregation queries for all metrics |
| Event dashboard API | Registration count, check-in rate, no-show %, conversion |
| Organization dashboard | Cross-event trends, growth metrics |
| Platform dashboard | Tenant usage, system health (Super Admin) |
| Volunteer performance | Tasks completed, hours, events served |
| Sponsor analytics | Lead collection, brand exposure, ROI |
| Report export | PDF and CSV export endpoints |
| Redis caching | Cache analytics results with 5-min TTL |
| Audit finalization | Login history, approval logs, ticket scan logs searchable |

---

## Sprint 11 — Resources, Tasks & Volunteers

**Duration:** 1.5 weeks
**Dependencies:** Sprint 10

### Objectives
- Implement resource management (inventory, allocation, double-booking prevention)
- Implement task management (create, assign, track, overdue notifications)
- Implement volunteer portal (registration, shifts, attendance, performance)
- Implement document management with version control and RAG indexing
- Implement sponsor & vendor management (booth allocation, contracts, leads)

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Resource entity & APIs | CRUD, allocation, double-booking prevention |
| Resource availability | Dashboard showing real-time availability |
| Task entity & APIs | CRUD, assignment, priority, deadline, status tracking |
| Overdue notifications | Auto-notify for overdue tasks |
| Volunteer portal | Registration, shift scheduling, attendance, performance |
| Document management | Upload, version control, access control, RAG indexing |
| Sponsor management | Tiers, profiles, branding placement |
| Vendor management | Registration, booth allocation, contracts, lead collection |

---

## Sprint 12 — AI Integration (7 Features)

**Duration:** 2 weeks
**Dependencies:** Sprint 11

### Objectives
- Integrate Gemini API via Spring AI / LangChain4j
- Set up Qdrant for vector storage
- Implement knowledge ingestion pipeline (embed event data + uploaded documents)
- Implement RAG-based event assistant with source citations (BR-10)
- Implement AI event planning assistant
- Implement AI report generator
- Implement AI feedback analyzer (sentiment)
- Implement AI FAQ generator
- Implement AI schedule optimizer (conflict detection)
- Implement AI content generator (descriptions, social posts, emails)

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Gemini integration | Spring AI / LangChain4j configuration |
| Qdrant setup | Vector DB for event/document embeddings |
| Knowledge ingestion | Embed event data, session abstracts, uploaded documents |
| RAG pipeline | Context retrieval → prompt augmentation → Gemini response |
| AI assistant API | POST /api/v1/ai/chat with conversation history |
| AI planning | Resource estimation, volunteer requirements |
| AI reports | Auto-generate narrative event success reports |
| AI feedback analysis | Batch analyze feedback sentiment |
| AI FAQ generator | Auto-generate FAQ from event data + past queries |
| AI schedule optimizer | Detect conflicts, suggest optimal arrangements |
| AI content generator | Generate descriptions, social posts, email drafts |
| Source citations | All RAG responses cite source documents |

---

## Sprint 13 — Frontend (Next.js)

**Duration:** 3 weeks
**Dependencies:** Sprint 12

### Objectives
- Set up Next.js project with TypeScript, Tailwind CSS
- Implement authentication pages (login, register, verify email, forgot password)
- Implement admin dashboard with sidebar navigation
- Implement event management pages (list, create, detail, edit, 9-state lifecycle)
- Implement registration management page (individual + team)
- Implement attendance dashboard (QR scan, manual, live counter)
- Implement certificate management page
- Implement workflow configuration and status pages
- Implement resource management and allocation pages
- Implement task management pages
- Implement analytics dashboard with charts
- Implement notification center and delivery tracking
- Implement document management with version history
- Implement AI assistant chat interface
- Implement sponsor & vendor management pages
- Implement public event pages
- Implement attendee portal (tickets, certificates, schedule)

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Project setup | Next.js 14+, TypeScript, Tailwind, Zustand |
| Auth pages | Login, register, email verification, forgot password |
| Dashboard layout | Sidebar, header, responsive layout |
| Event pages | CRUD forms, 9-state lifecycle, session builder |
| Registration page | Table with approve/reject, team view, bulk actions |
| Attendance page | Real-time count, attendee list, scan interface |
| Certificate page | Template selection, generation trigger, status |
| Workflow pages | Configure workflows, view approval status |
| Resource pages | Inventory, allocation calendar, availability |
| Task pages | Kanban/list view, assignment, deadlines |
| Analytics page | Charts, metric cards, export |
| Notification center | Templates, segments, delivery tracking |
| Document pages | Upload, version history, access control |
| AI assistant | Chat interface with streaming responses, source citations |
| Sponsor/vendor pages | Tier management, booth allocation, contracts, leads |
| Public pages | Event discovery, event detail, registration form |
| Attendee portal | My tickets, my certificates, my events |

---

## Sprint 14 — Flutter Mobile App

**Duration:** 2 weeks
**Dependencies:** Sprint 13

### Objectives
- Set up Flutter project
- Implement authentication screens
- Implement event discovery and detail views
- Implement QR code scanner for check-in (volunteer feature)
- Implement digital ticket display with QR and offline support
- Implement schedule view
- Implement certificate download
- Implement AI assistant chat
- Implement push notifications (Firebase Cloud Messaging)
- Implement attendee profile

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Flutter project setup | State management (Riverpod/Bloc), API client, theming |
| Auth screens | Login, register with JWT token management |
| Event screens | Event list, event detail, session schedule |
| QR scanner | Camera-based QR scanning, check-in confirmation |
| Digital ticket | Display QR ticket, download PDF, offline ticket cache |
| Schedule view | Event schedule with session details |
| Certificate screen | View and download certificates |
| AI assistant | Chat interface for mobile |
| Push notifications | FCM integration, notification handling |
| Profile screen | User profile, my events, my certificates |

---

## Sprint 15 — Docker, CI/CD & Production Deployment

**Duration:** 2 weeks
**Dependencies:** Sprint 14

### Objectives
- Create Dockerfiles for backend, frontend
- Create docker-compose for local development (PostgreSQL, Redis, Qdrant)
- Create docker-compose for production
- Optimize images (multi-stage builds)
- Set up GitHub Actions for backend CI (build, test, lint)
- Set up GitHub Actions for frontend CI (build, test, lint)
- Set up deployment pipeline to Render (backend)
- Set up deployment pipeline to Vercel (frontend)
- Configure Neon PostgreSQL for production
- Configure production Redis
- Set up monitoring and health checks
- Security hardening review
- Performance testing

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Dockerfile.backend | Multi-stage build, JRE-slim base, < 200MB |
| Dockerfile.frontend | Multi-stage with nginx, < 100MB |
| docker-compose.yml | Local dev: PostgreSQL, Redis, Qdrant, backend, frontend |
| docker-compose.prod.yml | Production compose with env injection |
| Backend CI | Build → Test → Lint → Security scan |
| Frontend CI | Build → Test → Lint |
| Backend deployment | Auto-deploy to Render on main push |
| Frontend deployment | Auto-deploy to Vercel on main push |
| Production database | Neon PostgreSQL provisioning, connection config |
| Health checks | /actuator/health endpoint, uptime monitoring |
| Security review | Dependency scan, OWASP checklist, secrets audit |
| Performance test | Load test: 500 concurrent users, 100 QR scans/min, 1000 reg/hr |
| Production documentation | Runbook, incident response, rollback procedures |

---

## Timeline Summary

| Sprint | Module | Duration | Cumulative |
|--------|--------|----------|------------|
| 0 | Architecture & Planning | 1 week | Week 1 |
| 1 | Authentication & Authorization | 2 weeks | Week 3 |
| 2 | Tenants & Organizations | 2 weeks | Week 5 |
| 3 | Events, Sessions, Venues (9-state) | 2 weeks | Week 7 |
| 4 | Registration & Teams | 1.5 weeks | Week 8.5 |
| 5 | QR Ticketing (Enhanced) | 1.5 weeks | Week 10 |
| 6 | Attendance | 1 week | Week 11 |
| 7 | Workflow Automation | 1.5 weeks | **Week 12.5 (MVP)** |
| 8 | Certificates | 1 week | Week 13.5 |
| 9 | Communication Center (Expanded) | 2 weeks | Week 15.5 |
| 10 | Analytics & Audit (Full) | 1.5 weeks | Week 17 |
| 11 | Resources, Tasks & Volunteers | 1.5 weeks | Week 18.5 |
| 12 | AI Integration (7 Features) | 2 weeks | Week 20.5 |
| 13 | Frontend (Next.js) | 3 weeks | Week 23.5 |
| 14 | Flutter Mobile | 2 weeks | Week 25.5 |
| 15 | Docker & CI/CD | 2 weeks | **Week 27.5 (Launch)** |

**Total estimated time: ~28 weeks (7 months)**

---

## Risk Buffers

| Risk | Buffer |
|------|--------|
| Unforeseen complexity | +1 week after Sprint 7 (MVP checkpoint) |
| Workflow engine complexity | +0.5 week after Sprint 7 |
| AI integration challenges | +1 week after Sprint 12 |
| Frontend scope (more pages) | +1 week after Sprint 13 |
| Production issues | +1 week after Sprint 15 |

**With buffers: ~32 weeks (8 months)**

---

## Milestone Gates

| Milestone | Sprint | Gate Criteria |
|-----------|--------|---------------|
| **Architecture Approved** | 0 | All 10 documents reviewed, approved, repository initialized |
| **Auth Complete** | 1 | Users can register (with email verification), login, receive JWT, 9 roles enforced |
| **Multi-Tenancy Working** | 2 | Tenant isolation verified, org CRUD with departments working |
| **Event Lifecycle** | 3 | Full 9-state event lifecycle API working |
| **Backend MVP** | 7 | Full event lifecycle with workflow automation: create → approve → register → ticket → check-in → certificate (automated) |
| **Full Backend** | 12 | Notifications, analytics, resources, tasks, AI assistant, all 7 AI features functional |
| **Full Stack** | 14 | Web + mobile apps connected, end-to-end flows, offline ticket support |
| **Production Ready** | 15 | Dockerized, CI/CD, monitoring, security review, load tested |

> **⚠️ Sprint 0 is complete. Awaiting approval before proceeding to Sprint 1.**
