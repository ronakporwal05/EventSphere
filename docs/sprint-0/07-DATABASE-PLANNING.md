# EventSphere AI — Database Planning

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

> **Note:** This document identifies entities, relationships, and constraints. No SQL is generated. Implementation details will be defined in Sprint 1+.

---

## 1. Entity Catalog

### Estimated Total: ~40 tables

---

### Core Platform Entities

#### 1. `tenants` — Multi-Tenant Root
**Why it exists:** Every row in the system is scoped to a tenant. This table is the root of the multi-tenant hierarchy.
**Key fields:** id, name, slug, logo_url, theme_config (JSON), contact_email, subscription_tier, status (ACTIVE/SUSPENDED/DELETED), created_at, updated_at

#### 2. `users` — Platform Users
**Why it exists:** Stores identity and profile for every person using the platform, across all tenants.
**Key fields:** id, email, password_hash, first_name, last_name, avatar_url, phone, status (ACTIVE/INACTIVE/LOCKED), email_verified, created_at, updated_at
**Note:** Users table is NOT tenant-scoped — a user can belong to multiple tenants. Tenant membership is tracked via `tenant_memberships`.

#### 3. `tenant_memberships` — User-Tenant Relationship
**Why it exists:** Maps users to tenants with roles. A single user can be an Org Admin in one tenant and an Attendee in another.
**Key fields:** id, tenant_id, user_id, role_id, department, joined_at, status
**Unique constraint:** (tenant_id, user_id)

#### 4. `roles` — Role Definitions
**Why it exists:** Defines the 9 system roles and their permission sets.
**Key fields:** id, name, description, is_system_role, tenant_id (NULL for system roles)

#### 5. `permissions` — Granular Permissions
**Why it exists:** Fine-grained permission definitions (e.g., `EVENT:CREATE`, `TICKET:VALIDATE`, `RESOURCE:ALLOCATE`).
**Key fields:** id, resource, action, description

#### 6. `role_permissions` — Role-Permission Mapping
**Why it exists:** Maps which permissions belong to which role.
**Key fields:** role_id, permission_id
**Join table** (many-to-many)

---

### Organization Entities

#### 7. `organizations` — Organization Profiles
**Why it exists:** Stores organization details within a tenant.
**Key fields:** id, tenant_id, name, description, logo_url, website, social_links (JSON), branding_config (JSON), created_at

#### 8. `departments` — Team/Department Structure (NEW)
**Why it exists:** Organizations organize members into teams and departments per PRD.
**Key fields:** id, organization_id, tenant_id, name, description, head_user_id, created_at

---

### Event Entities

#### 9. `events` — Core Events
**Why it exists:** The central entity. Every feature revolves around events.
**Key fields:** id, tenant_id, organization_id, title, description, event_type (ENUM), category, status (DRAFT/REVIEW/APPROVED/PUBLISHED/REGISTRATION_OPEN/LIVE/COMPLETED/CERTIFICATE_GENERATED/ARCHIVED), start_date, end_date, is_multi_day, venue_id, capacity, banner_url, registration_config (JSON), is_moderated, created_by, approved_by, approved_at, created_at, updated_at

#### 10. `event_custom_fields` — Custom Registration Fields
**Why it exists:** Events can define custom registration form fields beyond name/email.
**Key fields:** id, event_id, field_name, field_type (TEXT/DROPDOWN/CHECKBOX/FILE), options (JSON for dropdowns), is_required, display_order

#### 11. `sessions` — Event Sessions/Talks
**Why it exists:** Events contain multiple sessions (talks, workshops, panels) with their own schedules.
**Key fields:** id, event_id, tenant_id, title, abstract, track, start_time, end_time, room_id, max_capacity, status

#### 12. `session_speakers` — Speaker-Session Assignment
**Why it exists:** Maps speakers to sessions. A session can have multiple speakers (panels).
**Key fields:** session_id, user_id
**Join table** (many-to-many)

---

### Venue Entities

