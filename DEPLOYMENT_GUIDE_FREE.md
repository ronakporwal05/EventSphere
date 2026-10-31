# Event Sphere AI — 100% Free Cloud Deployment Guide

This guide details how to deploy the entire **Event Sphere AI** full-stack ecosystem (Next.js 16 Frontend, Spring Boot 3 Backend, Python FastAPI ML Service, PostgreSQL, and Redis) completely **FREE ($0.00 / month)** without needing paid subscriptions.

---

## Architecture Topology

```
                  ┌───────────────────────────────┐
                  │       Vercel (Free)           │
                  │   Next.js 16 (Port 3000)      │
                  │  https://eventsphere.vercel.app│
                  └───────────────┬───────────────┘
                                  │ HTTPS API Requests
                                  ▼
                  ┌───────────────────────────────┐
                  │        Render (Free)          │
                  │ Spring Boot 3 Backend (:8080) │
                  │ https://eventsphere-backend...│
                  └───┬───────────┬───────────┬───┘
                      │           │           │
     SQL Queries      │           │ Internal  │ Redis Caching
                      ▼           ▼           ▼
┌───────────────────────┐ ┌───────────────┐ ┌─────────────────────────┐
│     Neon / Supabase   │ │ Render (Free) │ │      Upstash Redis      │
│  Free PostgreSQL 16   │ │ ML Service    │ │   Serverless Free Tier  │
│ (0.5GB Free Storage)  │ │ (FastAPI :8000│ │ (10k requests/day free) │
└───────────────────────┘ └───────────────┘ └─────────────────────────┘
```

---

## Step 1: Create Free PostgreSQL Database (Neon or Supabase) — 2 mins

1. Go to **[Neon.tech](https://neon.tech/)** and Sign In with GitHub (No credit card needed).
2. Click **Create Project**, name it `eventsphere-db`, and choose PostgreSQL 16.
3. In your dashboard, copy the **Connection string** (select the **Pooled** connection or standard connection):
   ```
   postgresql://alex_owner:AbCd1234EfGh@ep-sweet-snow-123456.us-east-2.aws.neon.tech/eventsphere-db?sslmode=require
   ```
4. Extract your credentials:
   - **JDBC URL**: `jdbc:postgresql://ep-sweet-snow-123456.us-east-2.aws.neon.tech:5432/eventsphere-db?sslmode=require`
   - **Username**: `alex_owner`
   - **Password**: `AbCd1234EfGh`

---

## Step 2: Create Free Serverless Redis (Upstash) — 1 min

1. Go to **[Upstash.com](https://upstash.com/)** and Sign In with GitHub.
2. Click **Create Database**:
   - Name: `eventsphere-redis`
   - Type: `Regional`
   - Region: Select same or nearest region to your database (e.g., `us-east-1` or `eu-central-1`)
   - Plan: **Free**
3. In your database details, copy the connection details under **Connect via Redis Client**:
   - **Endpoint / Host**: `warm-beetle-12345.upstash.io`
   - **Port**: `6379`
   - **Password**: `<your_upstash_password>`
   - **SSL**: `true`

---

## Step 3: Deploy Backend & ML Service to Render (1-Click Blueprint) — 5 mins

1. Push this repository to GitHub (already pushed to `https://github.com/ronakporwal05/EventSphere.git`).
2. Go to **[Render.com](https://dashboard.render.com/)** and Sign In with GitHub.
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Select your **`EventSphere`** repository.
5. Render reads the included `render.yaml` automatically and creates:
   - `eventsphere-backend` (Spring Boot Web Service)
   - `eventsphere-ml-service` (FastAPI ML Service)
6. Render will prompt you for the un-synced environment variables:
   - `SPRING_DATASOURCE_URL`: your JDBC URL from Step 1 (e.g. `jdbc:postgresql://.../eventsphere-db?sslmode=require`)
   - `SPRING_DATASOURCE_USERNAME`: your Neon username
   - `SPRING_DATASOURCE_PASSWORD`: your Neon password
   - `SPRING_DATA_REDIS_HOST`: your Upstash host (e.g. `warm-beetle-12345.upstash.io`)
   - `SPRING_DATA_REDIS_PORT`: `6379`
   - `SPRING_DATA_REDIS_PASSWORD`: your Upstash password
   - `SPRING_DATA_REDIS_SSL_ENABLED`: `true`
   - `GEMINI_API_KEY`: your Google Gemini API key (optional, fallback copilot enabled if empty)
7. Click **Apply**.
8. Once finished, Render will display your public backend URL:
   `https://eventsphere-backend.onrender.com`

---

## Step 4: Deploy Frontend to Vercel (1-Click) — 3 mins

1. Go to **[Vercel.com](https://vercel.com/)** and Sign In with GitHub.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select the **`EventSphere`** repository and click **Import**.
4. Configure the project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`frontend`**
5. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://eventsphere-backend.onrender.com/api/v1` | Your Render Backend URL |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_TsolyDOFVBcgLq` | Razorpay Key ID |
6. Click **Deploy**.
7. In ~2 minutes, Vercel will launch your live web application at:
   `https://eventsphere-xxxx.vercel.app`

---

## Step 5: Verification Checklist

1. Open `https://eventsphere-xxxx.vercel.app` in your browser.
2. Navigate to `/pricing` or `/portal`.
3. Click **"Get VIP Pass"** or **"Register"** $\rightarrow$ Verify Razorpay Modal opens and accepts test payments.
4. Log in using `manager@eventsphere.ai` / `Password123!` or `admin@eventsphere.ai` / `AdminPass123!`.
5. Check `/ai-studio` $\rightarrow$ Verify ML models respond with live predictions.
