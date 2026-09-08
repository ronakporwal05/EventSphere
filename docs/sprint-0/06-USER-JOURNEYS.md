# EventSphere AI — User Journeys

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## Journey 1: Organization Admin — Complete Event Lifecycle

This is the primary admin workflow from onboarding to post-event analytics. Reflects the expanded event lifecycle with Review, Approval, and Workflow Automation stages.

### Phase 1: Organization Setup

```
┌──────────────────┐
│  1. REGISTER     │  Org Admin creates account with email/password
└────────┬─────────┘  Email verification required before activation
         │
         ▼
┌──────────────────┐
│  2. CREATE ORG   │  Provide: name, slug, logo, description, theme colors
└────────┬─────────┘  System creates tenant with unique tenant_id
         │            Org Admin becomes the first user with ORGANIZATION_ADMIN role
         ▼
┌──────────────────┐
│  3. CONFIGURE    │  Set up: notification preferences, default event settings
└────────┬─────────┘  Upload branding assets (logo, banner)
         │            Configure workflow rules (auto-approve vs manual)
         │            Set up resource inventory (projectors, rooms, etc.)
         ▼
┌──────────────────┐
│  4. INVITE TEAM  │  Invite Event Managers, Volunteers via email
└────────┬─────────┘  Assign roles to team members
         │            Invitees receive email → click link → set password → join org
         ▼
```

### Phase 2: Event Creation & Approval

```
┌──────────────────┐
│  5. CREATE EVENT │  Fill: title, description, type, start/end dates
└────────┬─────────┘  Set: capacity, venue, banner image
         │            Status: DRAFT
         ▼
┌──────────────────┐
│  6. ADD SESSIONS │  Create sessions within the event
└────────┬─────────┘  Set: title, time slot, track, room
         │            Assign speakers to each session
         │            AI Schedule Optimizer checks for conflicts
         ▼
┌──────────────────┐
│  7. ALLOCATE     │  Book venue and rooms
│    RESOURCES     │  Allocate: projectors, cameras, audio equipment
└────────┬─────────┘  System prevents double-booking of resources
         │
         ▼
┌──────────────────┐
│  8. CONFIGURE    │  Design registration form (custom fields)
│    REGISTRATION  │  Set: moderation (auto-approve or manual)
└────────┬─────────┘  Set: capacity limits, waitlist behavior
         │            Enable team registration for hackathons
         ▼
┌──────────────────┐
│  9. SUBMIT FOR   │  Change status: DRAFT → REVIEW
│    REVIEW        │  Workflow sends notification to Org Admin for approval
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  10. APPROVE     │  Org Admin reviews event details
│     EVENT        │  Change status: REVIEW → APPROVED
└────────┬─────────┘  Approval logged in audit trail
         │
         ▼
┌──────────────────────┐
│  11. PUBLISH EVENT   │  Change status: APPROVED → PUBLISHED
└────────┬─────────────┘  Event becomes visible on public discovery page
         │
         ▼
┌──────────────────────┐
│  12. OPEN            │  Change status: PUBLISHED → REGISTRATION OPEN
│     REGISTRATION     │  Registration accepts submissions
└────────┬─────────────┘  System sends notification to org followers
         ▼
```

### Phase 3: Pre-Event Operations

```
┌──────────────────────┐
│  13. MONITOR         │  Dashboard shows real-time registration count
│     REGISTRATIONS    │  Review pending registrations (if moderated)
└────────┬─────────────┘  Approve/reject registrations
         │                Workflow auto-generates QR tickets for approved registrations
         ▼
┌──────────────────────┐
│  14. MANAGE          │  Assign volunteers to check-in desks
│     VOLUNTEERS       │  Create task assignments via Task Management
└────────┬─────────────┘  Define shifts and schedules
         │
         ▼
┌──────────────────────┐
│  15. ADD SPONSORS    │  Add sponsor profiles with tier
│     & VENDORS        │  Register vendors, allocate booths
└────────┬─────────────┘  Upload sponsor logos, contracts
         │
         ▼
┌──────────────────────┐
│  16. AUTOMATED       │  Workflow auto-sends reminder emails (configurable: 24h, 1h)
│     REMINDERS        │  Schedule/venue change notifications sent automatically
└────────┬─────────────┘  Emergency notification capability available
         │
         ▼
┌──────────────────────┐
│  17. GO LIVE         │  Change status: REGISTRATION OPEN → LIVE
└────────┬─────────────┘  Check-in scanning becomes active
         │                Real-time attendance dashboard activates
         ▼
```