#### 13. `venues` — Event Venues
**Why it exists:** Reusable venue definitions across events within a tenant.
**Key fields:** id, tenant_id, name, address, city, total_capacity, map_url, created_at

#### 14. `rooms` — Rooms within Venues
**Why it exists:** Sessions are assigned to specific rooms within venues.
**Key fields:** id, venue_id, name, capacity, equipment (JSON), floor

---

### Registration & Ticketing Entities

#### 15. `registrations` — Event Registrations
**Why it exists:** Tracks who registered for which event, with their form responses.
**Key fields:** id, event_id, tenant_id, user_id, team_id (nullable, for team registration), status (PENDING/APPROVED/CONFIRMED/REJECTED/CANCELLED), custom_field_responses (JSON), registered_at, updated_at

#### 16. `teams` — Team Registration (NEW)
**Why it exists:** Hackathons and competitions allow team registration per PRD.
**Key fields:** id, event_id, tenant_id, team_name, leader_user_id, created_at

#### 17. `team_members` — Team Membership (NEW)
**Why it exists:** Maps users to teams for hackathon/competition registration.
**Key fields:** id, team_id, user_id, role_in_team

#### 18. `tickets` — QR-Coded Tickets
**Why it exists:** Each approved registration generates a ticket with a unique QR code for check-in.
**Key fields:** id, registration_id, event_id, tenant_id, user_id, ticket_code (UUID), qr_payload_encrypted, digital_signature, expires_at, status (GENERATED/ACTIVE/USED/REVOKED/EXPIRED), issued_at

#### 19. `waitlist_entries` — Registration Waitlist
**Why it exists:** When an event reaches capacity, new registrants are queued.
**Key fields:** id, event_id, user_id, position, status (WAITING/PROMOTED/EXPIRED), created_at

---

### Attendance Entities

#### 20. `attendance_records` — Check-In Records
**Why it exists:** Immutable record of when each attendee checked in. Used for certificate eligibility and analytics.
**Key fields:** id, ticket_id, event_id, tenant_id, user_id, checked_in_at, checked_in_by (volunteer/manager user_id), check_in_method (QR_SCAN/MANUAL)

#### 21. `session_attendance` — Session-Level Attendance
**Why it exists:** Granular tracking — which attendees attended which sessions.
**Key fields:** id, session_id, user_id, checked_in_at

---

### Workflow Entities (NEW)

#### 22. `workflow_definitions` — Workflow Configuration (NEW)
**Why it exists:** Configurable approval and automation workflows per PRD Section 7.
**Key fields:** id, tenant_id, workflow_type (EVENT_APPROVAL/REGISTRATION_APPROVAL/VENUE_BOOKING/RESOURCE_REQUEST), trigger_event, auto_execute, config (JSON), is_active, created_at

#### 23. `workflow_instances` — Workflow Execution (NEW)
**Why it exists:** Tracks execution of individual workflow instances.
**Key fields:** id, workflow_definition_id, entity_type, entity_id, status (PENDING/IN_PROGRESS/COMPLETED/FAILED), started_at, completed_at

#### 24. `approval_records` — Approval Decisions (NEW)
**Why it exists:** Tracks approval/rejection decisions within workflows.
**Key fields:** id, workflow_instance_id, approver_user_id, decision (APPROVED/REJECTED), comments, decided_at

---

### Resource Management Entities (NEW)

#### 25. `resources` — Resource Inventory (NEW)
**Why it exists:** Manage event resources (cameras, projectors, laptops, audio equipment, vehicles) per PRD.
**Key fields:** id, tenant_id, name, category (CAMERA/PROJECTOR/LAPTOP/AUDIO/VEHICLE/MEETING_ROOM/OTHER), description, quantity, status (AVAILABLE/IN_USE/MAINTENANCE), created_at

#### 26. `resource_allocations` — Resource-Event Mapping (NEW)
**Why it exists:** Track which resources are allocated to which events, preventing double-booking.
**Key fields:** id, resource_id, event_id, session_id (nullable), allocated_by, quantity_allocated, start_time, end_time, status (ALLOCATED/RETURNED), allocated_at, returned_at

