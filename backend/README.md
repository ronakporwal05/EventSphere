# EventSphere AI — Backend Service

Production-Ready Multi-Tenant Enterprise Event Management Platform Backend built with Spring Boot 3 (Java 21), PostgreSQL, Redis, and Flyway.

## Prerequisites

- **Java 21+**
- **Maven 3.9+**
- **PostgreSQL 16+**
- **Redis 7+**

## Application Architecture

Follows a **Modular Monolith Architecture** with 22 bounded contexts:
- `com.eventsphere.common`: Cross-cutting concerns (Security, TenantContext, Exception handling, OpenAPI, Base entities).
- `com.eventsphere.tenant`: Multi-tenant account management and isolation filters.
- `com.eventsphere.auth`: JWT authentication framework, RBAC permissions, and token lifecycle.

## Getting Started

### 1. Database Setup

Create local PostgreSQL database:
```sql
CREATE DATABASE eventsphere;
```

### 2. Configure Environment

Copy default values or override in `application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/eventsphere
    username: postgres
    password: postgres
```

### 3. Run Migrations & Launch Application

```bash
mvn clean spring-boot:run
```

### 4. API & Swagger Documentation

Once started, access Swagger UI:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`
- **Actuator Health:** `http://localhost:8080/actuator/health`

## Multi-Tenancy

Every multi-tenant request requires either:
- Header: `X-Tenant-ID: <tenant-uuid-or-slug>`
- Or JWT token containing `tenant_id` claim.
