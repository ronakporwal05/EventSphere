# EventSphere AI — Module Breakdown

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## Architecture Principle

Each module is a **bounded context** in DDD terms. Modules communicate through **service interfaces**, never by directly accessing another module's entities or repositories. This ensures any module can be extracted into an independent microservice in the future.

**Internal Module Structure (each module):**
```
module-name/
├── controller/       # REST endpoints, request/response DTOs
├── service/          # Business logic interfaces and implementations
├── repository/       # Data access layer (Spring Data JPA)
├── entity/           # JPA entities (domain models)
├── dto/              # Data Transfer Objects
├── mapper/           # Entity ↔ DTO mappers
├── exception/        # Module-specific exceptions
└── event/            # Domain events published/consumed by this module
```

---

## Module Catalog (22 Modules)

### 1. Authentication Module (`auth`)

**Responsibility:** User identity verification, token management, and session lifecycle.

| Capability | Description |
|------------|-------------|
| Login/Register | Email + password authentication with BCrypt hashing |
| OAuth Support | Social login integration (Google, GitHub) — Post-MVP |
| JWT Management | Issue access tokens (15 min) and refresh tokens (7 days) with RS256 |
| Refresh Token Rotation | New refresh token issued on every refresh to prevent reuse |
| Password Reset | OTP-based password reset flow via email |
| Email Verification | Required before account activation |
| Session Management | Track active sessions, support logout across all devices |
| Account Locking | Lock after 5 failed attempts, auto-unlock after 30 min |
| Password Policy | Minimum complexity requirements enforced |

**Dependencies:** User Module (to validate user existence), Notification Module (to send reset/verification emails)
**Publishes Events:** `UserLoggedIn`, `UserRegistered`, `PasswordReset`, `AccountLocked`

---

### 2. Tenant Module (`tenant`)

**Responsibility:** Multi-tenant lifecycle management and isolation enforcement.

| Capability | Description |
|------------|-------------|
| Tenant CRUD | Create, update, suspend, reactivate, delete tenants |
| Tenant Configuration | Name, slug, logo URL, theme, contact, subscription tier |
| Tenant Context | ThreadLocal `TenantContext` set per request via `TenantFilter` |
| Data Isolation | Hibernate `@Filter` auto-appends `tenant_id` to all queries |
| Tenant Resolution | Resolve tenant from header, subdomain, or JWT claim |
| Subscription Ready | Tier-based feature gating (Free/Pro/Enterprise) |

**Dependencies:** None (foundational module)
**Publishes Events:** `TenantCreated`, `TenantSuspended`, `TenantDeleted`

---

### 3. Organization Module (`organization`)

**Responsibility:** Organization profile, team structure, and branding within a tenant.

| Capability | Description |
|------------|-------------|
| Organization Profile | Name, description, logo, website, social links |
| Teams & Departments | Organize members into teams and departments |
| Branding | Custom colors, banner, theme configuration |
| Configuration | Default event settings, notification preferences |
| Member Overview | List all users and their roles within the org |

**Dependencies:** Tenant Module (org belongs to a tenant)
**Publishes Events:** `OrganizationCreated`, `OrganizationUpdated`

---

### 4. User Module (`user`)

**Responsibility:** User profile management and tenant membership.

| Capability | Description |
|------------|-------------|
| User CRUD | Create, update, deactivate user accounts |
| Profile Management | Name, email, avatar, bio, contact info |
| Multi-Tenant Membership | A user can belong to multiple tenants with different roles |
| Invitation | Invite users to organization via email |
| User Search | Find users by name, email within tenant scope |

**Dependencies:** Tenant Module, Auth Module (for credential management)
**Publishes Events:** `UserCreated`, `UserInvited`, `UserDeactivated`

---

### 5. Role & Permission Module (`role`)

**Responsibility:** Role-based access control (RBAC) with granular permissions.

| Capability | Description |
|------------|-------------|
| Role Definition | Define roles with permission sets (9 system roles) |
| Role Assignment | Assign roles to users at org-level or event-level |
| Permission Check | `hasPermission(userId, resource, action)` API |
| Role Hierarchy | Super Admin > Org Admin > Event Manager > Volunteer/Speaker/Vendor/Sponsor/Judge/Attendee |
| Access Policies | Fine-grained resource-action permissions |
| Custom Roles | Organizations can define custom roles (Post-MVP) |

