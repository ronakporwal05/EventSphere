# EventSphere AI — Project Folder Structure

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## Root Directory

```
eventsphere-ai/
├── backend/                    # Spring Boot Modular Monolith
├── frontend/                   # Next.js Web Application
├── mobile/                     # Flutter Mobile Application
├── database/                   # Database Migrations & Seeds
├── docs/                       # Project Documentation
├── infrastructure/             # Docker, Deployment Configs
├── .github/                    # GitHub Actions CI/CD
├── .gitignore
├── README.md
└── LICENSE
```

---

## Backend (Spring Boot — Modular Monolith)

```
backend/
├── pom.xml                                  # Maven parent POM
├── src/
│   ├── main/
│   │   ├── java/com/eventsphere/
│   │   │   ├── EventSphereApplication.java  # Spring Boot entry point
│   │   │   │
│   │   │   ├── common/                      # Shared utilities & cross-cutting concerns
│   │   │   │   ├── config/                  # App configuration classes
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── RedisConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── CsrfConfig.java
│   │   │   │   │   ├── JacksonConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   └── EmailConfig.java
│   │   │   │   ├── security/               # JWT, filters, auth utilities
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── TenantFilter.java
│   │   │   │   │   ├── RateLimitFilter.java
│   │   │   │   │   ├── InputSanitizer.java
│   │   │   │   │   └── XssPreventionFilter.java
│   │   │   │   ├── tenant/                  # Tenant context management
│   │   │   │   │   ├── TenantContext.java
│   │   │   │   │   ├── TenantInterceptor.java
│   │   │   │   │   └── TenantAwareRepository.java
│   │   │   │   ├── exception/               # Global exception handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   ├── UnauthorizedException.java
│   │   │   │   │   ├── TenantAccessDeniedException.java
│   │   │   │   │   └── ResourceConflictException.java
│   │   │   │   ├── dto/                     # Shared DTOs
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── PagedResponse.java
│   │   │   │   │   └── ErrorResponse.java
│   │   │   │   ├── audit/                   # Audit logging AOP
│   │   │   │   │   ├── AuditAspect.java
│   │   │   │   │   └── Auditable.java       # Annotation
│   │   │   │   ├── email/                   # Email queue infrastructure
│   │   │   │   │   ├── EmailQueueService.java
│   │   │   │   │   └── EmailRetryService.java
│   │   │   │   └── util/                    # Utility classes
│   │   │   │       ├── QrCodeUtil.java
│   │   │   │       ├── DigitalSignatureUtil.java
│   │   │   │       ├── PdfGeneratorUtil.java
│   │   │   │       └── SlugUtil.java
│   │   │   │
│   │   │   ├── auth/                        # Authentication Module
│   │   │   │   ├── controller/
│   │   │   │   │   └── AuthController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── AuthServiceImpl.java
│   │   │   │   │   └── EmailVerificationService.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── TokenResponse.java
│   │   │   │   │   └── PasswordResetRequest.java
│   │   │   │   └── repository/
│   │   │   │       └── RefreshTokenRepository.java
│   │   │   │
│   │   │   ├── tenant/                      # Tenant Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   └── Tenant.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── organization/                # Organization Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Organization.java
│   │   │   │   │   └── Department.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── user/                        # User Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   ├── Permission.java
│   │   │   │   │   └── TenantMembership.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── event/                       # Event Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Event.java
│   │   │   │   │   ├── EventStatus.java     # Enum (9 states)
│   │   │   │   │   ├── EventType.java       # Enum
│   │   │   │   │   └── EventCustomField.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── session/                     # Session Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── venue/                       # Venue Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── registration/                # Registration Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Registration.java
│   │   │   │   │   ├── Team.java
│   │   │   │   │   └── TeamMember.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── ticket/                      # Ticket Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Ticket.java
│   │   │   │   │   └── TicketStatus.java    # Enum (5 states incl. EXPIRED)
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── attendance/                  # Attendance Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── workflow/                    # Workflow Automation Module (NEW)
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   │   ├── WorkflowEngine.java
│   │   │   │   │   ├── ApprovalService.java
│   │   │   │   │   └── AutomationService.java
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── WorkflowDefinition.java
│   │   │   │   │   ├── WorkflowInstance.java
│   │   │   │   │   └── ApprovalRecord.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── resource/                    # Resource Management Module (NEW)
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Resource.java
│   │   │   │   │   └── ResourceAllocation.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── task/                        # Task Management Module (NEW)
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   └── Task.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── volunteer/                   # Volunteer Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── sponsor/                     # Sponsor & Vendor Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Sponsor.java
│   │   │   │   │   ├── Vendor.java
│   │   │   │   │   ├── BoothAllocation.java
│   │   │   │   │   └── VendorLead.java
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── certificate/                 # Certificate Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   └── mapper/
│   │   │   │
│   │   │   ├── notification/                # Communication & Notification Center
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   │   ├── NotificationService.java
│   │   │   │   │   ├── EmailDeliveryService.java
│   │   │   │   │   ├── PushNotificationService.java
│   │   │   │   │   ├── AudienceSegmentService.java
│   │   │   │   │   └── DeliveryTrackingService.java
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Notification.java
│   │   │   │   │   ├── NotificationTemplate.java
│   │   │   │   │   └── AudienceSegment.java
│   │   │   │   ├── dto/
│   │   │   │   ├── mapper/
│   │   │   │   └── template/                # Email HTML templates
│   │   │   │
│   │   │   ├── analytics/                   # Analytics Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── dto/
│   │   │   │   └── query/                   # Complex analytics queries
│   │   │   │
│   │   │   ├── document/                    # Document Module
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Document.java
│   │   │   │   │   └── DocumentVersion.java
│   │   │   │   ├── dto/
│   │   │   │   └── storage/                 # Supabase integration
│   │   │   │
│   │   │   ├── ai/                          # AI Module (7 Sub-Features)
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   │   ├── AiAssistantService.java
│   │   │   │   │   ├── AiPlanningService.java
│   │   │   │   │   ├── AiReportService.java
│   │   │   │   │   ├── AiFaqService.java
│   │   │   │   │   ├── AiContentService.java
│   │   │   │   │   ├── AiScheduleService.java
│   │   │   │   │   ├── SentimentService.java
│   │   │   │   │   └── EmbeddingService.java
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── AiConversation.java
│   │   │   │   │   ├── AiMessage.java
│   │   │   │   │   └── AiGeneratedContent.java
│   │   │   │   ├── dto/
│   │   │   │   ├── rag/                     # RAG pipeline components
│   │   │   │   │   ├── DocumentIngester.java
│   │   │   │   │   └── ContextRetriever.java
│   │   │   │   └── config/
│   │   │   │       └── GeminiConfig.java
│   │   │   │
│   │   │   └── audit/                       # Audit Module
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       │   ├── AuditLog.java
│   │   │       │   ├── LoginHistory.java
│   │   │       │   └── TicketValidationLog.java
│   │   │       └── dto/
│   │   │
│   │   └── resources/
│   │       ├── application.yml              # Main config
│   │       ├── application-dev.yml          # Dev profile
│   │       ├── application-prod.yml         # Production profile
│   │       ├── application-test.yml         # Test profile
│   │       └── templates/                   # Email templates (Thymeleaf)
│   │           ├── registration-confirmed.html
│   │           ├── ticket-ready.html
│   │           ├── event-reminder.html
│   │           ├── schedule-update.html
│   │           ├── certificate-ready.html
│   │           ├── feedback-request.html
│   │           ├── password-reset.html
│   │           ├── broadcast.html
│   │           └── emergency.html
│   │
│   └── test/
│       └── java/com/eventsphere/
│           ├── auth/
│           ├── tenant/
│           ├── event/
│           ├── registration/
│           ├── ticket/
│           ├── attendance/
│           ├── workflow/
│           ├── resource/
│           ├── task/
│           └── integration/                 # Cross-module integration tests
│               ├── TenantIsolationTest.java
│               └── WorkflowIntegrationTest.java
│
├── Dockerfile
└── .env.example
```

