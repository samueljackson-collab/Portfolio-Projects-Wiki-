# Database Migration Platform

**Status:** Production Ready | **Completion:** 100%

## Description
Zero-downtime database migration orchestrator using Change Data Capture (CDC) with Debezium and AWS DMS.

## Key Features
- Zero-downtime cutover
- Data integrity validation
- Automated rollback
- Real-time replication monitoring

## Technologies
Python, Debezium, Kafka, PostgreSQL, Docker

## README

## Zero-Downtime Database Migration Platform

This project orchestrates complex database migrations with zero downtime by using Change Data Capture (CDC). It captures row-level changes from a source database in real-time, streams them into a message queue, and applies them to a target database, ensuring both systems are in sync.

### Migration Workflow
1.  **Initial Snapshot:** A consistent snapshot of the source database is taken and loaded into the target.
2.  **CDC Streaming:** Debezium captures all subsequent `INSERT`, `UPDATE`, and `DELETE` operations from the database's transaction log and streams them to a Kafka topic.
3.  **Consumer Application:** A Python consumer reads the change events from Kafka and applies them to the target database in the correct order.
4.  **Cutover:** Once the replication lag is near zero, traffic is switched to the new database.

### Key Features
- **Data Integrity:** Scripts are included to perform hash-based validation of data between the source and target to ensure consistency.
- **Automated Rollback:** The platform includes procedures to reverse the migration process if issues are detected.

## Architecture Decisions

### ADR-001: Choice of CDC Technology

**Status:** Accepted

**Context:** We need to capture database changes in real-time for zero-downtime migration. The primary options are building a custom solution, using a managed service like AWS DMS, or an open-source platform like Debezium.

**Decision:** We decided to use **Debezium with Kafka Connect**. 

**Consequences:**
*   **Pros:** Vendor-neutral, highly configurable, excellent integration with Kafka, provides rich metadata about changes.
*   **Cons:** Requires self-hosting and managing a Kafka Connect cluster, which adds operational overhead compared to AWS DMS.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** An unauthorized service connects to the Kafka topic. **Mitigation:** Use SASL/SCRAM authentication on Kafka brokers and connectors.
*   **Tampering:** An attacker modifies CDC events in transit. **Mitigation:** Use TLS encryption for all communication between the database, Kafka Connect, and Kafka brokers.
*   **Repudiation:** Inability to prove a migration event occurred. **Mitigation:** Kafka's immutable log provides an audit trail. All schema changes and administrative actions are logged.
*   **Information Disclosure:** Sensitive data is exposed in CDC events. **Mitigation:** Use field-level transformations in Debezium to mask or encrypt sensitive PII data before it's published to Kafka.
*   **Denial of Service:** The source database is overloaded by the replication process. **Mitigation:** Monitor replication lag and database load closely. Use resource limits on Kafka Connect tasks.
*   **Elevation of Privilege:** The replication user has excessive permissions. **Mitigation:** Apply the principle of least privilege. The replication database user should only have the minimum permissions required for CDC.