**Dependencies:** User Module, Tenant Module
**Publishes Events:** `RoleAssigned`, `RoleRevoked`

---

### 6. Event Module (`event`)

**Responsibility:** Complete event lifecycle management with expanded state machine.

| Capability | Description |
|------------|-------------|
| Event CRUD | Create events with title, description, type, dates, venue, capacity, banner |
| Lifecycle Management | State machine: Draft → Review → Approved → Published → Registration Open → Live → Completed → Certificate Generated → Archived |
| Event Types | Conference, Hackathon, Workshop, Seminar, Exhibition, Meetup, Fest |
| Multi-Day Events | Support for events spanning multiple days |
| Event Categories | Categorization and tagging for discovery |
| Event Templates | Save events as reusable templates |
| Event Cloning | Clone existing event with all configuration |
| Custom Fields | Define custom registration form fields per event |
| Event Discovery | List/search published events (public API) |

**Dependencies:** Tenant Module, Organization Module, User Module (for creator info)
**Publishes Events:** `EventCreated`, `EventSubmittedForReview`, `EventApproved`, `EventPublished`, `EventRegistrationOpened`, `EventStarted`, `EventCompleted`, `EventArchived`

---

### 7. Session Module (`session`)

**Responsibility:** Session and schedule management within events.

| Capability | Description |
|------------|-------------|
| Session CRUD | Create sessions with title, abstract, time slot, track, room |
| Speaker Assignment | Assign speakers to sessions |
| Multi-Track Scheduling | Support parallel tracks (e.g., Track A, Track B) |
| Schedule View | Timeline/calendar view data for frontend |
| Conflict Detection | Prevent speaker double-booking, room conflicts, resource conflicts |

**Dependencies:** Event Module, User Module (for speaker profiles), Venue Module
**Publishes Events:** `SessionCreated`, `SessionUpdated`, `ScheduleConflictDetected`

---

### 8. Venue Module (`venue`)

**Responsibility:** Venue and room/space management.

| Capability | Description |
|------------|-------------|
| Venue CRUD | Name, address, total capacity, map/floor plan URL |
| Room Management | Rooms within venue: name, capacity, equipment |
| Availability | Track room availability across events |
| Venue Mapping | Associate venues with events, rooms with sessions |
| Capacity Tracking | Real-time room capacity monitoring |

**Dependencies:** Tenant Module
**Publishes Events:** `VenueCreated`, `RoomBooked`

---

### 9. Registration Module (`registration`)

**Responsibility:** Attendee and team registration for events.

| Capability | Description |
|------------|-------------|
| Public Registration | Registration form rendered from event's custom fields |
| Team Registration | Register as a team for hackathons/competitions |
| Capacity Management | Auto-close registration when capacity reached |
| Waitlist | Queue attendees when event is full, auto-promote on cancellation |
| Registration Moderation | Approve/reject registrations for moderated events |
| Registration Status | Pending → Approved → Confirmed → Cancelled |
| Bulk Operations | Bulk approve, reject, export registrations |
| Dynamic Forms | Custom field support: text, dropdown, checkbox, file upload |

**Dependencies:** Event Module, User Module, Notification Module, Workflow Module
**Publishes Events:** `RegistrationCreated`, `RegistrationApproved`, `RegistrationCancelled`, `TeamRegistered`

---

### 10. Ticket Module (`ticket`)

**Responsibility:** QR ticket generation, validation, and management with enhanced security.

| Capability | Description |
|------------|-------------|
| Ticket Generation | Generate unique QR-coded ticket upon registration approval |
| QR Code Signing | Digitally signed QR payload with encrypted content |
| QR Payload | Contains: Ticket ID, Event ID, User ID, Tenant ID, Digital Signature, Expiry |
| Ticket PDF | Generate downloadable PDF with attendee info, event info, QR code |
| Ticket Validation | Validate scanned QR code: check signature, check-in status, expiry, tenant |
| Ticket Revocation | Revoke tickets for cancelled registrations |
| Digital Pass | Digital ticket pass for mobile wallets |

