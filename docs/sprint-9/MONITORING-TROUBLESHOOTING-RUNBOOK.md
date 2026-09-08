# EventSphere AI — SRE Monitoring & Troubleshooting Runbook

## 1. Key Metrics & Alert Thresholds

| Metric | Target SLA | Warning Threshold | Critical Alert Action |
|---|---|---|---|
| **API P95 Latency** | < 500ms | > 800ms | Scale backend CPU units on Render |
| **API Error Rate (5xx)** | < 0.1% | > 1.0% | Inspect Actuator `/actuator/prometheus` & Sentry |
| **Turnstile Scan Throughput** | 300 scans/min | < 100 scans/min | Verify Redis cache connection |
| **Database Pool Usage** | < 70% | > 85% | Increase HikariCP `maximum-pool-size` |
| **System Uptime** | 99.5% | < 99.0% | Trigger failover DB secondary |

---

## 2. Emergency Incident Response Checklist

### Scenario A: High API Latency (P95 > 1000ms)
1. Open Grafana SRE Dashboard (`http://grafana:3000`).
2. Check HikariCP connection pool graph for database bottleneck.
3. Verify Redis caching availability:
   ```bash
   redis-cli -h redis-host ping
   ```
4. Clear stale Redis keys if cache corruption is suspected.

### Scenario B: Database Connection Exhaustion
1. Check active database connections:
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
   ```
2. Adjust HikariCP pool parameters in `application-prod.yml`.