---

### Task Management Entities (NEW)

#### 27. `tasks` — Event Tasks (NEW)
**Why it exists:** Task assignment and tracking for organizing teams per PRD.
**Key fields:** id, event_id, tenant_id, title, description, priority (HIGH/MEDIUM/LOW), status (TODO/IN_PROGRESS/COMPLETED), assigned_to, assigned_by, deadline, completed_at, created_at

---

### Volunteer Entities

#### 28. `volunteer_assignments` — Volunteer-Event Mapping
**Why it exists:** Tracks which volunteers are assigned to which events.
**Key fields:** id, event_id, user_id, assigned_at, status

#### 29. `volunteer_shifts` — Shift Scheduling (RENAMED from volunteer_tasks)
**Why it exists:** Define and track volunteer shifts.
**Key fields:** id, event_id, volunteer_assignment_id, location, shift_start, shift_end, status (ASSIGNED/CHECKED_IN/COMPLETED)

---

### Sponsor & Vendor Entities (EXPANDED)

#### 30. `sponsors` — Sponsor Profiles
**Why it exists:** Tracks sponsors and their tier within events.
**Key fields:** id, event_id, tenant_id, company_name, logo_url, website, tier (PLATINUM/GOLD/SILVER/BRONZE), description, contact_email

#### 31. `vendors` — Vendor Profiles (NEW)
**Why it exists:** Track vendors for exhibitions and booths per PRD.
**Key fields:** id, event_id, tenant_id, company_name, logo_url, website, description, contact_email, booth_requirements (JSON), status (REGISTERED/APPROVED/ALLOCATED)

#### 32. `booth_allocations` — Booth Assignment (NEW)
**Why it exists:** Map vendors/sponsors to specific booth locations.
**Key fields:** id, event_id, vendor_id (nullable), sponsor_id (nullable), booth_number, location_description, allocated_at

#### 33. `vendor_leads` — Lead Collection (NEW)
**Why it exists:** Sponsors and vendors collect opt-in leads from attendees.
**Key fields:** id, vendor_id (nullable), sponsor_id (nullable), event_id, attendee_user_id, collected_at

---

### Certificate Entities

#### 34. `certificate_templates` — Reusable Templates
**Why it exists:** Organizations maintain a library of certificate designs.
**Key fields:** id, tenant_id, name, template_html, thumbnail_url, created_at

#### 35. `certificates` — Generated Certificates
**Why it exists:** Each attendee gets a unique certificate with a QR verification code.
**Key fields:** id, event_id, tenant_id, user_id, template_id, verification_code (UUID), verification_qr_url, certificate_url, generated_at

---

### Notification Entities (EXPANDED)

#### 36. `notification_templates` — Reusable Templates
**Why it exists:** Standardized notification messages with variable substitution.
**Key fields:** id, tenant_id, name, channel (EMAIL/PUSH/IN_APP), subject_template, body_template, notification_type (REGISTRATION/REMINDER/SCHEDULE_UPDATE/VENUE_CHANGE/CERTIFICATE/FEEDBACK/BROADCAST/EMERGENCY), created_at

#### 37. `notifications` — Notification Log
**Why it exists:** Record of every notification sent, for audit, retry, and delivery tracking.
**Key fields:** id, tenant_id, user_id, template_id, channel, status (QUEUED/SENDING/SENT/DELIVERED/FAILED), priority (NORMAL/HIGH/EMERGENCY), payload (JSON), scheduled_at, sent_at, delivered_at, error_message, retry_count

#### 38. `audience_segments` — Notification Targeting (NEW)
**Why it exists:** Audience segmentation for targeted notifications per PRD.
**Key fields:** id, tenant_id, event_id, name, criteria (JSON — role, registration status, attendance status), created_by, created_at

---

### Feedback Entities

