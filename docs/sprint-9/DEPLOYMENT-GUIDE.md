# EventSphere AI — Production Deployment Guide

This guide details step-by-step instructions for deploying EventSphere AI to production cloud environments.

---

## 1. Architecture Overview

```
                                  +-------------------+
                                  |   Vercel Edge     |
                                  | (Next.js Frontend)|
                                  +---------+---------+
                                            |
                                            v HTTPS API
                                  +---------+---------+
                                  |   Render Cloud    |
                                  | (Spring Boot API) |
                                  +----+----+----+----+
                                       |    |    |
                 +---------------------+    |    +---------------------+
                 |                          |                          |
                 v                          v                          v
      +----------+----------+   +-----------+----------+   +-----------+----------+
      |   Neon PostgreSQL   |   |   Upstash Redis      |   |   Qdrant Cloud Vector    |
      |   (Multi-Tenant DB) |   |   (Session & Cache)  |   |   (AI Vector Search) |
      +---------------------+   +----------------------+   +----------------------+
```

---

## 2. Prerequisites & Environment Setup

### Required Cloud Accounts:
1. **Render.com Account** (for Backend API container host)
2. **Vercel Account** (for Frontend Next.js host)
3. **Neon Tech Account** (for Serverless PostgreSQL 16)
4. **Upstash Account** (for Managed Redis)
5. **Qdrant Cloud Account** (for Vector DB)

---

## 3. Step 1: Database Provisioning (Neon PostgreSQL)

1. Create a project on [Neon.tech](https://neon.tech) named `eventsphere-prod`.
2. Retrieve the PostgreSQL JDBC connection string:
   ```env
   DATABASE_URL=jdbc:postgresql://ep-xyz.neon.tech/eventsphere_db?sslmode=require
   DATABASE_USER=eventsphere_owner
   DATABASE_PASSWORD=your_secure_password
   ```

---

## 4. Step 2: Backend API Deployment (Render)

1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service** selecting `render.yaml` blueprint.
3. Configure Environment Variables in Render Dashboard:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `DATABASE_URL`: JDBC Neon URL
   - `REDIS_HOST`: Upstash Redis host
   - `QDRANT_HOST`: Qdrant Cloud URL
   - `JWT_SECRET`: 256-bit secret key

---

## 5. Step 3: Frontend Web Application Deployment (Vercel)

1. Connect repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variable:
   ```env
   NEXT_PUBLIC_API_URL=https://eventsphere-api.onrender.com/api/v1
   ```
5. Deploy project.