### Phase 4: Event Day

```
┌──────────────────────┐
│  18. CHECK-IN        │  Volunteers scan attendee QR codes at entry
│     ATTENDEES        │  System validates digitally signed QR → marks attendance
└────────┬─────────────┘  Real-time count updates on dashboard
         │                Duplicate scans are rejected with warning
         │                Manual check-in available for edge cases
         ▼
┌──────────────────────┐
│  19. TRACK SESSIONS  │  Optional: scan QR at session entry for granular tracking
└────────┬─────────────┘  Monitor which sessions have highest attendance
         │
         ▼
┌──────────────────────┐
│  20. MONITOR TASKS   │  Track volunteer task completion in real-time
└────────┬─────────────┘  System notifies about overdue tasks
         │
         ▼
┌──────────────────────┐
│  21. COMPLETE EVENT  │  Change status: LIVE → COMPLETED
└────────┬─────────────┘  Check-in closes
         │                Post-event workflows auto-trigger
         ▼
```

### Phase 5: Post-Event (Automated)

```
┌──────────────────────┐
│  22. AUTO-FEEDBACK   │  Workflow auto-sends feedback survey to all attendees
│     COLLECTION       │  Survey includes: rating, text feedback, NPS
└────────┬─────────────┘  AI analyzes sentiment of responses
         │
         ▼
┌──────────────────────┐
│  23. AUTO-GENERATE   │  Workflow auto-verifies certificate eligibility (attendance)
│     CERTIFICATES     │  Auto-generates certificates for all eligible attendees
└────────┬─────────────┘  Status: COMPLETED → CERTIFICATE GENERATED
         │                Attendees auto-notified: "Your certificate is ready"
         ▼
┌──────────────────────┐
│  24. AUTO-GENERATE   │  AI generates event success report
│     REPORTS          │  Dashboard shows:
└────────┬─────────────┘  • Total registrations vs. attendance (conversion rate)
         │                • No-show rate
         │                • Session-wise attendance breakdown
         │                • Feedback sentiment analysis
         │                • Volunteer performance metrics
         │                • Sponsor ROI metrics
         │                • Comparison with previous events
         ▼
┌──────────────────────┐
│  25. ARCHIVE EVENT   │  Change status: CERTIFICATE GENERATED → ARCHIVED
└──────────────────────┘  Event data preserved for historical analytics
                          AI module ingests data for future recommendations
```

---

## Journey 2: Attendee — Registration to Certificate

