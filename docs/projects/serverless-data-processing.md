# Serverless Data Processing

**Status:** Production Ready | **Completion:** 100%

## Description
Event-driven analytics pipeline built on AWS serverless services (Lambda, Step Functions).

## Key Features
- Workflow orchestration
- API Gateway integration
- Cognito authentication
- Automated error handling

## Technologies
AWS SAM, Lambda, Step Functions, DynamoDB, Python

## README

## Serverless Data Processing Pipeline

This project implements an event-driven data processing workflow using AWS Serverless services. The entire infrastructure is defined using the AWS Serverless Application Model (SAM).

### Architecture
1.  **Ingestion:** An API Gateway endpoint receives incoming data and triggers a Lambda function.
2.  **Orchestration:** A Step Functions state machine orchestrates a multi-step workflow (e.g., validation, enrichment, storage).
3.  **Compute:** Multiple Lambda functions, each responsible for a single task, are used for processing.
4.  **Storage:** DynamoDB is used for storing the processed data.

This architecture is highly scalable, resilient, and cost-effective as you only pay for the compute time you consume.

## Architecture Decisions

### ADR-001: Orchestration with Step Functions vs. Lambda Chaining

**Status:** Accepted

**Context:** Our workflow involves multiple sequential and parallel steps. We could orchestrate this by having Lambda functions call each other directly (chaining) or by using a dedicated orchestration service like AWS Step Functions.

**Decision:** We will use **AWS Step Functions** to orchestrate the workflow.

**Consequences:**
*   **Pros:** Provides excellent visibility, error handling, and retry logic out-of-the-box. Decouples the functions, making the workflow easier to understand and modify. State management is handled by the service.
*   **Cons:** Higher cost per execution than direct Lambda invokes. Can have limits on payload size between steps.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** An unauthenticated user invokes the API Gateway endpoint. **Mitigation:** Use AWS IAM or Cognito Authorizers on API Gateway to enforce authentication.
*   **Tampering:** Data is modified between Lambda function calls. **Mitigation:** This is less of a risk as the calls happen within the AWS backbone, but passing signed payloads or using Step Functions (which is a trusted orchestrator) mitigates this.
*   **Repudiation:** An action cannot be audited. **Mitigation:** Enable CloudTrail for all API calls. Log every step of the Step Functions execution.
*   **Information Disclosure:** A Lambda function's logs contain sensitive data. **Mitigation:** Sanitize logs and avoid logging PII. Use AWS Secrets Manager for credentials instead of environment variables.
*   **Denial of Service:** A spike in traffic leads to massive Lambda concurrency, overwhelming a downstream database. **Mitigation:** Configure reserved concurrency on the Lambda function to act as a circuit breaker.
*   **Elevation of Privilege:** A Lambda function has overly permissive IAM roles (`*:*`). **Mitigation:** Apply the principle of least privilege. Each function should have a narrowly scoped IAM role that only allows it to access the resources it needs.