---

## Frontend (Next.js)

```
frontend/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .env.local.example
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
├── src/
│   ├── app/                              # App Router (Next.js 14+)
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Landing page
│   │   ├── (auth)/                       # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── verify-email/page.tsx     # Email verification
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/                  # Authenticated route group
│   │   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx              # Event list
│   │   │   │   ├── new/page.tsx          # Create event
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          # Event detail
│   │   │   │       ├── edit/page.tsx
│   │   │   │       ├── registrations/page.tsx
│   │   │   │       ├── sessions/page.tsx
│   │   │   │       ├── attendance/page.tsx
│   │   │   │       ├── certificates/page.tsx
│   │   │   │       ├── resources/page.tsx  # Resource allocation
│   │   │   │       ├── tasks/page.tsx      # Task management
│   │   │   │       ├── sponsors/page.tsx   # Sponsor & vendor mgmt
│   │   │   │       └── analytics/page.tsx
│   │   │   ├── organization/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── teams/page.tsx        # Teams & departments
│   │   │   │   └── settings/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── volunteers/page.tsx
│   │   │   ├── workflows/page.tsx        # Workflow configuration
│   │   │   ├── resources/page.tsx        # Resource inventory
│   │   │   ├── analytics/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── documents/page.tsx        # Document management
│   │   │   ├── ai-assistant/page.tsx
│   │   │   └── audit-logs/page.tsx
│   │   ├── events/                       # Public event pages
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Public event page
│   │   │       └── register/page.tsx     # Public registration
│   │   └── verify/
│   │       └── [code]/page.tsx           # Certificate verification
│   ├── components/
│   │   ├── ui/                           # Reusable UI components
│   │   ├── forms/                        # Form components
│   │   ├── charts/                       # Analytics chart components
│   │   ├── layout/                       # Layout components
│   │   └── modals/                       # Modal dialogs
│   ├── lib/
│   │   ├── api.ts                        # API client (Axios/Fetch wrapper)
│   │   ├── auth.ts                       # Auth utilities
│   │   └── utils.ts                      # Shared utilities
│   ├── hooks/                            # Custom React hooks
│   ├── types/                            # TypeScript type definitions
│   ├── store/                            # State management (Zustand)
│   └── styles/
│       └── globals.css
└── Dockerfile
```