**Dependencies:** Registration Module, Event Module, Workflow Module
**Publishes Events:** `TicketGenerated`, `TicketValidated`, `TicketRevoked`

---

### 11. Attendance Module (`attendance`)

**Responsibility:** Check-in tracking and attendance analytics.

| Capability | Description |
|------------|-------------|
| QR Scan Check-In | Validate QR → Mark attendance → Return confirmation |
| Manual Check-In | Manual attendance marking for edge cases |
| Duplicate Prevention | Prevent multiple check-ins for same ticket |
| Session Attendance | Track attendance at session level (not just event level) |
| Real-Time Count | Live attendance counter via Redis |
| Live Dashboard | Real-time attendance dashboard for event day |
| Attendance Export | Export attendance data as CSV/Excel |

**Dependencies:** Ticket Module, Event Module, Session Module
**Publishes Events:** `AttendeeCheckedIn`, `SessionAttendanceMarked`

---

### 12. Workflow Automation Module (`workflow`) — NEW

**Responsibility:** Configurable approval workflows and automated event operations.

| Capability | Description |
|------------|-------------|
| Event Approval Workflow | Draft → Submit for Review → Approve/Reject → Publish |
| Registration Approval | Auto-approve or manual approval based on event config |
| Auto QR Ticket Generation | Automatically generate tickets after registration approval |
| Reminder Automation | Configurable scheduled reminder emails (24h, 1h before event) |
| Certificate Eligibility | Auto-determine eligibility based on attendance rules |
| Auto Certificate Generation | Trigger certificate generation after event completion |
| Feedback Automation | Auto-send feedback requests after event completion |
| Report Automation | Auto-generate organizer reports after event completion |
| Venue Booking Approval | Approval workflow for venue/resource booking |

**Dependencies:** Event Module, Registration Module, Ticket Module, Certificate Module, Notification Module
**Publishes Events:** `WorkflowTriggered`, `ApprovalRequested`, `ApprovalCompleted`, `AutomationExecuted`

---

### 13. Resource Management Module (`resource`) — NEW

**Responsibility:** Event resource allocation and tracking.

| Capability | Description |
|------------|-------------|
| Resource Catalog | Manage inventory: cameras, projectors, laptops, audio equipment, vehicles |
| Meeting Rooms | Track meeting room availability and bookings |
| Resource Allocation | Allocate resources to specific events and sessions |
| Double-Booking Prevention | Prevent same resource from being allocated to overlapping events |
| Availability Dashboard | View real-time resource availability during event planning |
| Allocation History | Complete history of resource assignments |
| Return Tracking | Track resource check-out and return |

**Dependencies:** Tenant Module, Event Module, Session Module
**Publishes Events:** `ResourceAllocated`, `ResourceReturned`, `ResourceConflict`

---

### 14. Task Management Module (`task`) — NEW

**Responsibility:** Event task assignment and progress tracking.

| Capability | Description |
|------------|-------------|
| Task CRUD | Create tasks with title, description, priority, deadline |
| Assignment | Assign tasks to team members and volunteers |
| Priority & Deadlines | High/Medium/Low priority with deadline tracking |
| Status Tracking | To Do → In Progress → Completed |
| Team Collaboration | Multiple assignees, comments on tasks |
| Overdue Notifications | Auto-notify users about overdue tasks |
| Status Monitoring | Dashboard showing task completion rates |

**Dependencies:** Event Module, User Module, Volunteer Module, Notification Module
**Publishes Events:** `TaskCreated`, `TaskAssigned`, `TaskCompleted`, `TaskOverdue`

---

### 15. Volunteer Module (`volunteer`)

**Responsibility:** Volunteer management and performance tracking.

| Capability | Description |
|------------|-------------|
| Volunteer Registration | Self-register or be assigned as volunteer for events |
| Shift Scheduling | Define time slots and assign volunteers to shifts |
| Attendance Tracking | Track volunteer attendance and hours |
| Performance Reports | Track tasks completed, hours contributed, events served |

**Dependencies:** Event Module, User Module, Task Module
**Publishes Events:** `VolunteerAssigned`, `VolunteerCheckedIn`

---