#### 39. `feedback_forms` — Survey Definitions
**Why it exists:** Post-event surveys with configurable questions.
**Key fields:** id, event_id, tenant_id, questions (JSON), is_active, created_at

#### 40. `feedback_responses` — Survey Answers
**Why it exists:** Stores individual attendee feedback responses.
**Key fields:** id, form_id, user_id, answers (JSON), nps_score, sentiment (POSITIVE/NEUTRAL/NEGATIVE), submitted_at

---

### Document Entities (EXPANDED)

#### 41. `documents` — File Metadata
**Why it exists:** Tracks uploaded files with version control and access control.
**Key fields:** id, tenant_id, event_id (nullable), uploaded_by, file_name, file_url, file_type, file_size, category (BROCHURE/POSTER/PRESENTATION/CONTRACT/RULEBOOK/POLICY/REPORT/CERTIFICATE), version, access_level, is_rag_indexed, created_at

#### 42. `document_versions` — Version History (NEW)
**Why it exists:** Document version control per SRS FR-DOC-02.
**Key fields:** id, document_id, version_number, file_url, uploaded_by, change_notes, created_at

---

### AI Entities

#### 43. `ai_conversations` — AI Chat History
**Why it exists:** Preserves AI assistant conversation history for context continuity.
**Key fields:** id, tenant_id, user_id, event_id (nullable), conversation_type (ASSISTANT/PLANNING/REPORT/FAQ/CONTENT), created_at

#### 44. `ai_messages` — Individual Messages
**Why it exists:** Each message in an AI conversation (user query + AI response).
**Key fields:** id, conversation_id, role (USER/ASSISTANT), content, sources (JSON — cited documents for RAG), created_at

#### 45. `ai_generated_content` — AI Output History (NEW)
**Why it exists:** Store AI-generated content (reports, FAQs, event descriptions) for review.
**Key fields:** id, tenant_id, event_id, content_type (REPORT/FAQ/DESCRIPTION/EMAIL_DRAFT/SOCIAL_POST), content, generated_at

---

### Audit Entities (EXPANDED)

#### 46. `audit_logs` — Immutable Audit Trail
**Why it exists:** Compliance requirement. Every state change is recorded.
**Key fields:** id, tenant_id, user_id, entity_type, entity_id, action (CREATE/UPDATE/DELETE), before_state (JSON), after_state (JSON), ip_address, user_agent, timestamp

#### 47. `login_history` — Authentication Audit (NEW)
**Why it exists:** Track all login attempts per SRS — login history, security monitoring.
**Key fields:** id, user_id, ip_address, device_info, user_agent, success, failure_reason, timestamp

#### 48. `ticket_validation_logs` — QR Scan Audit (NEW)
**Why it exists:** Log every QR scan attempt for security and analytics per SRS.
**Key fields:** id, ticket_id, event_id, scanned_by, result (VALID/INVALID/DUPLICATE/EXPIRED/REVOKED), ip_address, scanned_at

---

### Token/Session Entities

#### 49. `refresh_tokens` — JWT Refresh Tokens
**Why it exists:** Tracks issued refresh tokens for session management, rotation, and revocation.
**Key fields:** id, user_id, token_hash, device_info, expires_at, revoked, replaced_by_id, created_at

---

## 2. Key Relationships

