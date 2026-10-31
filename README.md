# Event Sphere AI — Multi-Tenant Enterprise Event Management Platform

Event Sphere AI is a production-ready Multi-Tenant Enterprise Event Management Platform powered by Spring Boot 3, Next.js 16+, PostgreSQL, Redis, Qdrant, and Google Gemini AI.

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