```
┌──────────────────────┐
│  1. DISCOVER EVENT   │  Attendee finds event via:
└────────┬─────────────┘  • Public event listing page
         │                • Shared link from organizer
         │                • Organization's public profile
         ▼
┌──────────────────────┐
│  2. VIEW EVENT PAGE  │  See: title, description, date, venue, sessions, speakers
└────────┬─────────────┘  See: capacity remaining, registration deadline
         │
         ▼
┌──────────────────────┐
│  3. REGISTER         │  Create account (email verification required)
└────────┬─────────────┘  Fill registration form (name, email, custom fields)
         │                OR register as team (for hackathons)
         │                Submit registration
         │
         ├───── (Auto-Approve) ──────┐
         │                           │
         ├───── (Moderated) ───┐     │
         │                     ▼     │
         │              ┌──────────┐ │
         │              │ PENDING  │ │
         │              │ APPROVAL │ │
         │              └────┬─────┘ │
         │                   │       │
         │              Org Admin    │
         │              approves     │
         │                   │       │
         ▼                   ▼       ▼
┌──────────────────────┐
│  4. RECEIVE TICKET   │  Workflow auto-generates digitally signed QR ticket
└────────┬─────────────┘  Email sent: "Registration confirmed! Here's your ticket"
         │                Ticket available in attendee dashboard + mobile app
         │                PDF download available, offline ticket support
         ▼
┌──────────────────────┐
│  5. EVENT DAY        │  Receive automated reminder notifications (24h, 1h before)
│     CHECK-IN         │  Arrive at venue → show QR code on phone (or offline ticket)
└────────┬─────────────┘  Volunteer scans QR → "Welcome, [Name]!" confirmation
         │                Attendance recorded
         ▼
┌──────────────────────┐
│  6. ATTEND SESSIONS  │  View schedule on mobile app / web
└────────┬─────────────┘  Optional: scan into sessions for session-level tracking
         │
         ▼
┌──────────────────────┐
│  7. PROVIDE FEEDBACK │  Auto-received post-event feedback survey
└────────┬─────────────┘  Rate experience, leave comments
         │
         ▼
┌──────────────────────┐
│  8. DOWNLOAD         │  Auto-receive notification: "Certificate ready!"
│     CERTIFICATE      │  Download PDF from attendee dashboard / mobile app
└──────────────────────┘  Certificate has QR verification code
                          Can share on LinkedIn with verification link
```

---

## Journey 3: Speaker — Session Management

```
┌──────────────────────┐
│  1. RECEIVE          │  Event Manager assigns speaker to session
│     INVITATION       │  Speaker receives email with session details
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  2. VIEW DASHBOARD   │  See: assigned sessions, time slots, room assignments
└────────┬─────────────┘  See: event schedule, other speakers
         │
         ▼
┌──────────────────────┐
│  3. UPLOAD MATERIALS │  Upload: presentation slides, resources, handouts
└────────┬─────────────┘  Document version control tracks changes
         │                Materials available to attendees post-session
         ▼
┌──────────────────────┐
│  4. DELIVER SESSION  │  Session attendance tracked automatically
└────────┬─────────────┘  
         │
         ▼
┌──────────────────────┐
│  5. VIEW FEEDBACK    │  See session-specific feedback and ratings
└────────┬─────────────┘  Download speaker certificate
         ▼
```

---

## Journey 4: Volunteer — Event Day Operations

```
┌──────────────────────┐
│  1. RECEIVE          │  Event Manager assigns volunteer role
│     ASSIGNMENT       │  Volunteer sees assigned tasks, shifts, and deadlines
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  2. VIEW TASKS       │  Task dashboard shows: assigned tasks, priority, deadline
└────────┬─────────────┘  Overdue task notifications auto-sent
         │
         ▼
┌──────────────────────┐
│  3. SCAN QR CODES    │  Open scanner on mobile app
│     FOR CHECK-IN     │  Scan attendee QR → System validates signed payload → confirmation
└────────┬─────────────┘  Handle edge cases: invalid ticket, already checked in, expired
         │
         ▼
┌──────────────────────┐
│  4. MARK TASKS       │  Update task status: To Do → In Progress → Completed
│     COMPLETE         │  Event Manager sees real-time task completion dashboard
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  5. RECEIVE          │  Get volunteer certificate for contribution
│     CERTIFICATE      │  Performance tracked for future events
└──────────────────────┘
```

---

## Journey 5: Judge — Hackathon Evaluation

```
┌──────────────────────┐
│  1. RECEIVE ACCESS   │  Event Manager assigns judge role for hackathon event
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  2. VIEW SUBMISSIONS │  See all team/participant submissions
└────────┬─────────────┘  Access: project descriptions, demo links, repositories
         │
         ▼
┌──────────────────────┐
│  3. EVALUATE &       │  Score each submission on defined criteria
│     SCORE            │  Add comments and feedback per submission
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  4. SUBMIT RESULTS   │  Submit final scores
└──────────────────────┘  Event Manager aggregates scores and announces winners
```

