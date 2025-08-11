# Observability

This document describes the observability features implemented in the project as well as planned enhancements.

## Logging

- **Structured Logging:**  
  The backend leverages [Serilog](https://serilog.net/) to produce compact JSON logs. Logs are enriched with context (e.g. user identifiers) and are output to the console.

- **Log Enrichment & Transformation:**  
  Docker Compose and Fluent Bit configurations (see `fluent-bit/fluent-bit.yml`) apply container tag–based transformations to provide fields such as:
  - `service_name` (e.g. `svc.backend`, `svc.frontend`)
  - `trace_id` and `span_id` for future distributed tracing support

- **Log Shipping to Loki:**  
  Logs from the backend, database, and frontend are forwarded via Fluent Bit to a [Loki](https://grafana.com/oss/loki/) instance. This enables centralized log exploration in Grafana using the configured parsing and renaming rules.

## Health and Readiness

- **Health Endpoint:**  
  A `/health` endpoint (implemented in `backend/Controllers/CheckController.cs`) returns an HTTP 200 status when the service and its dependencies are healthy. This endpoint is utilized for Docker health checks and orchestration.

## Metrics

- **Planned Metrics Instrumentation:**  
  Future enhancements include integrating tools such as [Prometheus](https://prometheus.io/) or [OpenTelemetry](https://opentelemetry.io/) to expose:
  - Request count and duration (e.g. p50/p95/p99)
  - HTTP error rates (4xx/5xx)
  - Database query performance
  - System resource utilization (CPU, memory, GC metrics)
  - Business-specific counters (for example, new user registrations)
  
## Dashboards

- **Grafana Integration:**  
  A Grafana container is configured with Loki as its default datasource (see `grafana/provisioning/datasources/loki.yml`). Planned dashboards include:
  - **Traffic Dashboard:** Displaying request rates and active connections.
  - **Latency Dashboard:** Showing response time percentiles over time.
  - **Error Rate Dashboard:** Comparing successful versus failed requests.
  - **Resource Usage Dashboard:** Monitoring CPU, memory, and disk I/O.
  - **Log Explorer:** Enabling search by labels such as `service_name`, `env`, and `trace_id`.

---

Currently, the observability setup supports structured logging and basic health monitoring while planning to expand into detailed metrics and comprehensive dashboards.