# EventSphere AI — User Role Permission Matrix

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## Permission Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full access (Create, Read, Update, Delete) |
| 📖 | Read-only access |
| 🔸 | Limited access (scoped to assigned items only) |
| ❌ | No access |

**Note:** 9 user roles (Vendor added per updated PRD)

---

## 1. Platform & Tenant Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create Tenants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage All Tenants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Suspend/Reactivate Tenants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Platform Analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Platform Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 2. Organization Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Organization Profile | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Organization Branding | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Teams & Departments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Organization | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Organization Dashboard | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. User & Role Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Invite Users to Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Roles (Org Level) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Roles (Event Level) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Remove Users from Organization | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View All Users in Organization | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Own Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. Event Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create Event | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Event Details | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Event | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit Event for Review | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve/Reject Event | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Publish Event | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Event Lifecycle | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clone Event | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Event List | ✅ | ✅ | ✅ | 🔸 | 🔸 | 🔸 | 🔸 | 🔸 | 📖 |
| View Event Details (Public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Session & Schedule Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create Sessions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Sessions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Sessions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Speakers to Sessions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Schedule | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload Session Materials | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Venue Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create Venues | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Venues | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Venues | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Venues | ✅ | ✅ | ✅ | 📖 | 📖 | ❌ | 📖 | ❌ | 📖 |

---

## 7. Registration Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| View All Registrations | ✅ | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve/Reject Registrations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export Registrations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Register for Event | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Register Team | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cancel Own Registration | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Own Registration Status | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 8. Ticketing

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Generate Tickets (Bulk) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Revoke Tickets | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Validate Tickets (Scan QR) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Download Own Ticket | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 9. Attendance

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Scan QR for Check-In | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manual Check-In | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Attendance Dashboard | ✅ | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export Attendance Data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Own Attendance History | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 10. Workflow Automation — NEW

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Configure Workflows | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Workflow Status | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve/Reject in Workflows | ✅ | ✅ | 🔸 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Automation Logs | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 11. Resource Management — NEW

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Add/Edit Resources | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Allocate Resources to Events | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Resource Availability | ✅ | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Allocation History | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 12. Task Management — NEW

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Create/Edit Tasks | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign Tasks | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Assigned Tasks | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update Task Status | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Task Dashboard | ✅ | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 13. Volunteer Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Assign Volunteers to Events | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Shifts | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Own Shifts & Tasks | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Volunteer Performance | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 14. Sponsor & Vendor Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Add/Edit Sponsors | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Register as Vendor | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Booth Allocation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Upload/View Contracts | ✅ | ✅ | ✅ | ❌ | ❌ | 📖 | 📖 | ❌ | ❌ |
| Collect Leads | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| View Sponsor ROI Reports | ✅ | ✅ | ✅ | ❌ | ❌ | 📖 | ❌ | ❌ | ❌ |
| View Own Profile | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

---

## 15. Certificate Management

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Upload Certificate Templates | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Trigger Bulk Generation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Download Own Certificate | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Verify Certificate (Public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 16. Communication & Notifications

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Send Bulk Notifications | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send Broadcast Messages | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send Emergency Notifications | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Notification Templates | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configure Audience Segments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Delivery Tracking | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Own Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 17. Analytics & Reports

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| View Platform Analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Organization Analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Event Analytics | ✅ | ✅ | ✅ | ❌ | ❌ | 🔸 | ❌ | ❌ | ❌ |
| View Volunteer Performance | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Sponsor Analytics | ✅ | ✅ | ✅ | ❌ | ❌ | 📖 | ❌ | ❌ | ❌ |
| Export Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 18. Documents

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Upload Documents | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Documents | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Document Versions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Shared Documents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 19. AI Features

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| Use AI Assistant | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Use AI Event Planning | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate AI Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate AI FAQ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View AI Recommendations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Use AI Content Generator | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 20. Audit Logs

| Permission | Super Admin | Org Admin | Event Manager | Volunteer | Speaker | Sponsor | Vendor | Judge | Attendee |
|------------|:-----------:|:---------:|:-------------:|:---------:|:-------:|:-------:|:------:|:-----:|:--------:|
| View Platform Audit Logs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Organization Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Event Audit Logs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Login History | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Approval Logs | ✅ | ✅ | 📖 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