```
tenants ─────────────< organizations
tenants ─────────────< events
tenants ─────────────< venues
tenants ─────────────< resources          (NEW)
tenants ─────────────< audit_logs

organizations ───────< departments        (NEW)

users ───────────────< tenant_memberships >──────────── tenants
users ───────────────< registrations
users ───────────────< attendance_records
users ───────────────< certificates
users ───────────────< notifications
users ───────────────< tasks              (NEW)
users ───────────────< login_history      (NEW)

events ──────────────< sessions
events ──────────────< registrations
events ──────────────< sponsors
events ──────────────< vendors            (NEW)
events ──────────────< volunteer_assignments
events ──────────────< tasks              (NEW)
events ──────────────< resource_allocations (NEW)
events ──────────────< feedback_forms
events ──────────────< teams              (NEW)

teams ───────────────< team_members       (NEW)
teams ───────────────< registrations (FK: team_id)

sessions ────────────< session_speakers >──────────── users
sessions ────────────< session_attendance

venues ──────────────< rooms
venues ──────────────< events (FK: venue_id)

resources ───────────< resource_allocations (NEW)

registrations ───────< tickets
tickets ─────────────< attendance_records
tickets ─────────────< ticket_validation_logs (NEW)

vendors ─────────────< booth_allocations  (NEW)
vendors ─────────────< vendor_leads       (NEW)

documents ───────────< document_versions  (NEW)

certificate_templates < certificates
feedback_forms ──────< feedback_responses

workflow_definitions ─< workflow_instances (NEW)
workflow_instances ───< approval_records  (NEW)

ai_conversations ────< ai_messages
```

**Legend:** `<` = one-to-many, `>───<` = many-to-many (via join table)

---

## 3. Recommended Indexes

### Primary Access Patterns

| Table | Index | Justification |
|-------|-------|---------------|
| All tables with `tenant_id` | `idx_{table}_tenant_id` | Every query is filtered by tenant_id first |
| `users` | `idx_users_email` (UNIQUE) | Login lookup by email |
| `tenants` | `idx_tenants_slug` (UNIQUE) | Tenant resolution by subdomain/slug |
| `events` | `idx_events_tenant_status` (tenant_id, status) | List events by status within tenant |
| `events` | `idx_events_start_date` | Sort/filter events by date |
| `events` | `idx_events_category` (tenant_id, category) | Filter by event category |
| `registrations` | `idx_reg_event_user` (event_id, user_id) UNIQUE | Prevent duplicate registration |
| `registrations` | `idx_reg_event_status` (event_id, status) | Filter registrations by status |
| `tickets` | `idx_tickets_code` (ticket_code) UNIQUE | Ticket lookup during QR scan |
| `tickets` | `idx_tickets_expires` (expires_at) | Find expired tickets |
| `attendance_records` | `idx_att_event_user` (event_id, user_id) UNIQUE | Prevent duplicate check-in |
| `attendance_records` | `idx_att_event_checkin` (event_id, checked_in_at) | Real-time attendance queries |
| `certificates` | `idx_cert_verification` (verification_code) UNIQUE | Public certificate verification |
| `audit_logs` | `idx_audit_entity` (entity_type, entity_id) | Audit trail lookup by entity |
| `audit_logs` | `idx_audit_timestamp` (tenant_id, timestamp) | Time-range audit queries |
| `tenant_memberships` | `idx_tm_tenant_user` (tenant_id, user_id) UNIQUE | User-tenant lookup |
| `sessions` | `idx_sessions_event` (event_id) | List sessions for an event |
| `notifications` | `idx_notif_user_status` (user_id, status) | User notification inbox |
| `notifications` | `idx_notif_scheduled` (scheduled_at, status) | Scheduled notification processing |
| `resources` | `idx_resource_tenant_category` (tenant_id, category) | Resource search |
| `resource_allocations` | `idx_ra_resource_time` (resource_id, start_time, end_time) | Double-booking prevention |
| `tasks` | `idx_tasks_assigned` (assigned_to, status) | User task list |
| `tasks` | `idx_tasks_deadline` (deadline, status) | Overdue task detection |
| `login_history` | `idx_login_user_time` (user_id, timestamp) | Login history lookup |
| `ticket_validation_logs` | `idx_tvl_ticket` (ticket_id) | Validation audit trail |
| `document_versions` | `idx_dv_document` (document_id) | Version history |

### Composite Indexes for Performance

| Index | Columns | Purpose |
|-------|---------|---------| 
| `idx_events_tenant_type_date` | (tenant_id, event_type, start_date) | Filtered event discovery |
| `idx_reg_tenant_event` | (tenant_id, event_id, status) | Registration dashboard |
| `idx_att_tenant_event_date` | (tenant_id, event_id, checked_in_at) | Attendance analytics |
| `idx_notif_tenant_type` | (tenant_id, notification_type, status) | Notification dashboard |

