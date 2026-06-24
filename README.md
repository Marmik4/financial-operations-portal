# Enterprise Workflow & Settlement Platform

A distributed, event-driven microservices architecture built to simulate high-scale financial transaction processing. This platform decouples transaction state management from settlement execution using an event broker, while optimizing read performance with a distributed cache.

## 🏗️ Architecture Overview

This project implements a multi-service architecture mirroring real-world enterprise financial systems:
* **Workflow Service:** Handles client-facing REST APIs, manages transaction state (`PENDING_REVIEW` -> `APPROVED`), and acts as a Kafka Producer.
* **Settlement Service:** An autonomous, decoupled Kafka Consumer that listens for approval events and simulates backend fund transfers.
* **Message Broker (Kafka):** Ensures reliable, asynchronous communication between services.
* **Distributed Cache (Redis):** Caches high-volume read queries (e.g., dashboard transaction lists) to reduce database load.
* **Frontend Portal:** An Angular Material dashboard for real-time transaction management.

## 🛠️ Tech Stack

**Backend:**
* Java 17 / Spring Boot 3.x
* Spring Data JPA & Hibernate
* Spring Kafka
* Spring Data Redis

**Frontend:**
* Angular 17+
* Angular Material (UI Components)
* RxJS (State Management & Observables)

**Infrastructure (Dockerized):**
* PostgreSQL 15 (Persistent Storage via Docker Volumes)
* Apache Kafka & Zookeeper (Event Streaming)
* Redis (In-Memory Caching)

## 🚀 Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) running on your machine.
* Java 17+ and Maven.
* Node.js and Angular CLI (`npm install -g @angular/cli`).

### 1. Boot the Infrastructure
Start the database, message broker, and cache using Docker Compose:
```bash
docker-compose up -d
```
*(Note: A Docker volume `pgdata` is configured to persist database records across container restarts).*

### 2. Start the Microservices
The backend services are configured to use dynamic ports (`server.port=0`) to avoid local port collisions, simulating a Service Discovery environment.

**Terminal A - Workflow Service:**
```bash
cd workflow-service
./mvnw spring-boot:run
```
*Note the initialized Tomcat port in the console logs (e.g., `Tomcat started on port 12345`).*

**Terminal B - Settlement Service:**
```bash
cd settlement-service
./mvnw spring-boot:run
```

### 3. Start the Frontend Application
Update the Angular environment to point to the dynamically assigned Workflow Service port:
1. Open `financial-operations-portal/src/app/services/transaction.ts`.
2. Update the `apiUrl` to match the Workflow Service port from Step 2.

**Terminal C - Angular Portal:**
```bash
cd financial-operations-portal
ng serve --open
```

## 🧠 Key Technical Implementations

* **Idempotent Serialization:** Configured `GenericJackson2JsonRedisSerializer` with the `JavaTimeModule` to successfully serialize/deserialize Java 8 `LocalDateTime` objects across both Kafka topics and Redis memory.
* **Cache Eviction Strategies:** Implemented `@Cacheable` for standard database reads and `@CacheEvict(allEntries = true)` upon state mutations to prevent stale data delivery.
* **Fault Tolerance:** The decoupling of the Settlement Service ensures that the Workflow API remains highly available even if downstream settlement processes experience downtime.

## 🔮 Future Enhancements
* Implement a Dead Letter Queue (DLQ) in Kafka for failed settlement processing.
* Add Prometheus & Grafana for service observability.
* Implement Netflix Eureka for dynamic Service Discovery to replace manual port configuration.
