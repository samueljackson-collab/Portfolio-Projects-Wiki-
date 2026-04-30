# Real-time Data Streaming

**Status:** Production Ready | **Completion:** 100%

## Description
High-throughput event streaming pipeline using Apache Kafka and Flink with exactly-once semantics.

## Key Features
- Exactly-once processing
- Schema Registry integration
- Flink SQL analytics
- RocksDB state backend

## Technologies
Apache Kafka, Apache Flink, Python, Avro, Docker

## README

## Real-time Data Streaming with Kafka and Flink

This project demonstrates a high-throughput, fault-tolerant data streaming pipeline. It uses Apache Kafka as the durable event bus and Apache Flink for stateful stream processing, configured to provide exactly-once processing guarantees.

### Core Features
- **Exactly-Once Semantics:** End-to-end guarantees using Flink's two-phase commit sink and Kafka's idempotent producers.
- **Schema Management:** Confluent Schema Registry is used with Avro to ensure data quality and schema evolution.
- **Stateful Analytics:** Flink jobs perform time-windowed aggregations using RocksDB as a durable state backend.

## Architecture Decisions

### ADR-001: Choice of Stream Processor

**Status:** Accepted

**Context:** We need a stream processing engine capable of stateful computations and providing exactly-once semantics. The main contenders are Apache Flink and Spark Streaming.

**Decision:** We chose **Apache Flink**.

**Consequences:**
*   **Pros:** Flink provides a true streaming, event-at-a-time processing model, which results in lower latency. Its handling of state and event time is more mature and robust for complex scenarios. Excellent support for exactly-once sinks.
*   **Cons:** Spark has a larger community and better integration in some ecosystems. The learning curve for Flink's DataStream API can be steeper than Spark's micro-batching model.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** Unauthorized producer sends malicious data to a Kafka topic. **Mitigation:** Enforce authentication on Kafka brokers and topics.
*   **Tampering:** Data is altered in-flight. **Mitigation:** Use TLS for all network connections (Kafka, Flink, Schema Registry).
*   **Repudiation:** A producer denies sending a specific event. **Mitigation:** Kafka's immutable log serves as an audit trail. All events can be traced.
*   **Information Disclosure:** Sensitive information is exposed in a data stream. **Mitigation:** Implement data masking or encryption within the Flink job before writing to a sink. Use a Schema Registry to define which fields contain PII.
*   **Denial of Service:** A 'poison pill' message crashes the Flink job repeatedly. **Mitigation:** Implement robust error handling and dead-letter queues within the Flink application to isolate problematic messages.
*   **Elevation of Privilege:** The Flink job manager has excessive permissions to external systems (e.g., databases). **Mitigation:** The Flink job's credentials should be scoped to have only the necessary read/write permissions.

