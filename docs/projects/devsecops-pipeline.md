# DevSecOps Pipeline

**Status:** In Development | **Completion:** 25%

## Description
Security-first CI pipeline integrating SAST, DAST, and container scanning.

## Key Features
- SBOM generation
- Automated vulnerability scanning
- Policy enforcement gates

## Technologies
GitHub Actions, Trivy, SonarQube, OWASP ZAP

## README

## DevSecOps Pipeline

This project implements a security-focused CI/CD pipeline using GitHub Actions. The goal is to embed security into the development workflow, catching vulnerabilities early and automatically.

### Pipeline Stages
1.  **Static Analysis (SAST):** SonarQube scans the source code for bugs, code smells, and security hotspots on every commit.
2.  **Dependency Scanning:** Trivy scans third-party libraries for known CVEs.
3.  **Container Scanning:** After building the Docker image, Trivy scans it for OS-level vulnerabilities.
4.  **Dynamic Analysis (DAST):** For pull requests to `main`, a staging environment is spun up and OWASP ZAP runs a baseline scan against the live application.
5.  **Policy Enforcement:** The pipeline will fail if any scan detects critical or high-severity vulnerabilities, preventing insecure code from being merged.

## Architecture Decisions

### ADR-001: Selection of Integrated Scanning Tools

**Status:** Accepted

**Context:** To build a comprehensive DevSecOps pipeline, we need to select a suite of tools for Static Application Security Testing (SAST), Dynamic Application Security Testing (DAST), and Software Composition Analysis (SCA) / Container Scanning.

**Decision:** We will use a combination of **SonarQube for SAST**, **OWASP ZAP for DAST**, and **Trivy for SCA and container scanning**.

**Consequences:**
*   **Pros:** This combination provides broad coverage across different vulnerability types. All chosen tools are open-source leaders in their respective categories with strong community support and integration capabilities with GitHub Actions.
*   **Cons:** Requires managing the configuration and maintenance of three separate tools. There might be some overlap in vulnerability findings, requiring careful tuning of policies to avoid redundant alerts.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** A malicious actor spoofs the identity of a scanner (e.g., SonarQube) to report false results. **Mitigation:** Use webhooks with shared secrets for integrations. Run scanners on trusted, self-hosted runners where possible.
*   **Tampering:** An attacker modifies the scanner configuration to disable certain security checks. **Mitigation:** Store scanner configurations as code in the Git repository with branch protection rules. Regularly audit the configuration.
*   **Repudiation:** A developer denies that a vulnerability was present at the time of a scan. **Mitigation:** The CI/CD pipeline logs provide an immutable, timestamped record of every scan and its results for each commit.
*   **Information Disclosure:** Scan results, which may contain details about vulnerabilities, are exposed to unauthorized users. **Mitigation:** Restrict access to the CI/CD logs and the security dashboard (e.g., SonarQube UI) to authorized personnel.
*   **Denial of Service:** A DAST scan overloads and crashes the staging environment. **Mitigation:** Configure the DAST scanner to run with appropriate intensity levels. Run scans during off-peak hours if necessary.
*   **Elevation of Privilege:** A compromised scanner or a vulnerability in the pipeline itself gains elevated permissions. **Mitigation:** Run each stage of the CI/CD pipeline in a separate, isolated environment (e.g., container) with the minimum required permissions. Avoid using a single, overly permissive credential for the entire pipeline.