---

## 4. Recommended Constraints

### Referential Integrity

- All foreign keys must use `ON DELETE RESTRICT` (prevent accidental cascading deletes)
- Exception: `audit_logs`, `login_history`, `ticket_validation_logs` have no foreign keys (append-only audit tables)

### Data Integrity

| Table | Constraint | Type |
|-------|-----------|------|
| `tenants` | slug is unique | UNIQUE |
| `users` | email is unique | UNIQUE |
| `tenant_memberships` | (tenant_id, user_id) is unique | UNIQUE |
| `registrations` | (event_id, user_id) is unique | UNIQUE |
| `attendance_records` | (event_id, user_id) is unique | UNIQUE |
| `tickets` | ticket_code is unique | UNIQUE |
| `certificates` | verification_code is unique | UNIQUE |
| `events` | capacity >= 0 | CHECK |
| `events` | end_date > start_date | CHECK |
| `sessions` | end_time > start_time | CHECK |
| `feedback_responses` | nps_score BETWEEN 0 AND 10 | CHECK |
| `resource_allocations` | end_time > start_time | CHECK |
| `resource_allocations` | quantity_allocated > 0 | CHECK |
| `tasks` | priority IN ('HIGH','MEDIUM','LOW') | CHECK |
| `notifications` | retry_count <= 3 | CHECK |
| All tables | tenant_id NOT NULL (except users, roles, permissions, login_history) | NOT NULL |
| All entities | created_at NOT NULL DEFAULT NOW() | DEFAULT |

### Business Rules as Constraints (from SRS Section 7)

| Rule | Enforcement |
|------|-------------|
| BR-01: Every org belongs to one tenant | FK organization.tenant_id → tenants.id |
| BR-02: Every event belongs to one org | FK events.organization_id → organizations.id |
| BR-04: Registration closes at capacity | Application-level check before INSERT |
| BR-05: QR ticket scanned only once | UNIQUE constraint on attendance_records(event_id, user_id) |
| BR-07: Tenant data isolation | Hibernate @Filter + `tenant_id` on all tables |

### Soft Delete Strategy

- Use `status` columns instead of physical deletes for: tenants, users, events, registrations, tickets, resources
- Audit tables (`audit_logs`, `login_history`, `ticket_validation_logs`) are never deleted (append-only, time-based archival)

---

## 5. Data Volume Estimates

| Entity | Expected Volume (Year 1) | Growth Pattern |
|--------|--------------------------|----------------|
| tenants | 100–200 | Slow, steady |
| users | 100K–500K | Fast (attendees) |
| events | 500–2,000 | Steady |
| registrations | 500K–2M | Burst (per event) |
| teams | 5K–20K | Burst (hackathons) |
| tickets | 500K–2M | 1:1 with registrations |
| attendance_records | 300K–1.5M | Burst (event day) |
| certificates | 300K–1.5M | Batch (post-event) |
| tasks | 10K–50K | Moderate |
| resources | 500–2K | Slow |
| resource_allocations | 5K–20K | Moderate |
| audit_logs | 5M–20M | Continuous, high volume |
| login_history | 1M–5M | Continuous |
| ticket_validation_logs | 500K–2M | Burst (event day) |
| notifications | 2M–10M | Burst (event triggers) |
| sessions | 5K–20K | Moderate |
| documents | 10K–50K | Moderate |
| vendors | 1K–5K | Moderate |
| ai_messages | 100K–500K | Moderate |

### Partitioning Recommendations (Future)

- `audit_logs`: Partition by `timestamp` (monthly) — highest volume table
- `login_history`: Partition by `timestamp` (monthly) — high volume audit
- `ticket_validation_logs`: Partition by `scanned_at` (monthly) — high volume audit
- `notifications`: Partition by `sent_at` (monthly) — high volume, archivable
- `attendance_records`: Partition by `event_id` — queries always scoped to single event
