# Secure-Deployer Public

**Status:** Production Ready | **Completion:** 100%

## Description
A hardened, containerized deployment runner for secure, automated bulk deployments across multiple environments using short-lived credentials.

## Key Features
- Short-lived credential injection
- Policy-as-Code for deployment rules (OPA)
- Real-time deployment logging
- Extensible plugin architecture
- Minimal attack surface

## Technologies
Go, Docker, Vault, gRPC, Prometheus

## README

## Secure-Deployer

This project is a hardened, security-first deployment runner designed for automated, bulk deployments. It operates on the principle of least privilege, fetching just-in-time, short-lived credentials for each specific task.

### Architecture
- **Runner:** A lightweight, containerized Go application with a minimal attack surface (distroless image).
- **Communication:** Uses gRPC with mutual TLS (mTLS) for secure, high-performance communication with an orchestrator.
- **Secrets Management:** Integrates directly with HashiCorp Vault to dynamically generate credentials for cloud providers, databases, etc.

### Key Features
- **Just-in-Time Credentials:** Eliminates the need for long-lived secrets in the CI/CD environment.
- **Policy Enforcement:** Uses Open Policy Agent (OPA) to enforce deployment rules before execution.
- **Isolated Execution:** Each deployment script runs in a separate, unprivileged container.

### Setup & Usage
1.  **Run Vault:** Start a Vault instance (dev mode for testing: `vault server -dev`).
2.  **Configure Runner:** Set environment variables to point to the Vault address and provide a valid Vault token.
3.  **Start Runner:** `docker run -e VAULT_ADDR='...' -e VAULT_TOKEN='...' secure-deployer:latest`
4.  **Trigger Deployment:** Send a gRPC request to the runner's endpoint with the deployment payload.

## Architecture Decisions

### ADR-001: Choice of Communication Protocol

**Status:** Accepted

**Context:** The deployer needs a secure, high-performance communication channel to receive tasks and stream logs. The main options are a traditional RESTful API over HTTP/2 or gRPC.

**Decision:** We will use **gRPC with mutual TLS (mTLS)** for all communication between the orchestrator and the runner.

**Consequences:**
*   **Pros:** gRPC is built on HTTP/2 and uses Protocol Buffers for efficient serialization, resulting in lower latency and smaller payloads. It provides native support for bi-directional streaming, which is ideal for real-time log streaming. Enforcing mTLS provides strong, built-in authentication and encryption.
*   **Cons:** Less human-readable than REST/JSON, requiring specific tooling (like `grpcurl`) for debugging. Firewall configuration can be more complex than standard HTTPS traffic.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** A malicious actor attempts to impersonate a legitimate deployment runner or orchestrator. **Mitigation:** Enforce mutual TLS (mTLS) for all gRPC communication. Each runner and orchestrator must have a unique, short-lived certificate signed by a private CA managed in Vault.
*   **Tampering:** An attacker modifies a deployment payload in transit. **Mitigation:** TLS encryption provided by gRPC protects data in transit. Payloads can also be signed by the orchestrator and verified by the runner.
*   **Repudiation:** Inability to prove a specific deployment was requested or executed. **Mitigation:** All deployment requests are logged with cryptographic signatures. The runner streams back signed log entries, creating an auditable trail in a central logging system.
*   **Information Disclosure:** A compromised runner exposes secrets or deployment artifacts. **Mitigation:** The runner fetches only short-lived, just-in-time credentials from Vault scoped to the specific deployment task. The runner's environment is a minimal, distroless container with no shell or unnecessary tools.
*   **Denial of Service:** A flood of deployment requests overwhelms the runner fleet. **Mitigation:** Implement rate limiting on the orchestrator. Runners are deployed in an auto-scaling group to handle load, with circuit breakers to prevent cascading failures.
*   **Elevation of Privilege:** A vulnerability in a deployment script allows it to access the host system or other deployments. **Mitigation:** Deployments are executed in isolated, unprivileged Docker containers with strict seccomp profiles and no host volume mounts. The runner itself runs as a non-root user.

