# EventSphere AI — Docker Orchestration Runbook

## 1. Development Environment Execution

To launch the full development stack locally (PostgreSQL, Redis, Qdrant, MinIO, Spring Boot, Next.js):

```bash
# Clone repository
git clone https://github.com/eventsphere/eventsphere-ai.git
cd eventsphere-ai

# Launch Docker Compose stack
docker-compose up -d --build

# View container logs
docker-compose logs -f backend

# Verify services status
docker-compose ps
```

### Local Endpoint Map:
- **Frontend Dashboard:** `http://localhost:3000`
- **Spring Boot API:** `http://localhost:8080/api/v1`
- **Swagger OpenApi Docs:** `http://localhost:8080/swagger-ui.html`
- **MinIO Admin Console:** `http://localhost:9001` (User: `minio_admin`)
- **Qdrant Vector Dashboard:** `http://localhost:6333/dashboard`

---

## 2. Production Container Orchestration

To run the production-hardened multi-container stack with NGINX reverse proxy:

```bash
# Launch production compose file
docker-compose -f docker-compose.prod.yml up -d --build

# Check production container resource consumption
docker stats
```
