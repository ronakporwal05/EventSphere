# EventSphere AI — Git Strategy

**Version:** 2.0 | **Date:** August 2026 | **Status:** Draft

---

## 1. Repository Structure

### Mono-Repository Approach

All components (backend, frontend, mobile, infra, docs) live in a **single repository**.

```
eventsphere-ai/          # Single repository
├── backend/
├── frontend/
├── mobile/
├── database/
├── docs/
├── infrastructure/
└── .github/
```

### Why Mono-Repo?

| Factor | Mono-Repo ✅ | Multi-Repo |
|--------|-------------|------------|
| Team size (1-3 devs) | Perfect fit | Overhead |
| Cross-project changes | Atomic commits | Coordinated PRs across repos |
| CI/CD complexity | Single pipeline with path filters | Multiple pipelines |
| Shared documentation | Co-located | Scattered |
| Dependency management | Easier | Version sync issues |
| Code review | Full context | Partial context |

**Path-filtered CI:** GitHub Actions use `paths:` filters so backend changes only trigger backend CI, frontend changes only trigger frontend CI.

---

## 2. Branch Strategy

### Git Flow (Modified)

```
main (production)
 │
 ├── develop (integration)
 │    │
 │    ├── feature/auth-jwt-login
 │    ├── feature/event-lifecycle
 │    ├── feature/qr-ticketing
 │    │
 │    ├── bugfix/tenant-filter-leak
 │    │
 │    └── refactor/extract-email-service
 │
 ├── release/v1.0.0
 │
 └── hotfix/critical-auth-bypass
```

### Branch Types

| Branch | Pattern | Source | Merges Into | Purpose |
|--------|---------|--------|-------------|---------|
| `main` | `main` | — | — | Production-ready code. Always deployable. |
| `develop` | `develop` | `main` | `main` (via release) | Integration branch. Latest development state. |
| `feature/*` | `feature/{module}-{description}` | `develop` | `develop` | New features and enhancements |
| `bugfix/*` | `bugfix/{description}` | `develop` | `develop` | Non-critical bug fixes |
| `hotfix/*` | `hotfix/{description}` | `main` | `main` + `develop` | Critical production fixes |
| `release/*` | `release/v{X.Y.Z}` | `develop` | `main` + `develop` | Release stabilization |
| `refactor/*` | `refactor/{description}` | `develop` | `develop` | Code restructuring |

### Branch Naming Examples

```
feature/auth-jwt-authentication
feature/event-create-publish
feature/ticket-qr-generation
feature/ai-rag-assistant
bugfix/tenant-data-leak-fix
bugfix/certificate-unicode-names
hotfix/security-jwt-validation
release/v1.0.0
refactor/extract-notification-service
```

### Branch Rules

| Rule | `main` | `develop` | `feature/*` |
|------|--------|-----------|-------------|
| Direct push | ❌ Blocked | ❌ Blocked | ✅ Allowed |
| PR required | ✅ Yes | ✅ Yes | N/A |
| CI must pass | ✅ Required | ✅ Required | ✅ Required |
| Approvals needed | 1 (min) | 1 (min) | 0 |
| Force push | ❌ Never | ❌ Never | ✅ Allowed |

---

## 3. Commit Conventions

### Conventional Commits (Enforced)

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(event): add event cloning functionality` |
| `fix` | Bug fix | `fix(tenant): prevent cross-tenant data access` |
| `docs` | Documentation | `docs(api): update OpenAPI spec for registration endpoints` |
| `style` | Formatting (no logic change) | `style(auth): format controller annotations` |
| `refactor` | Code restructuring | `refactor(ticket): extract QR signing into utility class` |
| `test` | Adding/updating tests | `test(auth): add JWT expiration edge case tests` |
| `perf` | Performance improvement | `perf(analytics): add Redis cache for dashboard queries` |
| `chore` | Build, CI, dependencies | `chore(deps): upgrade Spring Boot to 3.3.1` |
| `ci` | CI/CD changes | `ci(backend): add test coverage reporting` |
| `build` | Build system changes | `build(docker): optimize multi-stage Dockerfile` |

### Scope Values (Module-Based)

```
auth, tenant, organization, user, role, event, session, venue,
registration, ticket, attendance, workflow, resource, task, volunteer,
sponsor, vendor, certificate, notification, analytics, document, ai,
audit, common, frontend, mobile, infra, deps, ci
```

### Commit Examples

```
feat(auth): implement JWT login with refresh token rotation