### 16. Sponsor & Vendor Module (`sponsor`) — EXPANDED

**Responsibility:** Sponsorship management, vendor operations, and engagement tracking.

| Capability | Description |
|------------|-------------|
| Sponsorship Packages | Define sponsorship tiers: Platinum, Gold, Silver, Bronze |
| Sponsor Profiles | Company name, logo, website, description, tier |
| Vendor Registration | Register vendors for exhibitions, booths |
| Booth Allocation | Assign booth locations to vendors/sponsors |
| Contracts Management | Upload and track sponsorship/vendor contracts |
| Lead Collection | Sponsors collect attendee leads (opt-in, anonymized) |
| Branding Placement | Track where sponsor logos appear (banner, certificates, etc.) |
| ROI Reports | Attendee demographics, engagement metrics, lead conversion |

**Dependencies:** Event Module, Analytics Module, Document Module
**Publishes Events:** `SponsorAdded`, `VendorRegistered`, `BoothAllocated`, `LeadCollected`

---

### 17. Certificate Module (`certificate`)

**Responsibility:** Certificate template management, auto-generation, and verification.

| Capability | Description |
|------------|-------------|
| Template Management | Upload/select certificate templates (HTML/PDF templates) |
| Variable Substitution | Replace `{{name}}`, `{{event}}`, `{{date}}` in templates |
| Automatic Generation | Workflow-triggered bulk generation for eligible attendees |
| QR Verification | Each certificate has QR code linking to public verification URL |
| Digital Certificates | Web-viewable certificates with unique verification codes |
| Download Portal | Attendees download certificates from their dashboard |

**Dependencies:** Event Module, Attendance Module (eligibility), Notification Module, Workflow Module
**Publishes Events:** `CertificateGenerated`, `CertificateBulkCompleted`

---

### 18. Communication & Notification Center (`notification`) — EXPANDED

**Responsibility:** Multi-channel notification delivery with advanced features.

| Capability | Description |
|------------|-------------|
| Email Notifications | SMTP-based email delivery with HTML templates and queue |
| In-App Notifications | Stored notifications viewable in user's notification center |
| Push Notifications | Firebase Cloud Messaging for mobile push |
| Scheduled Notifications | Schedule notifications for future delivery (reminders) |
| Reminder Campaigns | Configurable pre-event reminder sequences |
| Broadcast Messages | Send messages to all users in an organization or event |
| Audience Segmentation | Target notifications by role, registration status, attendance |
| Delivery Tracking | Track notification delivery status (sent/delivered/failed/opened) |
| Template Engine | Notification templates with variable substitution |
| Emergency Notifications | High-priority alerts (venue change, event cancellation) |
| Retry Mechanism | Failed notifications retried with exponential backoff |

**Dependencies:** User Module, Event Module
**Consumes Events:** `RegistrationCreated`, `TicketGenerated`, `CertificateGenerated`, `TaskOverdue`, `ScheduleConflictDetected`, `EventApproved`, etc.

---

### 19. Analytics Module (`analytics`)

**Responsibility:** Event, organization, and platform-level analytics.

| Capability | Description |
|------------|-------------|
| Registration Analytics | Registrations over time, conversion rates, form completion |
| Attendance Analytics | Check-ins, no-shows, session-wise breakdown |
| Revenue Dashboard | Sponsorship revenue tracking (post-MVP with payments) |
| Engagement Metrics | Session popularity, feedback scores, return attendees |
| Volunteer Performance | Tasks completed, hours contributed per volunteer |
| Sponsor Analytics | Lead collection, brand exposure, ROI metrics |
| Event Success Reports | Composite success scoring across metrics |
| Organization Analytics | Cross-event trends, growth metrics |
| Real-Time Dashboard | Live metrics during active events |
| Platform Analytics | Super Admin view: tenant usage, system health |
| Report Export | Export reports as PDF and CSV |

**Dependencies:** Event Module, Registration Module, Attendance Module, Sponsor Module
**Publishes Events:** None (read-only module)

---

### 20. Document Module (`document`) — EXPANDED

**Responsibility:** File and document management with version control and RAG integration.