---

## Journey 6: Vendor — Exhibition Operations (NEW)

```
┌──────────────────────┐
│  1. REGISTER AS      │  Vendor registers for event exhibition
│     VENDOR           │  Submit: company info, booth requirements, products/services
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  2. RECEIVE BOOTH    │  Event Manager allocates booth location
│     ALLOCATION       │  View: booth number, floor plan, setup instructions
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  3. UPLOAD CONTRACT  │  Upload signed contract/agreement
└────────┬─────────────┘  View contract status
         │
         ▼
┌──────────────────────┐
│  4. COLLECT LEADS    │  Collect attendee leads at booth (opt-in)
└────────┬─────────────┘  View lead analytics
         │
         ▼
┌──────────────────────┐
│  5. VIEW REPORTS     │  View booth traffic and engagement metrics
└──────────────────────┘
```

---

## State Machines

### Event Lifecycle States (Expanded — 9 states)

```
    ┌───────────┐   submitForReview()  ┌───────────┐    approve()     ┌───────────┐
    │   DRAFT   │ ──────────────────► │  REVIEW   │ ──────────────► │ APPROVED  │
    └───────────┘                      └───────────┘                  └─────┬─────┘
         │                                  │                               │
         │ delete()                        │ reject()                      │ publish()
         ▼                                  ▼                               ▼
    ┌───────────┐                      ┌───────────┐                  ┌───────────┐
    │  DELETED  │                      │   DRAFT   │                  │ PUBLISHED │
    └───────────┘                      └───────────┘                  └─────┬─────┘
                                                                            │
                                                                            │ openRegistration()
                                                                            ▼
                                                                      ┌─────────────┐
                                                                      │ REGISTRATION│
                                                                      │    OPEN     │
                                                                      └──────┬──────┘
                                                                             │
                                                                             │ goLive()
                                                                             ▼
                                                                      ┌───────────┐
                                                                      │   LIVE    │
                                                                      └─────┬─────┘
                                                                            │
                                                                            │ complete()
                                                                            ▼
                                                                      ┌───────────┐
                                                                      │ COMPLETED │
                                                                      └─────┬─────┘
                                                                            │
                                                                            │ generateCertificates()
                                                                            ▼
                                                                      ┌─────────────┐
                                                                      │ CERTIFICATE │
                                                                      │  GENERATED  │
                                                                      └──────┬──────┘
                                                                             │
                                                                             │ archive()
                                                                             ▼
                                                                      ┌───────────┐
                                                                      │ ARCHIVED  │
                                                                      └───────────┘
```

### Registration States

```
    ┌───────────┐     approve()    ┌───────────┐     confirm()    ┌───────────┐
    │  PENDING  │ ──────────────► │ APPROVED  │ ──────────────► │ CONFIRMED │
    └───────────┘                  └───────────┘                  └───────────┘
         │                              │
         │ reject()                     │ cancel()
         ▼                              ▼
    ┌───────────┐                  ┌───────────┐
    │ REJECTED  │                  │ CANCELLED │
    └───────────┘                  └───────────┘
```

### Ticket States

```
    ┌───────────┐     issue()      ┌───────────┐     checkin()    ┌───────────┐
    │ GENERATED │ ──────────────► │  ACTIVE   │ ──────────────► │   USED    │
    └───────────┘                  └───────────┘                  └───────────┘
                                        │
                                        ├── revoke()
                                        │      ▼
                                        │ ┌───────────┐
                                        │ │  REVOKED  │
                                        │ └───────────┘
                                        │
                                        └── expired()
                                               ▼
                                          ┌───────────┐
                                          │  EXPIRED  │
                                          └───────────┘
```

### Task States (NEW)

```
    ┌───────────┐     start()      ┌─────────────┐   complete()   ┌───────────┐
    │  TO DO    │ ──────────────► │ IN PROGRESS │ ─────────────► │ COMPLETED │
    └───────────┘                  └─────────────┘                 └───────────┘
```