- Add login endpoint with email/password authentication
- Generate access token (15min TTL) and refresh token (7day TTL)
- Store refresh token hash in database for revocation support
- Add BCrypt password hashing with strength 12

Closes #23

---

fix(tenant): enforce tenant_id filter on event queries

Previously, the event list endpoint did not apply the tenant filter
when the user had SUPER_ADMIN role, allowing cross-tenant event
visibility.

- Add tenant filter to all event repository methods
- Add integration test for cross-tenant isolation
- Update TenantAwareRepository base class

Fixes #47

---

docs(sprint-0): add database planning document

- Identify 32 entities with field descriptions
- Document all relationships and cardinality
- Recommend indexes for primary access patterns
- Estimate Year 1 data volumes
```

### Commit Rules

1. Subject line: max 72 characters, imperative mood ("add" not "added")
2. Body: explain **why**, not **what** (the diff shows what)
3. Reference issue numbers in footer: `Closes #XX`, `Fixes #XX`, `Refs #XX`
4. One logical change per commit (atomic commits)
5. Never commit secrets, credentials, or `.env` files

---

## 4. Release Strategy

### Semantic Versioning (SemVer)

```
v{MAJOR}.{MINOR}.{PATCH}

MAJOR: Breaking API changes (e.g., v2.0.0)
MINOR: New features, backward compatible (e.g., v1.1.0)
PATCH: Bug fixes, backward compatible (e.g., v1.0.1)
```

### Release Process

```
Step 1: Create release branch from develop
        git checkout develop
        git checkout -b release/v1.0.0

Step 2: Stabilization (bug fixes only, no features)
        Fix bugs → commit → test

Step 3: Finalize
        Update CHANGELOG.md
        Bump version in pom.xml, package.json
        
Step 4: Merge to main
        PR: release/v1.0.0 → main
        Create Git tag: v1.0.0
        GitHub Release with changelog

Step 5: Back-merge to develop
        PR: release/v1.0.0 → develop
        Resolve conflicts if any

Step 6: Deploy
        CI/CD auto-deploys main to production
```

### Release Cadence

| Phase | Cadence |
|-------|---------|
| MVP Development (Sprint 1-7) | No formal releases. Deploy from `develop` to staging. |
| Post-MVP (Sprint 8+) | Bi-weekly releases |
| Production | Monthly releases (or on-demand for hotfixes) |

---

## 5. Versioning

### Where Version Is Tracked

| File | Field | Example |
|------|-------|---------|
| `backend/pom.xml` | `<version>` | `1.0.0-SNAPSHOT` |
| `frontend/package.json` | `"version"` | `"1.0.0"` |
| `mobile/pubspec.yaml` | `version:` | `1.0.0+1` |
| Git tags | `v{X.Y.Z}` | `v1.0.0` |
| `CHANGELOG.md` | Section header | `## [1.0.0] - 2026-10-15` |

### Pre-Release Versions

```
1.0.0-SNAPSHOT     # Active development (Maven convention)
1.0.0-alpha.1      # Early testing
1.0.0-beta.1       # Feature complete, testing
1.0.0-rc.1         # Release candidate
1.0.0              # Production release
```

---

## 6. Pull Request Workflow

### PR Template

```markdown
## Description
Brief description of changes.

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation
- [ ] CI/CD

## Module(s) Affected
- [ ] Auth
- [ ] Event
- [ ] Tenant
- [ ] (other)

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No secrets or credentials committed
- [ ] Tenant isolation verified (if applicable)
- [ ] Migration script added (if schema changed)

## Related Issues
Closes #XX
```

### PR Review Rules

1. Self-review before requesting review
2. Keep PRs small (< 400 lines changed ideally)
3. One reviewer minimum for `develop`, one for `main`
4. All CI checks must pass
5. Resolve all comments before merge
6. **Squash merge** for feature branches → `develop`
7. **Merge commit** for `develop` → `main` (preserves history)

---

## 7. Git Hooks (Recommended)

| Hook | Action |
|------|--------|
| `pre-commit` | Run linter (checkstyle for Java, ESLint for TS) |
| `commit-msg` | Validate conventional commit format |
| `pre-push` | Run unit tests |

**Tooling:** Use `husky` for frontend hooks, `pre-commit` framework or Maven plugin for backend.