---

## Mobile (Flutter)

```
mobile/
├── pubspec.yaml
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart                      # App widget, routing
│   │   └── theme.dart                    # App theme
│   ├── core/
│   │   ├── api/                          # API client
│   │   ├── auth/                         # Auth management
│   │   ├── storage/                      # Local storage + offline ticket cache
│   │   └── constants/
│   ├── features/
│   │   ├── auth/                         # Login/Register screens
│   │   ├── events/                       # Event list, detail, schedule
│   │   ├── scanner/                      # QR code scanner (volunteer)
│   │   ├── tickets/                      # Digital ticket view, QR display, offline
│   │   ├── certificates/                 # Certificate download
│   │   ├── ai_assistant/                 # AI assistant chat
│   │   ├── profile/                      # User profile
│   │   └── notifications/               # Push notifications
│   └── shared/
│       ├── widgets/                      # Shared widgets
│       └── models/                       # Data models
├── test/
├── android/
├── ios/
└── Dockerfile
```

---

## Database

```
database/
├── migrations/                           # Flyway migration scripts
│   ├── V1__create_tenants.sql
│   ├── V2__create_users_and_roles.sql
│   ├── V3__create_organizations.sql
│   ├── V4__create_events.sql
│   ├── V5__create_registrations.sql
│   ├── V6__create_tickets.sql
│   ├── V7__create_attendance.sql
│   ├── V8__create_workflows.sql
│   ├── V9__create_resources.sql
│   ├── V10__create_tasks.sql
│   ├── V11__create_vendors.sql
│   └── ...
├── seeds/                                # Development seed data
│   ├── seed_tenants.sql
│   ├── seed_users.sql
│   ├── seed_roles_permissions.sql
│   └── seed_sample_events.sql
└── diagrams/                             # ER diagrams
    └── er-diagram.png
```

---

## Documentation

```
docs/
├── sprint-0/                             # Sprint 0 deliverables (this)
│   ├── 01-PRD.md
│   ├── 02-SRS.md
│   ├── 03-SYSTEM-ARCHITECTURE.md
│   ├── 04-MODULE-BREAKDOWN.md
│   ├── 05-USER-ROLE-MATRIX.md
│   ├── 06-USER-JOURNEYS.md
│   ├── 07-DATABASE-PLANNING.md
│   ├── 08-FOLDER-STRUCTURE.md
│   ├── 09-GIT-STRATEGY.md
│   └── 10-DEVELOPMENT-ROADMAP.md
├── api/                                  # API documentation
│   └── openapi.yaml
├── architecture/                         # Architecture Decision Records
│   ├── ADR-001-modular-monolith.md
│   ├── ADR-002-shared-schema-tenancy.md
│   ├── ADR-003-jwt-authentication.md
│   └── ADR-004-workflow-automation.md
└── guides/                               # Developer guides
    ├── getting-started.md
    ├── contributing.md
    └── deployment.md
```

---

## Infrastructure

```
infrastructure/
├── docker/
│   ├── docker-compose.yml                # Local dev: PostgreSQL, Redis, Qdrant
│   ├── docker-compose.prod.yml           # Production compose
│   ├── Dockerfile.backend                # Backend container
│   ├── Dockerfile.frontend               # Frontend container
│   └── nginx/
│       └── nginx.conf                    # Reverse proxy config
├── render/
│   └── render.yaml                       # Render deployment blueprint
├── scripts/
│   ├── setup-dev.sh                      # Dev environment setup
│   ├── seed-db.sh                        # Database seeding
│   └── generate-keys.sh                  # RSA key pair generation for JWT
└── env/
    ├── .env.example                      # Template with all variables
    ├── .env.dev                           # Dev defaults (gitignored)
    └── .env.prod                          # Production (gitignored)
```

---

## GitHub Actions

```
.github/
├── workflows/
│   ├── ci-backend.yml                    # Build, test, lint backend
│   ├── ci-frontend.yml                   # Build, test, lint frontend
│   ├── deploy-backend.yml                # Deploy to Render
│   ├── deploy-frontend.yml               # Deploy to Vercel
│   └── security-scan.yml                 # Dependency vulnerability scan
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── sprint_task.md
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS
```

---

## Directory Purpose Summary

| Directory | Purpose |
|-----------|---------|
| `backend/` | Spring Boot modular monolith — 22 business modules, all APIs, and integrations |
| `frontend/` | Next.js web application — admin dashboard, public event pages, attendee portal |
| `mobile/` | Flutter mobile app — attendee experience, QR scanning, volunteer check-in, offline tickets, AI assistant |
| `database/` | Flyway migrations, seed data, ER diagrams — version-controlled schema (~49 tables) |
| `docs/` | All project documentation, ADRs, API specs, developer guides |
| `infrastructure/` | Docker, deployment configs, scripts — everything needed to run and deploy |
| `.github/` | CI/CD workflows, issue templates, PR templates, code ownership |
