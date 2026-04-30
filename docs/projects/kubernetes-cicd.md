# Kubernetes CI/CD Pipeline

**Status:** Production Ready | **Completion:** 100%

## Description
GitOps-driven continuous delivery pipeline combining GitHub Actions and ArgoCD for progressive deployment.

## Key Features
- Blue-Green/Canary deployments
- Automated rollback on health failure
- Multi-environment support
- Container security scanning

## Technologies
GitHub Actions, ArgoCD, Helm, Kustomize, Python

## README

## GitOps CI/CD Pipeline for Kubernetes

This project implements a modern, GitOps-driven CI/CD pipeline for deploying applications to Kubernetes. It uses GitHub Actions for the CI part (building, testing, scanning) and ArgoCD for the CD part (continuous delivery).

### CI/CD Workflow
1.  **Commit & Push:** A developer pushes code to a feature branch and opens a pull request.
2.  **Continuous Integration (GitHub Actions):**
    *   The code is automatically built into a Docker image.
    *   Unit tests and security scans (e.g., Trivy) are run against the code and image.
    *   If all checks pass, the image is pushed to a container registry.
3.  **Continuous Delivery (ArgoCD):**
    *   Upon merging to `main`, the CI pipeline updates a Kubernetes manifest in a separate Git repository (the 'config repo'), pointing to the new image tag.
    *   ArgoCD, running in the Kubernetes cluster, detects the change in the config repo.
    *   ArgoCD automatically syncs the application, pulling the new image and applying the manifest changes to the cluster, often using a progressive strategy like a canary release.

### Key Features
- **Single Source of Truth:** The Git config repository holds the declarative definition of the desired production state.
- **Automated Rollback:** ArgoCD monitors the health of the new deployment and can automatically roll back to the previous stable version if it detects issues.

## Architecture Decisions

### ADR-001: Adopting GitOps with ArgoCD

**Status:** Accepted

**Context:** We need a reliable and auditable way to manage Kubernetes deployments. Traditional push-based CI/CD scripts can be complex and opaque.

**Decision:** We will adopt the **GitOps methodology using ArgoCD**. The Git repository will be the single source of truth for our desired application state. ArgoCD's controller will run in the cluster and reconcile the live state with the state defined in Git.

**Consequences:**
*   **Pros:** Improved security (no cluster credentials in CI), enhanced auditability (all changes are Git commits), automated drift detection and correction.
*   **Cons:** Requires a cultural shift to a Git-centric workflow. Initial setup of ArgoCD and repository structure requires careful planning.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** A malicious user impersonates a legitimate developer to commit malicious code. **Mitigation:** Enforce signed commits and branch protection rules in GitHub.
*   **Tampering:** The container image is tampered with in the registry. **Mitigation:** Use image signing (e.g., Cosign) and enforce a policy in the cluster to only run signed images.
*   **Repudiation:** A developer denies making a breaking change. **Mitigation:** Git history provides a clear, immutable audit trail of all changes.
*   **Information Disclosure:** Secrets are accidentally committed to the Git repository. **Mitigation:** Use secret scanning tools (e.g., Git-secrets, TruffleHog) in pre-commit hooks and CI. Store secrets externally using a tool like Sealed Secrets or Vault.
*   **Denial of Service:** A malicious manifest consumes all cluster resources. **Mitigation:** Use Kubernetes ResourceQuotas and LimitRanges. Scan manifests with tools like Kube-score in the CI pipeline.
*   **Elevation of Privilege:** The ArgoCD service account has excessive permissions. **Mitigation:** Follow the principle of least privilege. Scope ArgoCD's permissions to only the namespaces it needs to manage.