| Capability | Description |
|------------|-------------|
| File Upload | Upload documents, images, presentations to Supabase Storage |
| Document Types | Brochures, posters, speaker presentations, contracts, rulebooks, event policies, reports |
| Version Control | Track document versions with history |
| Organization | Organize files by event, category, tags |
| Access Control | Role-based access to documents |
| Sharing | Generate shareable links with optional expiry |
| Storage Quotas | Enforce storage limits per tenant |
| RAG Integration | Documents indexed in Qdrant for AI assistant to retrieve answers |

**Dependencies:** Tenant Module, Event Module, AI Module (for RAG indexing)
**Publishes Events:** `DocumentUploaded`, `DocumentVersioned`, `DocumentShared`

---

### 21. AI Module (`ai`) — EXPANDED

**Responsibility:** Comprehensive AI-powered decision support with 7 sub-features.

| Capability | Description |
|------------|-------------|
| AI Event Assistant | NL queries answered via RAG over event data and uploaded documents |
| AI Event Planning | Resource estimation, volunteer requirements, venue recommendations |
| AI Report Generator | Auto-generate narrative event success reports from analytics data |
| AI Feedback Analyzer | Sentiment analysis and theme extraction from feedback |
| AI FAQ Generator | Auto-generate FAQ documents from event data and past queries |
| AI Schedule Optimizer | Detect conflicts, suggest optimal session arrangements |
| AI Content Generator | Generate event descriptions, social media posts, email drafts |
| Knowledge Ingestion | Embed event data and documents into Qdrant for RAG retrieval |
| Source Citations | All AI responses must cite source documents when RAG is used (BR-10) |

**Dependencies:** Event Module, Analytics Module, Attendance Module, Document Module, Qdrant, Gemini API
**Publishes Events:** `AIRecommendationGenerated`, `AnomalyDetected`, `FAQGenerated`, `ReportGenerated`

---

### 22. Audit Module (`audit`) — EXPANDED

**Responsibility:** Comprehensive audit trail for compliance, security, and debugging.

| Capability | Description |
|------------|-------------|
| Action Logging | Log every create/update/delete with: actor, timestamp, entity, action, before/after state |
| Login History | Track all login attempts (success and failure) with IP and device |
| Configuration Changes | Log all changes to tenant, org, and event settings |
| Approval Logs | Track all workflow approval/rejection decisions |
| Ticket Validation Logs | Log every QR scan attempt (valid, invalid, duplicate) |
| Certificate Generation Logs | Track certificate generation jobs and results |
| Audit Search | Search audit logs by entity, actor, action, date range |
| Retention Policy | Define log retention periods per tenant |
| Export | Export audit logs for compliance audits |
| Tamper Protection | Audit records are append-only, no updates or deletes |

**Dependencies:** None (cross-cutting concern, consumed by all modules via AOP/interceptors)
**Consumes Events:** All domain events from all modules

---

## Module Dependency Graph

```
                    ┌─────────┐
                    │  Audit  │ ◄── All modules publish to audit
                    └─────────┘

┌──────────┐       ┌──────────┐
│  Tenant  │ ◄──── │   Auth   │
└────┬─────┘       └──────────┘
     │
     ▼
┌──────────┐       ┌──────────┐
│   Org    │ ────► │   User   │
└────┬─────┘       └────┬─────┘
     │                   │
     ▼                   ▼
┌──────────┐       ┌──────────┐
│  Event   │ ────► │   Role   │
└────┬─────┘       └──────────┘
     │
     ├──────────────────────────────┬──────────────┐
     ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Session  │  │  Venue   │  │ Sponsor  │  │ Resource │
└──────────┘  └──────────┘  │ +Vendor  │  └──────────┘
     │                       └──────────┘
     ▼
┌──────────┐       ┌──────────┐
│  Regist. │ ◄───► │ Workflow │ ◄──── orchestrates automations
└────┬─────┘       └──────────┘
     │
     ▼
┌──────────┐       ┌──────────┐
│  Ticket  │ ────► │  Notif.  │
└────┬─────┘       │  Center  │
     │             └──────────┘
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
     ┌────────────────────────────┘
     ▼
┌──────────┐       ┌──────────┐
│ Analytics│ ◄──── │    AI    │
└──────────┘       └──────────┘
```
