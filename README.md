# Event Sphere AI — Multi-Tenant Enterprise Event Management Platform

[![Production Deployment](https://img.shields.io/badge/Vercel-Live%20Production-success?style=for-the-badge&logo=vercel)](https://event-sphere-ai-wheat.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20Spring%20Boot%203%20%7C%20Postgres-blue?style=for-the-badge)](https://event-sphere-ai-wheat.vercel.app)

**Event Sphere AI** is a production-ready Multi-Tenant Enterprise Event Management Platform powered by Spring Boot 3, Next.js 16+, PostgreSQL, Redis, Qdrant, and Google Gemini AI.

- 🌐 **Live Production Web App**: [https://event-sphere-ai-wheat.vercel.app](https://event-sphere-ai-wheat.vercel.app)
- 🎟️ **Attendee Hub**: Interactive Seat Selection, Transparent ₹ INR Pass Checkout, Offline QR Wallet.
- 🏢 **Organizer Studio**: Dedicated Workspace Bar, Event Publishing Cockpit, AI Content Copilot, Live QR Turnstile Scanner.
- 🔒 **3-Tier Commercial Navigation**: Role-gated workflows for public discovery, attendees, organizers, and superadmins.

## Project Structure

```
eventsphere-ai/
├── backend/          # Java 21/24 Spring Boot 3 Modular Monolith
├── frontend/         # Next.js 14+ Web Application
├── mobile/           # Flutter Mobile Application
├── database/         # Schema Migrations, Diagrams & Seed Scripts
├── docs/             # Sprint 0 & Sprint 1 Technical Specifications
└── infrastructure/   # Docker Compose & Deployment Scripts
```

## Quick Start (Backend)

```bash
cd backend
./mvnw spring-boot:run
```

## Documentation

All architectural plans and specs are located in `docs/`:
- `docs/sprint-0/`: System Architecture, PRD, SRS, Role Matrix, Database Planning, Roadmap
- `docs/sprint-1/`: Technical Architecture & Foundation Blueprint
