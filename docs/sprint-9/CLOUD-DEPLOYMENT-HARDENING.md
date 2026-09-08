# EventSphere AI — Cloud Deployment & Security Hardening Guide

## 1. Managed Cloud Services Integration

| Service Component | Provider | Configuration Variable | Connection Details |
|---|---|---|---|
| **Database** | Neon PostgreSQL 16 | `DATABASE_URL` | `jdbc:postgresql://ep-xyz.neon.tech/eventsphere_db?sslmode=require` |
| **Caching & Session** | Upstash Redis | `REDIS_HOST`, `REDIS_PORT` | `redis://default:token@upstash.io:6379` |
| **Vector Indexing** | Qdrant Cloud | `QDRANT_HOST`, `QDRANT_API_KEY` | `https://xyz-qdrant.cloud.qdrant.io:6333` |
| **File / Badge Storage** | Supabase S3 Storage | `SUPABASE_S3_ENDPOINT` | `https://xyz.supabase.co/storage/v1/s3` |

---

## 2. Production Security Hardening Checklist

- [x] **Rate Limiting:** Enforced via `RateLimitFilter` in Spring Boot (1,000 req/min per IP) and NGINX edge gateway (30 req/sec for API, 5 req/sec for Auth).
- [x] **Strict CORS Policy:** Restricted to trusted Vercel production frontend domains.
- [x] **BCrypt Hashing:** Passwords encrypted using BCrypt with strength factor 12.
- [x] **Multi-Tenant Header Isolation:** Enforced via Spring Boot `TenantFilter` + `TenantContext` ThreadLocal variable.
- [x] **Security Headers:** Injected `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.
