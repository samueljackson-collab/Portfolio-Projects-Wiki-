# AWS Infrastructure Automation

**Status:** Production Ready | **Completion:** 100%

## Description
Production-ready AWS environment using Terraform, CDK, and Pulumi. Features Multi-AZ VPC, EKS cluster, and RDS PostgreSQL.

## Key Features
- Multi-AZ VPC architecture
- Managed EKS Cluster
- RDS PostgreSQL with backups
- Automated DR drills
- Cost estimation scripts

## Technologies
Terraform, AWS CDK, Pulumi, Python, Bash

## README

## AWS Infrastructure Automation

This project provides a comprehensive, production-ready AWS environment defined entirely as code. It demonstrates a multi-tool approach, leveraging Terraform for core networking, AWS CDK for stateful services like RDS, and Pulumi for the EKS cluster, showcasing how to integrate the best tool for each specific job.

### Architecture
- **VPC:** A highly-available, multi-AZ Virtual Private Cloud (VPC) with public and private subnets, NAT Gateways, and security groups.
- **Kubernetes:** A managed Amazon EKS cluster for container orchestration.
- **Database:** An Amazon RDS for PostgreSQL instance with automated backups, read replicas, and multi-AZ failover.

### Key Features
- **Immutable Infrastructure:** All infrastructure is managed through code, ensuring that the environment is reproducible and preventing manual configuration drift.
- **Cost Management:** Includes scripts to estimate costs based on the Terraform plan, allowing for budget control before deployment.

## Architecture Decisions

### ADR-001: Multi-Tool Approach for IaC

**Status:** Accepted

**Context:** We need to provision a complex AWS environment. While a single IaC tool could be used, different tools have different strengths. Terraform is excellent for core infrastructure, CDK offers programmatic power, and Pulumi provides great Kubernetes support.

**Decision:** We will use a **polyglot IaC approach**: **Terraform** for the foundational VPC and networking, **AWS CDK (Python)** for the RDS database, and **Pulumi (Python)** for the EKS cluster and its applications.

**Consequences:**
*   **Pros:** Allows us to use the best features of each tool for the specific component it's managing. For example, using Python in CDK/Pulumi for complex logic is easier than HCL. Terraform's stability is ideal for the core network.
*   **Cons:** Increased complexity in the toolchain. Requires developers to be familiar with multiple IaC tools. State management needs to be carefully handled between tools (e.g., passing the VPC ID from Terraform's state to the CDK/Pulumi applications).

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** An unauthorized user gains access to AWS credentials. **Mitigation:** Use short-lived credentials via IAM roles and OIDC for CI/CD. Enforce MFA for all human users.
*   **Tampering:** An attacker modifies the Terraform state file to alter infrastructure. **Mitigation:** Use a remote state backend (like S3) with versioning, locking, and strict IAM policies. Enable CloudTrail for all API actions.
*   **Repudiation:** An administrator denies making a destructive change. **Mitigation:** All infrastructure changes are tied to Git commits. Pull requests with required reviews provide a clear audit trail.
*   **Information Disclosure:** Secrets like database passwords are exposed in code or state files. **Mitigation:** Use a secrets management tool like AWS Secrets Manager. Reference secrets dynamically in the IaC code instead of hardcoding them.
*   **Denial of Service:** A misconfiguration consumes excessive resources, leading to a large bill. **Mitigation:** Use cost estimation tools in the CI pipeline. Implement AWS Budgets and billing alerts.
*   **Elevation of Privilege:** The CI/CD system's IAM role has excessive permissions. **Mitigation:** Apply the principle of least privilege. The CI/CD role should only have the permissions necessary to deploy the specific infrastructure it manages.

