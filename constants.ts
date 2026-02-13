
import type { Project, TechnologyDeepDive, ProblemContext, ArchitectureDefinition, TechnologyMetadata } from './types';

export const PROJECTS_DATA: Project[] = [
    { "id": 1, "name": "AWS Infrastructure Automation", "slug": "aws-infrastructure-automation", "description": "Production-ready AWS environment using Terraform, CDK, and Pulumi. Features Multi-AZ VPC, EKS cluster, and RDS PostgreSQL.", "status": "Production Ready", "completion_percentage": 100, "tags": ["aws", "terraform", "infrastructure", "eks", "rds"], "github_path": "projects/1-aws-infrastructure-automation", "technologies": ["Terraform", "AWS CDK", "Pulumi", "Python", "Bash"], "features": ["Multi-AZ VPC architecture", "Managed EKS Cluster", "RDS PostgreSQL with backups", "Automated DR drills", "Cost estimation scripts"], "key_takeaways": ["Immutable infrastructure prevents configuration drift and enhances reliability.", "A multi-tool approach (Terraform, CDK) allows leveraging the best tool for each specific task.", "Automated state management with remote backends is critical for team collaboration."] },
    { "id": 2, "name": "Database Migration Platform", "slug": "database-migration-platform", "description": "Zero-downtime database migration orchestrator using Change Data Capture (CDC) with Debezium and AWS DMS.", "status": "Production Ready", "completion_percentage": 100, "tags": ["database", "migration", "aws-dms", "python", "kafka"], "github_path": "projects/2-database-migration", "technologies": ["Python", "Debezium", "Kafka", "PostgreSQL", "Docker"], "features": ["Zero-downtime cutover", "Data integrity validation", "Automated rollback", "Real-time replication monitoring"], "key_takeaways": ["CDC is a powerful technique for achieving zero-downtime migrations.", "Data validation and automated rollback are non-negotiable for critical data migrations.", "Kafka provides a durable, replayable buffer that decouples the source and target systems."], "adr": "### ADR-001: Choice of CDC Technology\n\n**Status:** Accepted\n\n**Context:** We need to capture database changes in real-time for zero-downtime migration. The primary options are building a custom solution, using a managed service like AWS DMS, or an open-source platform like Debezium.\n\n**Decision:** We decided to use **Debezium with Kafka Connect**. \n\n**Consequences:**\n*   **Pros:** Vendor-neutral, highly configurable, excellent integration with Kafka, provides rich metadata about changes.\n*   **Cons:** Requires self-hosting and managing a Kafka Connect cluster, which adds operational overhead compared to AWS DMS.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** An unauthorized service connects to the Kafka topic. **Mitigation:** Use SASL/SCRAM authentication on Kafka brokers and connectors.\n*   **Tampering:** An attacker modifies CDC events in transit. **Mitigation:** Use TLS encryption for all communication between the database, Kafka Connect, and Kafka brokers.\n*   **Repudiation:** Inability to prove a migration event occurred. **Mitigation:** Kafka's immutable log provides an audit trail. All schema changes and administrative actions are logged.\n*   **Information Disclosure:** Sensitive data is exposed in CDC events. **Mitigation:** Use field-level transformations in Debezium to mask or encrypt sensitive PII data before it's published to Kafka.\n*   **Denial of Service:** The source database is overloaded by the replication process. **Mitigation:** Monitor replication lag and database load closely. Use resource limits on Kafka Connect tasks.\n*   **Elevation of Privilege:** The replication user has excessive permissions. **Mitigation:** Apply the principle of least privilege. The replication database user should only have the minimum permissions required for CDC." },
    { "id": 3, "name": "Kubernetes CI/CD Pipeline", "slug": "kubernetes-cicd", "description": "GitOps-driven continuous delivery pipeline combining GitHub Actions and ArgoCD for progressive deployment.", "status": "Production Ready", "completion_percentage": 100, "tags": ["kubernetes", "ci-cd", "argocd", "github-actions"], "github_path": "projects/3-kubernetes-cicd", "technologies": ["GitHub Actions", "ArgoCD", "Helm", "Kustomize", "Python"], "features": ["Blue-Green/Canary deployments", "Automated rollback on health failure", "Multi-environment support", "Container security scanning"], "key_takeaways": ["GitOps provides an auditable and reliable deployment pipeline.", "Progressive delivery strategies (like canary releases) significantly reduce the risk of production failures.", "Separating application code from deployment configuration is a key best practice."], "adr": "### ADR-001: Adopting GitOps with ArgoCD\n\n**Status:** Accepted\n\n**Context:** We need a reliable and auditable way to manage Kubernetes deployments. Traditional push-based CI/CD scripts can be complex and opaque.\n\n**Decision:** We will adopt the **GitOps methodology using ArgoCD**. The Git repository will be the single source of truth for our desired application state. ArgoCD's controller will run in the cluster and reconcile the live state with the state defined in Git.\n\n**Consequences:**\n*   **Pros:** Improved security (no cluster credentials in CI), enhanced auditability (all changes are Git commits), automated drift detection and correction.\n*   **Cons:** Requires a cultural shift to a Git-centric workflow. Initial setup of ArgoCD and repository structure requires careful planning.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** A malicious user impersonates a legitimate developer to commit malicious code. **Mitigation:** Enforce signed commits and branch protection rules in GitHub.\n*   **Tampering:** The container image is tampered with in the registry. **Mitigation:** Use image signing (e.g., Cosign) and enforce a policy in the cluster to only run signed images.\n*   **Repudiation:** A developer denies making a breaking change. **Mitigation:** Git history provides a clear, immutable audit trail of all changes.\n*   **Information Disclosure:** Secrets are accidentally committed to the Git repository. **Mitigation:** Use secret scanning tools (e.g., Git-secrets, TruffleHog) in pre-commit hooks and CI. Store secrets externally using a tool like Sealed Secrets or Vault.\n*   **Denial of Service:** A malicious manifest consumes all cluster resources. **Mitigation:** Use Kubernetes ResourceQuotas and LimitRanges. Scan manifests with tools like Kube-score in the CI pipeline.\n*   **Elevation of Privilege:** The ArgoCD service account has excessive permissions. **Mitigation:** Follow the principle of least privilege. Scope ArgoCD's permissions to only the namespaces it needs to manage." },
    { "id": 4, "name": "DevSecOps Pipeline", "slug": "devsecops-pipeline", "description": "Security-first CI pipeline integrating SAST, DAST, and container scanning.", "status": "In Development", "completion_percentage": 25, "tags": ["security", "devops", "ci-cd", "sast", "dast"], "github_path": "projects/4-devsecops", "technologies": ["GitHub Actions", "Trivy", "SonarQube", "OWASP ZAP"], "features": ["SBOM generation", "Automated vulnerability scanning", "Policy enforcement gates"], "key_takeaways": ["'Shifting left'—integrating security early in the CI/CD pipeline—is more effective and cheaper than finding issues in production.", "A combination of SAST, DAST, and dependency scanning provides comprehensive coverage.", "Automated security gates in CI/CD are crucial for enforcing security policies."], "readme": "## DevSecOps Pipeline\n\nThis project implements a security-focused CI/CD pipeline using GitHub Actions. The goal is to embed security into the development workflow, catching vulnerabilities early and automatically.\n\n### Pipeline Stages\n1.  **Static Analysis (SAST):** SonarQube scans the source code for bugs, code smells, and security hotspots on every commit.\n2.  **Dependency Scanning:** Trivy scans third-party libraries for known CVEs.\n3.  **Container Scanning:** After building the Docker image, Trivy scans it for OS-level vulnerabilities.\n4.  **Dynamic Analysis (DAST):** For pull requests to `main`, a staging environment is spun up and OWASP ZAP runs a baseline scan against the live application.\n5.  **Policy Enforcement:** The pipeline will fail if any scan detects critical or high-severity vulnerabilities, preventing insecure code from being merged." },
    { "id": 5, "name": "Real-time Data Streaming", "slug": "real-time-data-streaming", "description": "High-throughput event streaming pipeline using Apache Kafka and Flink with exactly-once semantics.", "status": "Production Ready", "completion_percentage": 100, "tags": ["kafka", "flink", "streaming", "python", "docker"], "github_path": "projects/5-real-time-data-streaming", "technologies": ["Apache Kafka", "Apache Flink", "Python", "Avro", "Docker"], "features": ["Exactly-once processing", "Schema Registry integration", "Flink SQL analytics", "RocksDB state backend"], "key_takeaways": ["Exactly-once semantics are achievable but require careful configuration of the entire pipeline.", "A schema registry is essential for evolving data schemas in a streaming environment without breaking consumers.", "Stateful stream processing with Flink enables complex analytics that are not possible with stateless processors."], "readme": "## Real-time Data Streaming with Kafka and Flink\n\nThis project demonstrates a high-throughput, fault-tolerant data streaming pipeline. It uses Apache Kafka as the durable event bus and Apache Flink for stateful stream processing, configured to provide exactly-once processing guarantees.\n\n### Core Features\n- **Exactly-Once Semantics:** End-to-end guarantees using Flink's two-phase commit sink and Kafka's idempotent producers.\n- **Schema Management:** Confluent Schema Registry is used with Avro to ensure data quality and schema evolution.\n- **Stateful Analytics:** Flink jobs perform time-windowed aggregations using RocksDB as a durable state backend.", "adr": "### ADR-001: Choice of Stream Processor\n\n**Status:** Accepted\n\n**Context:** We need a stream processing engine capable of stateful computations and providing exactly-once semantics. The main contenders are Apache Flink and Spark Streaming.\n\n**Decision:** We chose **Apache Flink**.\n\n**Consequences:**\n*   **Pros:** Flink provides a true streaming, event-at-a-time processing model, which results in lower latency. Its handling of state and event time is more mature and robust for complex scenarios. Excellent support for exactly-once sinks.\n*   **Cons:** Spark has a larger community and better integration in some ecosystems. The learning curve for Flink's DataStream API can be steeper than Spark's micro-batching model.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** Unauthorized producer sends malicious data to a Kafka topic. **Mitigation:** Enforce authentication on Kafka brokers and topics.\n*   **Tampering:** Data is altered in-flight. **Mitigation:** Use TLS for all network connections (Kafka, Flink, Schema Registry).\n*   **Repudiation:** A producer denies sending a specific event. **Mitigation:** Kafka's immutable log serves as an audit trail. All events can be traced.\n*   **Information Disclosure:** Sensitive information is exposed in a data stream. **Mitigation:** Implement data masking or encryption within the Flink job before writing to a sink. Use a Schema Registry to define which fields contain PII.\n*   **Denial of Service:** A 'poison pill' message crashes the Flink job repeatedly. **Mitigation:** Implement robust error handling and dead-letter queues within the Flink application to isolate problematic messages.\n*   **Elevation of Privilege:** The Flink job manager has excessive permissions to external systems (e.g., databases). **Mitigation:** The Flink job's credentials should be scoped to have only the necessary read/write permissions." },
    { "id": 6, "name": "MLOps Platform", "slug": "mlops-platform", "description": "End-to-end MLOps workflow for training, evaluating, and deploying models with drift detection.", "status": "Production Ready", "completion_percentage": 100, "tags": ["mlops", "machine-learning", "python", "mlflow", "kubernetes"], "github_path": "projects/6-mlops-platform", "technologies": ["MLflow", "Optuna", "FastAPI", "Scikit-learn", "Kubernetes"], "features": ["Automated training pipeline", "A/B testing framework", "Model drift detection", "Model serving API"], "key_takeaways": ["Reproducibility is the cornerstone of MLOps; track code, data, and parameters for every experiment.", "Model monitoring for drift is as important as the initial training.", "Separating model training from model serving allows each to be scaled and managed independently."], "cicdWorkflow": { "name": "e2e-tests.yml", "path": ".github/workflows/e2e-tests.yml", "content": "name: End-to-End Tests\n\non:\n  push:\n    branches: [ main ]\n  pull_request:\n\njobs:\n  playwright-tests:\n    name: 'Run Playwright Tests'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v4\n        with:\n          python-version: '3.11'\n\n      - name: Install dependencies\n        run: |\n          python -m pip install --upgrade pip\n          pip install -r requirements.txt\n          pip install playwright\n          playwright install --with-deps\n\n      - name: Run Playwright tests\n        run: pytest tests/e2e/\n\n      - name: Upload test report\n        if: always()\n        uses: actions/upload-artifact@v4\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 7\n" } },
    { "id": 7, "name": "Serverless Data Processing", "slug": "serverless-data-processing", "description": "Event-driven analytics pipeline built on AWS serverless services (Lambda, Step Functions).", "status": "Production Ready", "completion_percentage": 100, "tags": ["serverless", "aws-lambda", "data-engineering", "step-functions"], "github_path": "projects/7-serverless-data-processing", "technologies": ["AWS SAM", "Lambda", "Step Functions", "DynamoDB", "Python"], "features": ["Workflow orchestration", "API Gateway integration", "Cognito authentication", "Automated error handling"], "key_takeaways": ["Serverless is ideal for event-driven, spiky workloads, offering significant cost savings over provisioned resources.", "AWS Step Functions are powerful for orchestrating complex workflows with multiple Lambda functions.", "Proper error handling and dead-letter queues are critical for building resilient serverless applications."], "readme": "## Serverless Data Processing Pipeline\n\nThis project implements an event-driven data processing workflow using AWS Serverless services. The entire infrastructure is defined using the AWS Serverless Application Model (SAM).\n\n### Architecture\n1.  **Ingestion:** An API Gateway endpoint receives incoming data and triggers a Lambda function.\n2.  **Orchestration:** A Step Functions state machine orchestrates a multi-step workflow (e.g., validation, enrichment, storage).\n3.  **Compute:** Multiple Lambda functions, each responsible for a single task, are used for processing.\n4.  **Storage:** DynamoDB is used for storing the processed data.\n\nThis architecture is highly scalable, resilient, and cost-effective as you only pay for the compute time you consume.", "adr": "### ADR-001: Orchestration with Step Functions vs. Lambda Chaining\n\n**Status:** Accepted\n\n**Context:** Our workflow involves multiple sequential and parallel steps. We could orchestrate this by having Lambda functions call each other directly (chaining) or by using a dedicated orchestration service like AWS Step Functions.\n\n**Decision:** We will use **AWS Step Functions** to orchestrate the workflow.\n\n**Consequences:**\n*   **Pros:** Provides excellent visibility, error handling, and retry logic out-of-the-box. Decouples the functions, making the workflow easier to understand and modify. State management is handled by the service.\n*   **Cons:** Higher cost per execution than direct Lambda invokes. Can have limits on payload size between steps.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** An unauthenticated user invokes the API Gateway endpoint. **Mitigation:** Use AWS IAM or Cognito Authorizers on API Gateway to enforce authentication.\n*   **Tampering:** Data is modified between Lambda function calls. **Mitigation:** This is less of a risk as the calls happen within the AWS backbone, but passing signed payloads or using Step Functions (which is a trusted orchestrator) mitigates this.\n*   **Repudiation:** An action cannot be audited. **Mitigation:** Enable CloudTrail for all API calls. Log every step of the Step Functions execution.\n*   **Information Disclosure:** A Lambda function's logs contain sensitive data. **Mitigation:** Sanitize logs and avoid logging PII. Use AWS Secrets Manager for credentials instead of environment variables.\n*   **Denial of Service:** A spike in traffic leads to massive Lambda concurrency, overwhelming a downstream database. **Mitigation:** Configure reserved concurrency on the Lambda function to act as a circuit breaker.\n*   **Elevation of Privilege:** A Lambda function has overly permissive IAM roles (`*:*`). **Mitigation:** Apply the principle of least privilege. Each function should have a narrowly scoped IAM role that only allows it to access the resources it needs." },
    { "id": 8, "name": "Advanced AI Chatbot", "slug": "advanced-ai-chatbot", "description": "RAG chatbot indexing portfolio assets with tool-augmented workflows.", "status": "Substantial", "completion_percentage": 55, "tags": ["ai", "chatbot", "llm", "rag", "fastapi"], "github_path": "projects/8-advanced-ai-chatbot", "technologies": ["Python", "FastAPI", "LangChain", "Vector DB"], "features": ["Retrieval-Augmented Generation", "WebSocket streaming", "Context awareness"], "key_takeaways": ["Retrieval-Augmented Generation (RAG) is a powerful pattern to ground LLMs in factual, up-to-date information.", "The quality of the data in the vector database is the single most important factor for RAG performance.", "Tool augmentation allows LLMs to interact with external systems, dramatically expanding their capabilities."], "readme": "## Advanced AI Chatbot with RAG\n\nThis project builds an AI chatbot that uses Retrieval-Augmented Generation (RAG) to provide answers based on a private knowledge base (in this case, the project portfolio data).\n\n### How it Works\n1.  **Indexing:** All project documentation is chunked, converted to vector embeddings, and stored in a Vector Database.\n2.  **Retrieval:** When a user asks a question, the question is embedded and used to perform a similarity search in the vector DB to find the most relevant document chunks.\n3.  **Augmentation:** The retrieved chunks are added to the prompt as context for the Large Language Model (LLM).\n4.  **Generation:** The LLM generates an answer based on the provided context, ensuring the response is grounded in facts from the knowledge base.", "adr": "### ADR-001: Choice of Vector Database\n\n**Status:** Accepted\n\n**Context:** The RAG system requires a vector database to store and efficiently query document embeddings. Options include managed services, self-hosted open-source databases, and in-memory libraries.\n\n**Decision:** We will start with an in-memory library like **FAISS** for its simplicity and performance in a single-node setup. This allows for rapid prototyping.\n\n**Consequences:**\n*   **Pros:** Extremely fast, no operational overhead, easy to integrate into a Python application.\n*   **Cons:** Does not scale beyond the memory of a single machine. Not suitable for very large datasets or production use cases requiring high availability. We will plan to migrate to a scalable solution like Pinecone or a self-hosted ChromaDB as the project matures.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** A user impersonates another to access their chat history. **Mitigation:** Implement standard user authentication and authorization.\n*   **Tampering:** An attacker modifies the documents in the vector database to poison the RAG context. **Mitigation:** Secure the indexing pipeline and database with strict access controls. Perform regular data integrity checks.\n*   **Repudiation:** A user denies sending a harmful prompt. **Mitigation:** Log all user prompts and LLM responses for auditing.\n*   **Information Disclosure:** The LLM reveals sensitive information from the source documents that the user should not have access to. **Mitigation:** Implement access controls on the document retrieval step. Ensure the retriever only returns documents the user is authorized to see.\n*   **Denial of Service:** Users submit complex queries that cause excessive computational load on the LLM or vector DB. **Mitigation:** Implement rate limiting and query complexity analysis.\n*   **Elevation of Privilege:** A user crafts a prompt (prompt injection) that tricks the LLM into using a tool to perform an unauthorized action. **Mitigation:** Carefully validate all inputs passed to tools. Use a sandboxed environment for tool execution. Fine-tune the LLM to be robust against injection attacks." },
    { "id": 9, "name": "Multi-Region Disaster Recovery", "slug": "multi-region-disaster-recovery", "description": "Resilient architecture with automated failover between AWS regions.", "status": "Production Ready", "completion_percentage": 100, "tags": ["aws", "dr", "reliability", "terraform", "automation"], "github_path": "projects/9-multi-region-disaster-recovery", "technologies": ["Terraform", "AWS Route53", "AWS RDS Global", "Python"], "features": ["Automated failover scripts", "Backup verification", "Cross-region replication", "RTO/RPO validation"], "key_takeaways": ["Disaster recovery must be automated and regularly tested to be effective.", "A multi-region active-passive strategy provides a good balance of cost and resilience.", "Data replication strategy (e.g., synchronous vs. asynchronous) is the key driver of RPO."] },
    { "id": 10, "name": "Blockchain Smart Contract Platform", "slug": "blockchain-smart-contract-platform", "description": "DeFi protocol with modular smart contracts for staking and governance.", "status": "Advanced", "completion_percentage": 70, "tags": ["blockchain", "solidity", "smart-contracts", "web3"], "github_path": "projects/10-blockchain-smart-contract-platform", "technologies": ["Solidity", "Hardhat", "TypeScript", "Ethers.js"], "features": ["Staking logic", "Governance tokens", "Automated testing", "Security analysis"], "key_takeaways": ["Smart contract security is paramount; small bugs can lead to catastrophic financial loss.", "Upgradeable proxy patterns are essential for fixing bugs and evolving contracts after deployment.", "Thorough automated testing and third-party audits are non-negotiable."] },
    { "id": 11, "name": "IoT Data Analytics", "slug": "iot-data-analytics", "description": "Edge-to-cloud ingestion stack with MQTT telemetry and anomaly detection.", "status": "Production Ready", "completion_percentage": 100, "tags": ["iot", "analytics", "timescaledb", "mqtt", "machine-learning"], "github_path": "projects/11-iot-data-analytics", "technologies": ["AWS IoT Core", "Python", "TimescaleDB", "MQTT", "Scikit-learn"], "features": ["Device provisioning automation", "ML-based anomaly detection", "Real-time telemetry", "Infrastructure as Code"], "key_takeaways": ["MQTT is the standard for IoT messaging due to its lightweight nature and reliability on constrained networks.", "Time-series databases are purpose-built for handling the high-volume, time-ordered nature of IoT data.", "Edge processing can reduce bandwidth costs and enable faster, localized responses."] },
    { "id": 12, "name": "Quantum Computing Integration", "slug": "quantum-computing-integration", "description": "Hybrid quantum-classical workloads using Qiskit.", "status": "Substantial", "completion_percentage": 50, "tags": ["quantum-computing", "qiskit", "research", "python"], "github_path": "projects/12-quantum-computing", "technologies": ["Qiskit", "Python", "AWS Batch"], "features": ["Variational Quantum Eigensolver", "Hybrid workflow orchestration"], "key_takeaways": ["Current quantum computers are noisy and limited (NISQ era), making hybrid quantum-classical algorithms the most practical approach.", "Effective quantum algorithms require a deep understanding of both quantum mechanics and the specific problem domain.", "Simulators are essential for developing and testing quantum algorithms before running on expensive hardware."] },
    { "id": 13, "name": "Advanced Cybersecurity Platform", "slug": "advanced-cybersecurity-platform", "description": "SOAR engine consolidating SIEM alerts with automated playbooks.", "status": "Substantial", "completion_percentage": 45, "tags": ["cybersecurity", "soc", "siem", "soar", "python"], "github_path": "projects/13-advanced-cybersecurity", "technologies": ["Python", "ELK Stack", "VirusTotal API"], "features": ["Alert aggregation", "Automated response playbooks", "Threat intelligence enrichment"], "key_takeaways": ["Automation is key to scaling security operations and reducing analyst fatigue from alert overload.", "Integrating threat intelligence feeds enriches alerts and enables more effective, context-aware responses.", "Automated playbooks (SOAR) must be carefully designed and tested to avoid unintended consequences."] },
    { "id": 14, "name": "Edge AI Inference Platform", "slug": "edge-ai-inference-platform", "description": "Containerized ONNX Runtime microservice for edge devices.", "status": "Substantial", "completion_percentage": 50, "tags": ["edge-ai", "inference", "onnx", "iot"], "github_path": "projects/14-edge-ai-inference", "technologies": ["ONNX Runtime", "Python", "Docker", "Azure IoT Edge"], "features": ["Low-latency inference", "Model optimization", "Containerized deployment"], "key_takeaways": ["Model optimization and quantization are crucial for deploying complex models on resource-constrained edge devices.", "ONNX provides a standardized format that decouples model training from inference, allowing for greater flexibility.", "Containerization simplifies the deployment and management of AI models on heterogeneous edge hardware."] },
    { "id": 15, "name": "Real-time Collaboration Platform", "slug": "real-time-collaboration-platform", "description": "Operational Transform collaboration server with CRDT backup.", "status": "Substantial", "completion_percentage": 50, "tags": ["websockets", "real-time", "collaboration", "crdt"], "github_path": "projects/15-real-time-collaboration", "technologies": ["Python", "WebSockets", "Redis"], "features": ["Real-time document editing", "Conflict resolution", "Presence tracking"], "key_takeaways": ["WebSockets provide the low-latency, bidirectional communication essential for real-time applications.", "Conflict resolution is the hardest part of collaborative editing; CRDTs and Operational Transforms are two powerful approaches.", "Maintaining a consistent state across all clients requires careful design and handling of network partitions."] },
    { "id": 16, "name": "Advanced Data Lake", "slug": "advanced-data-lake", "description": "Medallion architecture with Delta Lake and structured streaming.", "status": "Substantial", "completion_percentage": 55, "tags": ["data-lake", "glue", "athena", "spark"], "github_path": "projects/16-advanced-data-lake", "technologies": ["Databricks", "Delta Lake", "Python", "SQL"], "features": ["Bronze/Silver/Gold layers", "ACID transactions", "Stream ingestion"], "key_takeaways": ["The medallion architecture brings discipline and reliability to data lakes, preventing them from becoming data swamps.", "Open table formats like Delta Lake are transformative, adding database-like reliability (ACID, time travel) to data lakes.", "Decoupling storage and compute is a key cost and performance advantage of the modern data lake."] },
    { "id": 17, "name": "Multi-Cloud Service Mesh", "slug": "multi-cloud-service-mesh", "description": "Istio service mesh spanning AWS and GKE clusters.", "status": "Basic", "completion_percentage": 40, "tags": ["service-mesh", "istio", "multi-cloud", "kubernetes"], "github_path": "projects/17-multi-cloud-service-mesh", "technologies": ["Istio", "Kubernetes", "Consul"], "features": ["Cross-cluster communication", "mTLS enforcement", "Traffic splitting"], "key_takeaways": ["A service mesh abstracts away the complexity of inter-service communication, security, and observability.", "Extending a service mesh across multiple clouds or clouds is complex but enables powerful resiliency and traffic management patterns.", "mTLS provided by a service mesh is a transparent and powerful way to secure all service-to-service communication."] },
    { "id": 18, "name": "GPU-Accelerated Computing", "slug": "gpu-accelerated-computing", "description": "CUDA-based risk simulation engine with Dask.", "status": "Substantial", "completion_percentage": 45, "tags": ["gpu", "cuda", "hpc", "python"], "github_path": "projects/18-gpu-accelerated-computing", "technologies": ["CUDA", "Python", "Dask", "Nvidia Drivers"], "features": ["Monte Carlo simulations", "Parallel processing", "Performance benchmarking"], "key_takeaways": ["GPU acceleration is not just for graphics or ML; it can dramatically speed up scientific and financial simulations.", "The biggest performance bottleneck is often data transfer between CPU and GPU memory.", "Libraries like Dask can help distribute GPU-accelerated workloads across multiple machines."], "cicdWorkflow": { "name": "canary-deployment.yml", "path": ".github/workflows/canary-deployment.yml", "content": "name: Canary Deployment for GPU Service\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: 'Authenticate to GKE'\n        uses: 'google-github-actions/auth@v2'\n        with:\n          credentials_json: '${{ secrets.GKE_SA_KEY }}'\n\n      - name: 'Set up GKE cluster'\n        uses: 'google-github-actions/get-gke-credentials@v2'\n        with:\n          cluster_name: 'gpu-cluster'\n          location: 'us-central1'\n\n      - name: Build and Push Docker Image\n        run: |\n          # (Build and push logic for a CUDA-enabled Docker image)\n          echo \"Building and pushing image...\"\n          docker build -t gcr.io/my-project/gpu-service:${{ github.sha }} .\n          docker push gcr.io/my-project/gpu-service:${{ github.sha }}\n\n      - name: Deploy Canary with Helm\n        run: |\n          helm upgrade --install gpu-service ./charts/gpu-service \\\n            --set image.tag=${{ github.sha }} \\\n            --set canary.enabled=true \\\n            --set canary.weight=10\n\n      - name: Wait for Canary Analysis\n        run: |\n          # (Logic to run automated analysis, e.g., checking Prometheus metrics)\n          echo \"Running canary analysis for 5 minutes...\"\n          sleep 300\n          # (Check for error rates, latency, etc. Fail the job if thresholds are not met)\n\n      - name: Promote to Production\n        if: success()\n        run: |\n          echo \"Canary analysis successful. Promoting to 100%.\"\n          helm upgrade --install gpu-service ./charts/gpu-service \\\n            --set image.tag=${{ github.sha }} \\\n            --set canary.enabled=false\n\n      - name: Rollback on Failure\n        if: failure()\n        run: |\n          echo \"Canary analysis failed. Rolling back.\"\n          helm rollback gpu-service\n" } },
    { "id": 19, "name": "Advanced Kubernetes Operators", "slug": "advanced-kubernetes-operators", "description": "Custom resource operator built with Kopf.", "status": "Substantial", "completion_percentage": 50, "tags": ["kubernetes", "operators", "python", "kopf"], "github_path": "projects/19-advanced-kubernetes-operators", "technologies": ["Python", "Kopf", "Kubernetes API"], "features": ["Custom Resource Definitions", "Automated reconciliation", "State management"], "key_takeaways": ["The operator pattern extends the Kubernetes API to manage complex, stateful applications as native resources.", "The reconciliation loop is the core of an operator, continuously driving the system towards the desired state defined in the CRD.", "Frameworks like Kopf (Python) or Kubebuilder (Go) simplify operator development significantly."] },
    { "id": 20, "name": "Blockchain Oracle Service", "slug": "blockchain-oracle-service", "description": "Chainlink-compatible external adapter.", "status": "Substantial", "completion_percentage": 50, "tags": ["blockchain", "oracle", "chainlink", "solidity"], "github_path": "projects/20-blockchain-oracle-service", "technologies": ["Node.js", "Solidity", "Docker"], "features": ["Off-chain data fetching", "Cryptographic signing", "Smart contract integration"], "key_takeaways": ["Oracles are a critical piece of blockchain infrastructure, bridging the gap between on-chain smart contracts and off-chain data.", "Decentralization is key for oracles to prevent a single point of failure or manipulation.", "Building a Chainlink external adapter is a standard way to make any API accessible to smart contracts."] },
    { "id": 21, "name": "Quantum-Safe Cryptography", "slug": "quantum-safe-cryptography", "description": "Hybrid key exchange service using Kyber KEM.", "status": "Substantial", "completion_percentage": 50, "tags": ["cryptography", "post-quantum", "security", "python"], "github_path": "projects/21-quantum-safe-cryptography", "technologies": ["Python", "Kyber", "Cryptography Libraries"], "features": ["Post-quantum key exchange", "Hybrid encryption scheme", "NIST-standard algorithms"], "key_takeaways": ["The threat of quantum computers breaking current cryptography is real, and migration to PQC has already begun.", "A hybrid approach, combining classical and post-quantum algorithms, provides the safest path forward during the transition.", "The performance of PQC algorithms is a key consideration for their adoption in resource-constrained environments."] },
    { "id": 22, "name": "Autonomous DevOps Platform", "slug": "autonomous-devops-platform", "description": "Event-driven automation layer for self-healing infrastructure.", "status": "Basic", "completion_percentage": 40, "tags": ["devops", "automation", "ai", "python"], "github_path": "projects/22-autonomous-devops-platform", "technologies": ["Python", "Prometheus API", "Kubernetes API"], "features": ["Incident detection", "Automated remediation", "Runbook automation"], "key_takeaways": ["Event-driven automation can create self-healing systems that respond to incidents faster than humans.", "Observability data (metrics, logs, traces) is the fuel for autonomous operations.", "Start with simple, well-understood remediation tasks and build complexity gradually."] },
    { "id": 23, "name": "Advanced Monitoring & Observability", "slug": "advanced-monitoring-observability", "description": "Unified observability stack with Prometheus, Tempo, Loki, and Grafana.", "status": "Production Ready", "completion_percentage": 100, "tags": ["monitoring", "observability", "grafana", "prometheus"], "github_path": "projects/23-advanced-monitoring", "technologies": ["Prometheus", "Grafana", "Loki", "Thanos", "Python"], "features": ["Custom application exporter", "Multi-channel alerting", "Long-term storage", "SLO tracking"], "key_takeaways": ["The three pillars of observability (metrics, logs, traces) are most powerful when correlated together.", "Structured logging with a common set of labels is the key to effective log analysis and correlation.", "SLOs provide a user-centric, data-driven way to define and measure reliability."] },
    { "id": 24, "name": "Portfolio Report Generator", "slug": "report-generator", "description": "Automated report generation system using Jinja2 and WeasyPrint.", "status": "Production Ready", "completion_percentage": 100, "tags": ["automation", "reporting", "python"], "github_path": "projects/24-report-generator", "technologies": ["Python", "Jinja2", "WeasyPrint", "APScheduler"], "features": ["Scheduled generation", "Email delivery", "Historical trending", "PDF/HTML output"], "key_takeaways": ["Automating reporting saves significant manual effort and ensures consistency.", "Separating data gathering, templating (Jinja2), and rendering (WeasyPrint) creates a flexible and maintainable pipeline.", "A good report is not just data; it's data presented with context and clarity."] },
    { "id": 25, "name": "Portfolio Website", "slug": "portfolio-website", "description": "Static documentation portal generated with VitePress.", "status": "Production Ready", "completion_percentage": 100, "tags": ["web", "vitepress", "documentation", "vue"], "github_path": "projects/25-portfolio-website", "technologies": ["VitePress", "Vue.js", "Node.js", "GitHub Pages"], "features": ["Project showcase", "Automated deployment", "Responsive design", "Search functionality"], "key_takeaways": ["Static site generators offer excellent performance, security, and low hosting costs.", "Treating documentation as code (Docs-as-Code) by keeping it in Git alongside the project encourages updates and collaboration.", "A well-structured information architecture is crucial for a good user experience on a documentation site."] },
    { "id": 26, "name": "Secure-Deployer Public", "slug": "secure-deployer-public", "description": "A hardened, containerized deployment runner for secure, automated bulk deployments across multiple environments using short-lived credentials.", "status": "Production Ready", "completion_percentage": 100, "tags": ["security", "devops", "ci-cd", "deployment", "automation"], "github_path": "projects/26-secure-deployer", "technologies": ["Go", "Docker", "Vault", "gRPC", "Prometheus"], "features": ["Short-lived credential injection", "Policy-as-Code for deployment rules (OPA)", "Real-time deployment logging", "Extensible plugin architecture", "Minimal attack surface"], "key_takeaways": ["Separating the deployment runner from the CI orchestrator enhances security by isolating credentials and execution.", "Short-lived, dynamically generated credentials from a system like Vault are a cornerstone of modern secure CI/CD.", "A minimal, purpose-built runner in a distroless container reduces the potential attack surface compared to general-purpose CI agents."], "readme": "## Secure-Deployer\n\nThis project is a hardened, security-first deployment runner designed for automated, bulk deployments. It operates on the principle of least privilege, fetching just-in-time, short-lived credentials for each specific task.\n\n### Architecture\n- **Runner:** A lightweight, containerized Go application with a minimal attack surface (distroless image).\n- **Communication:** Uses gRPC with mutual TLS (mTLS) for secure, high-performance communication with an orchestrator.\n- **Secrets Management:** Integrates directly with HashiCorp Vault to dynamically generate credentials for cloud providers, databases, etc.\n\n### Key Features\n- **Just-in-Time Credentials:** Eliminates the need for long-lived secrets in the CI/CD environment.\n- **Policy Enforcement:** Uses Open Policy Agent (OPA) to enforce deployment rules before execution.\n- **Isolated Execution:** Each deployment script runs in a separate, unprivileged container.\n\n### Setup & Usage\n1.  **Run Vault:** Start a Vault instance (dev mode for testing: `vault server -dev`).\n2.  **Configure Runner:** Set environment variables to point to the Vault address and provide a valid Vault token.\n3.  **Start Runner:** `docker run -e VAULT_ADDR='...' -e VAULT_TOKEN='...' secure-deployer:latest`\n4.  **Trigger Deployment:** Send a gRPC request to the runner's endpoint with the deployment payload.", "adr": "### ADR-001: Choice of Communication Protocol\n\n**Status:** Accepted\n\n**Context:** The deployer needs a secure, high-performance communication channel to receive tasks and stream logs. The main options are a traditional RESTful API over HTTP/2 or gRPC.\n\n**Decision:** We will use **gRPC with mutual TLS (mTLS)** for all communication between the orchestrator and the runner.\n\n**Consequences:**\n*   **Pros:** gRPC is built on HTTP/2 and uses Protocol Buffers for efficient serialization, resulting in lower latency and smaller payloads. It provides native support for bi-directional streaming, which is ideal for real-time log streaming. Enforcing mTLS provides strong, built-in authentication and encryption.\n*   **Cons:** Less human-readable than REST/JSON, requiring specific tooling (like `grpcurl`) for debugging. Firewall configuration can be more complex than standard HTTPS traffic.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** A malicious actor attempts to impersonate a legitimate deployment runner or orchestrator. **Mitigation:** Enforce mutual TLS (mTLS) for all gRPC communication. Each runner and orchestrator must have a unique, short-lived certificate signed by a private CA managed in Vault.\n*   **Tampering:** An attacker modifies a deployment payload in transit. **Mitigation:** TLS encryption provided by gRPC protects data in transit. Payloads can also be signed by the orchestrator and verified by the runner.\n*   **Repudiation:** Inability to prove a specific deployment was requested or executed. **Mitigation:** All deployment requests are logged with cryptographic signatures. The runner streams back signed log entries, creating an auditable trail in a central logging system.\n*   **Information Disclosure:** A compromised runner exposes secrets or deployment artifacts. **Mitigation:** The runner fetches only short-lived, just-in-time credentials from Vault scoped to the specific deployment task. The runner's environment is a minimal, distroless container with no shell or unnecessary tools.\n*   **Denial of Service:** A flood of deployment requests overwhelms the runner fleet. **Mitigation:** Implement rate limiting on the orchestrator. Runners are deployed in an auto-scaling group to handle load, with circuit breakers to prevent cascading failures.\n*   **Elevation of Privilege:** A vulnerability in a deployment script allows it to access the host system or other deployments. **Mitigation:** Deployments are executed in isolated, unprivileged Docker containers with strict seccomp profiles and no host volume mounts. The runner itself runs as a non-root user." },
    { "id": 27, "name": "FamilyBridge-Photos Public", "slug": "familybridge-photos-public", "description": "A self-hosted photo sharing application designed with a focus on accessibility and ease-of-use for elderly family members.", "status": "Advanced", "completion_percentage": 75, "tags": ["web", "self-hosted", "photos", "react", "accessibility"], "github_path": "projects/27-familybridge-photos", "technologies": ["React", "TypeScript", "Next.js", "Tailwind CSS", "SQLite"], "features": ["High-contrast, large-font UI (WCAG AA compliant)", "One-click photo uploads via web and email", "Facial recognition for automatic tagging", "Shared albums with email notifications", "Simple, passwordless login via magic links"], "key_takeaways": ["Accessibility is not an afterthought; designing for specific user needs from the start leads to a better product for everyone.", "Self-hosting can provide data privacy and ownership, which is paramount for sensitive family photos.", "Modern frontend frameworks can be leveraged to build highly accessible and performant applications that feel like native apps."], "readme": "## FamilyBridge-Photos\n\nA self-hosted photo sharing web application designed from the ground up with elder users in mind. It prioritizes simplicity, accessibility, and privacy over complex features.\n\n### Architecture\n- **Frontend:** A highly accessible React/Next.js application using Tailwind CSS for a responsive, high-contrast UI.\n- **Backend:** A simple Next.js API route system.\n- **Database:** A single-file SQLite database for zero-configuration setup and easy backups.\n\n### Key Features\n- **Accessibility First:** Adheres to WCAG AA guidelines with large fonts, high contrast, and simple navigation.\n- **Multiple Upload Methods:** Users can upload photos via the web interface or by simply sending an email to a designated address.\n- **Passwordless Login:** Authentication is handled via magic links sent to a user's email, removing the need to remember passwords.\n\n### Setup & Usage\n1.  **Prerequisites:** Docker must be installed.\n2.  **Run Application:** `docker run -p 3000:3000 -v ./data:/app/data familybridge-photos:latest`\n3.  **Access:** Open a web browser to `http://localhost:3000`.\n4.  The `data` volume will store the SQLite database and all uploaded photos.", "adr": "### ADR-001: Choice of Database\n\n**Status:** Accepted\n\n**Context:** The application needs a database to store user information, album metadata, and photo details. It must be simple to manage for non-technical users in a self-hosted environment.\n\n**Decision:** We will use **SQLite** with the database file stored on the local filesystem. The application will connect to it directly.\n\n**Consequences:**\n*   **Pros:** Zero-configuration setup, making the application extremely easy to deploy (often just a single binary). Backups are as simple as copying a file. Excellent performance for a single-node, low-concurrency application like this.\n*   **Cons:** Does not scale horizontally. Concurrent write performance can be a bottleneck, though this is not a primary concern for this application's expected usage pattern.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** An unauthorized user gains access by guessing a user's email. **Mitigation:** Implement rate limiting on magic link generation. Links must be short-lived and single-use.\n*   **Tampering:** An attacker modifies photos after they have been uploaded. **Mitigation:** Store checksums (hashes) of all uploaded photos and verify them periodically. Use strict file permissions on the storage directory.\n*   **Repudiation:** A user denies uploading a specific photo. **Mitigation:** Log all upload events, associating them with the user, IP address, and timestamp.\n*   **Information Disclosure:** A user gains access to an album they are not a member of. **Mitigation:** Implement strict, clear authorization logic. All database queries for photos and albums must be scoped to the currently authenticated user's permissions.\n*   **Denial of Service:** A user uploads a massive number of large photos, filling the server's disk space. **Mitigation:** Enforce user-level storage quotas. Use a background job queue to process image thumbnails to prevent blocking the main application thread during uploads.\n*   **Elevation of Privilege:** A vulnerability in an image processing library (e.g., ImageMagick) allows for remote code execution. **Mitigation:** Run the image processing tasks in a separate, sandboxed container with minimal privileges. Keep all dependencies up-to-date with automated security scanners like Dependabot." },
    { "id": 28, "name": "AstraDup-Cross-Storage-Video-Files-duplication-tracker", "slug": "astradup-video-tracker", "description": "A high-performance utility for identifying and tracking duplicate video files across disparate storage systems using perceptual hashing.", "status": "Substantial", "completion_percentage": 60, "tags": ["data-engineering", "storage", "automation", "python", "video-processing"], "github_path": "projects/28-astradup", "technologies": ["Python", "FFmpeg", "ImageHash", "SQLite", "AWS S3 SDK"], "features": ["Cross-storage scanning (S3, GCS, Local)", "Perceptual hashing for visual duplicates", "Audio fingerprinting for audio duplicates", "Interactive duplicate management CLI", "Configurable hash strength and thresholds"], "key_takeaways": ["Checksum hashes (like MD5/SHA256) are insufficient for finding duplicate videos; perceptual hashing is required to identify visually identical files with different encodings.", "Processing large video files is I/O and CPU intensive; a pipelined, parallel processing approach is essential for performance.", "Indexing file metadata and hashes in a local database (like SQLite) dramatically speeds up subsequent scans by avoiding re-processing known files."], "readme": "## AstraDup - Video Duplication Tracker\n\nA command-line utility for finding and managing duplicate video files across local and cloud storage. It goes beyond simple filename or checksum matching by using perceptual hashing to find visually identical videos, even if they have different resolutions, formats, or encodings.\n\n### Architecture\n- **Core Engine:** A Python application using the Typer CLI framework.\n- **Video Processing:** Leverages FFmpeg to extract keyframes from video files.\n- **Hashing:** Uses the ImageHash library to generate perceptual hashes for each keyframe.\n- **Indexing:** Caches file paths, metadata, and hashes in a local SQLite database to speed up subsequent scans.\n\n### Key Features\n- **Perceptual Hashing:** Finds duplicates that have been re-encoded or slightly altered.\n- **Cross-Storage:** Scans local directories, AWS S3 buckets, and GCS buckets.\n- **Interactive CLI:** Provides tools to review duplicates and take action (e.g., generate a deletion script).\n\n### Usage\n1.  **Scan a directory:** `astradup scan --path /path/to/videos`\n2.  **Scan an S3 bucket:** `astradup scan --s3-bucket my-video-bucket`\n3.  **Generate a report:** `astradup report --format csv > duplicates.csv`\n4.  **Manage duplicates interactively:** `astradup manage`", "adr": "### ADR-001: Choice of Hashing Strategy\n\n**Status:** Accepted\n\n**Context:** We need an effective way to identify duplicate videos. Simple file hashes fail if the encoding or metadata is different. We considered several perceptual hashing libraries.\n\n**Decision:** We will use the **ImageHash library with a difference hash (dhash)** algorithm. We will extract keyframes from the video using FFmpeg and generate a composite hash from the hashes of several frames.\n\n**Consequences:**\n*   **Pros:** The ImageHash library is lightweight, well-maintained, and fast. dhash is resilient to minor changes in resolution, compression, and watermarking. This approach is significantly faster than more complex methods like SIFT.\n*   **Cons:** This method is not effective for identifying videos that are edited (e.g., scenes reordered). For that, more advanced video fingerprinting would be required, which adds significant complexity.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** A user runs the tool against a malicious S3 bucket they do not own. **Mitigation:** The tool operates with the credentials configured in the user's environment. The responsibility for credential security lies with the user, as is standard for CLI tools.\n*   **Tampering:** The local SQLite database is corrupted, leading to incorrect duplicate reports. **Mitigation:** The database is treated as a cache. It can be rebuilt from scratch by re-scanning the source directories. Implement transactional writes to reduce the chance of corruption.\n*   **Repudiation:** Not applicable for a local utility.\n*   **Information Disclosure:** Cloud storage credentials are exposed. **Mitigation:** The application never stores credentials itself; it relies on standard SDK environment variables or IAM roles. Documentation will strongly recommend using IAM roles where possible.\n*   **Denial of Service:** The tool consumes all available CPU and memory when scanning a very large number of files. **Mitigation:** Implement options to limit the number of parallel worker processes. Use streaming to process large files instead of loading them into memory.\n*   **Elevation of Privilege:** A vulnerability in FFmpeg could be exploited by a malicious video file. **Mitigation:** Run FFmpeg commands in a sandboxed environment if possible. Keep the FFmpeg binary up-to-date. Advise users to only scan trusted sources." },
    { "id": 29, "name": "Playbook-Generator Public", "slug": "playbook-generator-public", "description": "An automation tool that generates standardized operational playbooks (Ansible, Markdown) from a high-level YAML definition.", "status": "Substantial", "completion_percentage": 65, "tags": ["devops", "automation", "ansible", "jinja2", "python"], "github_path": "projects/29-playbook-generator", "technologies": ["Python", "Jinja2", "PyYAML", "Typer"], "features": ["Template-based generation", "Support for multiple output formats (Ansible, Markdown)", "Schema validation for input files (Pydantic)", "Extensible with custom modules and filters", "CLI for easy integration into pipelines"], "key_takeaways": ["Automating the generation of configuration and documentation (Config-as-Code, Docs-as-Code) ensures consistency and reduces human error.", "Using a powerful templating engine like Jinja2 separates the playbook logic and structure from the data.", "A well-defined and validated input schema (e.g., using Pydantic) is crucial for building a robust and user-friendly generator."], "readme": "## Playbook-Generator\n\nAn automation tool to enforce consistency and best practices by generating operational playbooks from a simple, high-level YAML definition. It supports multiple output formats, like Ansible playbooks for infrastructure automation and Markdown documents for runbooks.\n\n### Architecture\n- **Core:** A Python CLI built with Typer.\n- **Templating:** Uses the Jinja2 templating engine to render playbooks from templates.\n- **Input Validation:** Leverages Pydantic to define and enforce a strict schema for the input YAML files, providing clear error messages.\n\n### Key Features\n- **Standardization:** Ensures all playbooks follow a consistent structure and include necessary guardrails.\n- **Extensible:** New playbook formats can be supported by simply adding a new Jinja2 template.\n- **Validation:** Prevents errors by validating input YAML against a Pydantic schema before generation.\n\n### Usage\n1.  **Define Configuration:** Create a `config.yml` file with the high-level parameters for your task.\n2.  **Generate Playbook:** `playbook-gen --input config.yml --template ansible-deploy.j2 --output deploy.yml`\n3.  **Generate Documentation:** `playbook-gen --input config.yml --template markdown-runbook.md.j2 --output runbook.md`", "adr": "### ADR-001: Choice of CLI Framework\n\n**Status:** Accepted\n\n**Context:** The application requires a clean and user-friendly Command Line Interface (CLI). We considered using Python's built-in `argparse`, `Click`, and `Typer`.\n\n**Decision:** We will use **Typer**.\n\n**Consequences:**\n*   **Pros:** Typer is built on top of Click and provides a modern, intuitive way to build CLIs using Python type hints. This reduces boilerplate code and makes the CLI self-documenting. It automatically generates excellent help output.\n*   **Cons:** Adds an external dependency. It is a newer library than `argparse` or `Click`, though it is stable and well-supported.", "threatModel": "### STRIDE Threat Model\n\n*   **Spoofing:** Not directly applicable.\n*   **Tampering:** An attacker modifies a Jinja2 template to inject malicious commands into the generated playbook. **Mitigation:** Templates should be stored in a version-controlled Git repository with branch protection rules. Use checksums to verify template integrity.\n*   **Repudiation:** A user denies creating a playbook with a specific configuration. **Mitigation:** The input YAML file, when stored in Git, provides a clear audit trail of who defined the playbook's parameters.\n*   **Information Disclosure:** Sensitive data (e.g., passwords) is accidentally hardcoded into an input YAML file. **Mitigation:** Implement a secret scanning pre-commit hook in the repository where input files are stored. The documentation will strongly advise using a secrets management tool (like Vault) in the generated playbooks instead of raw values.\n*   **Denial of Service:** A malformed or deeply nested YAML input file causes the generator to crash or consume excessive memory. **Mitigation:** Use Pydantic to strictly validate the input YAML against a defined schema before processing. Implement resource limits if running the generator in a containerized environment.\n*   **Elevation of Privilege:** A user crafts a malicious input value that exploits a vulnerability in the Jinja2 templating engine to execute arbitrary code on the machine running the generator. **Mitigation:** Keep all dependencies (especially Jinja2 and PyYAML) up-to-date. Run the generator with the minimum necessary permissions. Consider running the generation step in a sandboxed environment." }
];

export const TECHNOLOGY_DEEP_DIVES: Record<string, TechnologyDeepDive> = {
    "terraform": {
        "title": "Why Terraform?",
        "explanation": "Terraform is HashiCorp's Infrastructure as Code (IaC) tool that enables declarative infrastructure management across multiple cloud providers. It uses HCL (HashiCorp Configuration Language) to define resources in a human-readable format, allowing you to manage infrastructure the same way you manage application code.",
        "key_concepts": {
            "Declarative Syntax (HCL)": "Define the desired end state of your infrastructure, and Terraform determines how to achieve it.",
            "State Management": {
                "description": "Terraform maintains a state file to track real-world resources, enabling drift detection and safe updates.",
                "code_example": "terraform {\n  backend \"s3\" {\n    bucket = \"my-tf-state-bucket\"\n    key    = \"global/s3/terraform.tfstate\"\n    region = \"us-east-1\"\n  }\n}",
                "lang": "hcl"
            },
            "Execution Plan": "The `terraform plan` command shows what changes will be made before they are applied, preventing surprises.",
            "Providers": {
                "description": "Plugins that interface with cloud provider APIs (e.g., AWS, GCP, Azure) to manage resources.",
                "code_example": "terraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}",
                "lang": "hcl"
            }
        },
        "real_world_scenario": "Provisioning a multi-AZ web application on AWS, including VPCs, subnets, EC2 instances, and RDS databases, all from a single version-controlled codebase.",
        "code_example": "```hcl\n# Example: AWS VPC with Terraform\nresource \"aws_vpc\" \"main\" {\n  cidr_block           = \"10.0.0.0/16\"\n  enable_dns_hostnames = true\n \n  tags = {\n    Name        = \"production-vpc\"\n    ManagedBy   = \"terraform\"\n  }\n}\n \nresource \"aws_subnet\" \"public\" {\n  count             = 2\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)\n  availability_zone = data.aws_availability_zones.available.names[count.index]\n \n  tags = {\n    Name = \"public-subnet-${count.index + 1}\"\n  }\n}\n```",
        "benefits": ["Provider Agnostic", "State Management for safety", "Plan Before Apply reduces risk", "Modular and Reusable Design", "Version Control Friendly"],
        "best_practices": ["Use remote state with locking", "Structure projects with modules", "Pin provider versions", "Run `fmt` and `validate` in CI"],
        "anti_patterns": ["Storing state locally in teams", "Hardcoding secrets", "Monolithic configurations", "Ignoring plan output"],
        "learning_resources": ["[Terraform Documentation](https://developer.hashicorp.com/terraform/docs)", "[Terraform Best Practices](https://www.terraform-best-practices.com/)", "[Terraform: Up & Running (Book)](https://www.oreilly.com/library/view/terraform-up-running-2nd-edition/9781098116736/)"]
    },
    "kubernetes": {
        "title": "Why Kubernetes?",
        "explanation": "Kubernetes (K8s) is the industry-standard container orchestration platform. It automates deployment, scaling, and management of containerized applications, abstracting away the underlying infrastructure so you can focus on your application's desired state.",
        "key_concepts": {
            "Pods": {
                "description": "The smallest deployable unit in Kubernetes, consisting of one or more containers that share network and storage.",
                "code_example": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod\nspec:\n  containers:\n  - name: web\n    image: nginx\n    ports:\n    - containerPort: 80",
                "lang": "yaml"
            },
             "Deployments": {
                "description": "A declarative way to manage the lifecycle of application replicas, handling updates and rollbacks.",
                "code_example": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\nspec:\n  replicas: 3",
                "lang": "yaml"
            },
            "Services": {
                "description": "An abstraction that defines a logical set of Pods and a policy for accessing them, enabling stable networking.",
                "code_example": "apiVersion: v1\nkind: Service\nmetadata:\n  name: my-web-service\nspec:\n  selector:\n    app: web\n  ports:\n    - protocol: TCP\n      port: 80\n      targetPort: 80",
                "lang": "yaml"
            },
            "Control Plane": "The 'brain' of the cluster, responsible for maintaining the desired state (API Server, etcd, Scheduler, etc.)."
        },
        "real_world_scenario": "Deploying a **microservices-based e-commerce platform** that can **automatically scale** during holiday traffic spikes and **self-heal** if a service fails. This leverages Kubernetes for high availability and resilience.",
        "code_example": "```yaml\n# Example: Kubernetes Deployment with Service\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-application\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.25\n        ports:\n        - containerPort: 80\n        livenessProbe:\n          httpGet:\n            path: /\n            port: 80\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-service\nspec:\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\n  type: ClusterIP\n```",
        "benefits": ["Self-Healing", "Horizontal Scaling", "Service Discovery & Load Balancing", "Rolling Updates and Rollbacks", "Declarative Configuration"],
        "best_practices": ["Set resource requests and limits", "Use namespaces for isolation", "Implement liveness and readiness probes", "Use GitOps for deployments"],
        "anti_patterns": ["Running containers as root", "Using `latest` image tags", "Not setting resource limits", "Single replica deployments for production"],
        "learning_resources": ["[Kubernetes Documentation](https://kubernetes.io/docs/)", "[CNCF Kubernetes Training](https://training.cncf.io/)", "[Kubernetes Patterns (Book)](https://k8spatterns.io/)"]
    },
    "kafka": {
        "title": "Why Apache Kafka?",
        "explanation": "Apache Kafka is a distributed event streaming platform for building real-time data pipelines and streaming applications. It provides durable, fault-tolerant message storage with high throughput, decoupling data producers from consumers at scale.",
        "key_concepts": {
            "Topics & Partitions": {
                "description": "Topics are named feeds of messages. They are split into partitions to enable parallelism and scalability.",
                "code_example": "# Create a topic with 4 partitions\nkafka-topics.sh --create \\\n  --bootstrap-server localhost:9092 \\\n  --topic user-events \\\n  --partitions 4 \\\n  --replication-factor 3",
                "lang": "bash"
            },
            "Producers & Consumers": {
                "description": "Producers publish messages to topics. Consumers subscribe to topics and process messages in coordinated groups.",
                "code_example": "// Simple Kafka Consumer in Node.js\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'user-events' })\nawait consumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(message.value.toString())\n  },\n})",
                "lang": "javascript"
            },
            "Brokers": "Servers in the Kafka cluster that store data and serve client requests.",
            "Offsets": "A pointer that tracks a consumer's progress within a partition, enabling reliable message processing."
        },
        "real_world_scenario": "Building a **real-time fraud detection system** for a financial institution, where transaction events are streamed and analyzed in milliseconds to block suspicious activity. This uses Kafka as a **high-throughput, durable buffer** for incoming events.",
        "code_example": "```python\n# Example: Kafka Producer with Python\nfrom confluent_kafka import Producer\nimport json\n\nproducer = Producer({'bootstrap.servers': 'localhost:9092'})\n\ndef delivery_report(err, msg):\n    if err is not None:\n        print(f'Message delivery failed: {err}')\n    else:\n        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')\n\nevent = {'user_id': 123, 'action': 'purchase'}\nproducer.produce(\n    'user-events',\n    key=str(event['user_id']).encode(),\n    value=json.dumps(event).encode(),\n    callback=delivery_report\n)\nproducer.flush()\n```",
        "benefits": ["High Throughput", "Durability and Fault Tolerance", "Scalability", "Exactly-Once Semantics", "Message Retention for Replay"],
        "best_practices": ["Use meaningful partition keys", "Set appropriate replication factor (min 3)", "Enable idempotent producers", "Use a Schema Registry"],
        "anti_patterns": ["Using Kafka for request-response", "Storing large payloads in messages", "Single partition topics for high throughput", "Auto-committing offsets without idempotent processing"],
        "learning_resources": ["[Kafka Documentation](https://kafka.apache.org/documentation/)", "[Confluent Developer](https://developer.confluent.io/)", "[Designing Data-Intensive Applications (Book)](https://dataintensive.net/)"]
    },
    "argocd": {
        "title": "Why ArgoCD?",
        "explanation": "ArgoCD is a declarative GitOps continuous delivery tool for Kubernetes. It treats Git as the single source of truth, continuously monitoring repositories and automatically syncing application state in the cluster to match the desired configuration.",
        "key_concepts": {
            "GitOps": {
                "description": "A paradigm where Git is the central source of truth for declarative infrastructure and applications.",
                "code_example": "# Desired state in Git (config.yaml)\nreplicas: 5\n\n# ArgoCD automatically syncs this\n# to the live cluster state.",
                "lang": "yaml"
            },
            "Application": {
                "description": "A Custom Resource Definition (CRD) that defines the source of manifests (Git) and the destination cluster.",
                "code_example": "apiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: my-app\nspec:\n  source:\n    repoURL: 'https://github.com/me/my-app.git'\n    path: 'k8s'\n  destination:\n    server: 'https://kubernetes.default.svc'",
                "lang": "yaml"
            },
            "Sync": "The process of reconciling the live state in the cluster to match the desired state in Git.",
            "Health Status": "ArgoCD assesses application health based on the status of its underlying Kubernetes resources."
        },
        "real_world_scenario": "A developer merges a feature, which automatically triggers a CI pipeline. The pipeline updates a Kubernetes manifest in a Git repository, and ArgoCD detects this change, deploying the new version to a staging environment without manual intervention.",
        "code_example": "```yaml\n# Example: ArgoCD Application Manifest\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: my-application\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/org/app-manifests.git\n    targetRevision: main\n    path: environments/production\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n```",
        "benefits": ["Git as Single Source of Truth", "Automated Sync and Self-Healing", "Multi-Cluster Management", "One-Click Rollback", "RBAC and Security"],
        "best_practices": ["Separate app code repos from manifest repos", "Use ApplicationSets for multi-env deployments", "Implement progressive delivery with Argo Rollouts", "Enable self-heal"],
        "anti_patterns": ["Storing secrets directly in Git", "Manual `kubectl` changes that bypass GitOps", "Disabling pruning", "Auto-sync without proper CI validation"],
        "learning_resources": ["[ArgoCD Documentation](https://argo-cd.readthedocs.io/)", "[GitOps Principles](https://opengitops.dev/)", "[Argo Project](https://argoproj.github.io/)"]
    },
    "docker": {
        "title": "Why Docker?",
        "explanation": "Docker packages applications with their dependencies into portable containers, ensuring consistency across development, testing, and production environments. Containers share the host OS kernel, making them lighter and faster than virtual machines.",
        "key_concepts": {
            "Image": "A read-only template containing the application code, libraries, and dependencies needed to run an application.",
            "Container": "A runnable instance of an image. It is an isolated, lightweight process running on the host OS.",
            "Dockerfile": {
                "description": "A text file with instructions for building a Docker image layer by layer.",
                "code_example": "FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"python\", \"./main.py\"]",
                "lang": "dockerfile"
            },
            "Registry": {
                "description": "A storage system for Docker images, like Docker Hub or AWS ECR, for sharing and distribution.",
                "code_example": "# Pull an image from a registry\ndocker pull ubuntu:22.04\n\n# Push an image to a registry\ndocker push my-registry/my-app:1.0",
                "lang": "bash"
            }
        },
        "real_world_scenario": "Packaging a Python web application and its dependencies into a container image, allowing any developer or server with Docker to run it identically with a single command, regardless of the host system's configuration.",
        "code_example": "```dockerfile\n# Example: Multi-stage Dockerfile for a Python App\n# Stage 1: Build dependencies\nFROM python:3.11-slim as builder\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt\n\n# Stage 2: Production image\nFROM python:3.11-slim\nWORKDIR /app\nCOPY --from=builder /app/wheels /wheels\nRUN pip install --no-cache-dir /wheels/*\nCOPY . .\nCMD [\"python\", \"app.py\"]\n```",
        "benefits": ["Consistency across environments", "Isolation", "Efficiency and Fast Startup", "Version Control for Infrastructure", "DevOps Enabler"],
        "best_practices": ["Use multi-stage builds", "Run containers as non-root users", "Pin specific image versions", "Use `.dockerignore`"],
        "anti_patterns": ["Running containers as root", "Storing secrets in images", "Using `latest` tag in production", "Installing unnecessary packages"],
        "learning_resources": ["[Docker Documentation](https://docs.docker.com/)", "[Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)", "[Docker Security Best Practices](https://docs.docker.com/engine/security/)"]
    },
    "aws": {
        "title": "Why AWS?",
        "explanation": "Amazon Web Services (AWS) is the world's most comprehensive cloud platform, offering over 200 services from data centers globally. It provides the building blocks for virtually any workload with enterprise-grade security, compliance, and global infrastructure.",
        "key_concepts": {
            "Regions & Availability Zones (AZs)": "AWS infrastructure is organized into geographic Regions, each containing multiple isolated AZs (data centers) for high availability.",
            "IAM (Identity and Access Management)": {
                "description": "The security service for managing user access and permissions to AWS resources.",
                "code_example": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [{\n    \"Effect\": \"Allow\",\n    \"Action\": \"s3:GetObject\",\n    \"Resource\": \"arn:aws:s3:::my-bucket/*\"\n  }]\n}",
                "lang": "json"
            },
            "VPC (Virtual Private Cloud)": {
                "description": "A logically isolated section of the AWS Cloud where you can launch resources in a virtual network you define.",
                "code_example": "# Create a VPC using AWS CLI\naws ec2 create-vpc \\\n  --cidr-block 10.0.0.0/16 \\\n  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-vpc}]'",
                "lang": "bash"
            },
            "Pay-as-you-go": "The pricing model where you only pay for the individual services you consume, for as long as you use them."
        },
        "real_world_scenario": "A startup launching a new mobile app uses AWS to host its backend on EC2, store user data in S3 and RDS, and deliver content globally with CloudFront, scaling its infrastructure on demand without upfront hardware costs.",
        "code_example": "```python\n# Example: AWS SDK (boto3) to upload a file to S3\nimport boto3\ns3 = boto3.client('s3')\n\nwith open(\"local-file.txt\", \"rb\") as f:\n    s3.upload_fileobj(\n        f,\n        \"my-bucket-name\",\n        \"uploads/remote-file.txt\",\n        ExtraArgs={'ServerSideEncryption': 'AES256'}\n    )\n```",
        "benefits": ["Market Leadership and Ecosystem", "Global Infrastructure", "Breadth of Services", "Pay-as-you-go Pricing", "Enterprise-Ready Security & Compliance"],
        "best_practices": ["Use IAM roles instead of access keys", "Enable CloudTrail for auditing", "Use VPCs for network isolation", "Tag resources for cost allocation"],
        "anti_patterns": ["Hardcoding credentials in code", "Using the root account for daily operations", "Public S3 buckets by default", "Single AZ deployments for production"],
        "learning_resources": ["[AWS Documentation](https://docs.aws.amazon.com/)", "[AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)", "[AWS Certification Path](https://aws.amazon.com/certification/)"]
    },
    "github-actions": {
        "title": "Why GitHub Actions?",
        "explanation": "GitHub Actions is a CI/CD platform integrated directly into GitHub repositories. It enables automation of build, test, and deployment workflows triggered by repository events like pushes, pull requests, or scheduled times.",
        "key_concepts": {
            "Workflow": "A configurable automated process defined by a YAML file in the `.github/workflows` directory.",
            "Event": {
                "description": "A specific activity in a repository that triggers a workflow run, such as a push or pull request.",
                "code_example": "on:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]",
                "lang": "yaml"
            },
            "Job": "A set of steps in a workflow that execute on the same runner.",
            "Action": {
                "description": "A reusable unit of code that can be combined as steps in a job, sourced from the Marketplace or your own repository.",
                "code_example": "steps:\n  - name: Check out repository code\n    uses: actions/checkout@v4",
                "lang": "yaml"
            }
        },
        "real_world_scenario": "Upon creating a pull request, a workflow is automatically triggered to run unit tests, perform a security scan, and build the application. The results are reported directly on the pull request, blocking the merge if any checks fail.",
        "code_example": "```yaml\nname: Python Test\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - name: Set up Python\n      uses: actions/setup-python@v5\n      with:\n        python-version: '3.11'\n    - name: Install dependencies\n      run: pip install -r requirements.txt\n    - name: Run tests\n      run: pytest\n```",
        "benefits": ["Native GitHub Integration", "Huge Marketplace of Actions", "Matrix Builds for multi-platform testing", "Integrated Secrets Management", "Generous Free Tier"],
        "best_practices": ["Pin action versions (e.g., `@v4`)", "Cache dependencies", "Use environments for deployment approvals", "Implement branch protection rules"],
        "anti_patterns": ["Storing secrets in workflow files", "Using `pull_request_target` without security review", "Overly broad permissions", "Not using caching"],
        "learning_resources": ["[GitHub Actions Documentation](https://docs.github.com/en/actions)", "[GitHub Actions Marketplace](https://github.com/marketplace?type=actions)", "[Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)"]
    },
    "mlflow": {
        "title": "Why MLflow?",
        "explanation": "MLflow is an open-source platform for managing the complete machine learning lifecycle. It provides experiment tracking, model packaging, versioning, and deployment, addressing the unique challenges of reproducibility and governance in MLOps.",
        "key_concepts": {
            "Tracking": {
                "description": "An API and UI for logging parameters, code versions, metrics, and output files when running machine learning code.",
                "code_example": "import mlflow\n\nwith mlflow.start_run():\n  mlflow.log_param(\"alpha\", 0.01)\n  mlflow.log_metric(\"rmse\", 0.78)",
                "lang": "python"
            },
            "Projects": "A standard format for packaging reusable data science code.",
            "Models": {
                "description": "A conventional format for packaging machine learning models that can be used in a variety of downstream tools.",
                "code_example": "# Log a scikit-learn model\nimport mlflow.sklearn\nmlflow.sklearn.log_model(sk_model, \"model\")",
                "lang": "python"
            },
            "Registry": "A centralized model store, set of APIs, and UI to collaboratively manage the full lifecycle of an MLflow Model."
        },
        "real_world_scenario": "A data science team trains multiple versions of a customer churn prediction model. They use MLflow to log each training run's hyperparameters and accuracy, compare results, register the best performing model, and deploy it to a staging environment for testing.",
        "code_example": "```python\n# Example: MLflow Experiment Tracking\nimport mlflow\nfrom sklearn.ensemble import RandomForestClassifier\n\nmlflow.set_experiment(\"customer-churn-prediction\")\n\nwith mlflow.start_run():\n    # Log parameters\n    mlflow.log_param(\"n_estimators\", 100)\n    mlflow.log_param(\"max_depth\", 10)\n\n    # Train model\n    model = RandomForestClassifier(n_estimators=100, max_depth=10)\n    # model.fit(X_train, y_train)\n\n    # Log metrics\n    # accuracy = model.score(X_test, y_test)\n    # mlflow.log_metric(\"accuracy\", accuracy)\n\n    # Log model\n    mlflow.sklearn.log_model(model, \"model\")\n```",
        "benefits": ["Experiment Tracking and Comparison", "Model Registry for versioning", "Reproducibility", "Framework Agnostic", "Flexible Deployment Options"],
        "best_practices": ["Use MLflow Projects for packaging", "Implement model signatures", "Use Model Registry stages (Staging/Production)", "Log dataset versions"],
        "anti_patterns": ["Not logging the random seed", "Storing large datasets as artifacts", "Skipping model signatures", "Manual model versioning outside the registry"],
        "learning_resources": ["[MLflow Documentation](https://mlflow.org/docs/latest/index.html)", "[MLflow Tutorials](https://mlflow.org/docs/latest/tutorials-and-examples/index.html)", "[MLOps: Continuous Delivery for ML on Google Cloud](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)"]
    },
    "prometheus": {
        "title": "Why Prometheus?",
        "explanation": "Prometheus is an open-source monitoring system with a dimensional data model and powerful query language (PromQL). Now a CNCF graduated project, it's the de facto standard for Kubernetes monitoring, using a pull-based model to scrape metrics from services.",
        "key_concepts": {
            "Time Series Data": "A stream of timestamped values belonging to the same metric and the same set of labeled dimensions.",
            "PromQL": {
                "description": "A flexible query language to select and aggregate time series data in real time.",
                "code_example": "# Get the 5-minute rate of HTTP requests\nrate(http_requests_total{job=\"my-app\"}[5m])",
                "lang": "bash"
            },
            "Exporters": "Sidecar applications or built-in endpoints that expose metrics from third-party systems in the Prometheus format.",
            "Alertmanager": {
                "description": "A component that handles alerts sent by client applications, taking care of deduplicating, grouping, and routing them.",
                "code_example": "groups:\n- name: example\n  rules:\n  - alert: HighRequestLatency\n    expr: job:request_latency_seconds:mean5m > 0.5\n    for: 10m",
                "lang": "yaml"
            }
        },
        "real_world_scenario": "An operations team monitors a fleet of microservices in Kubernetes. Prometheus automatically discovers and scrapes metrics from each service, and an alerting rule fires a notification to PagerDuty if the API error rate for any service exceeds 5% for more than five minutes.",
        "code_example": "```python\n# Example: Custom Prometheus Exporter with Python client\nfrom prometheus_client import start_http_server, Counter\nimport random\nimport time\n\nREQUESTS = Counter('my_app_requests_total', 'Total requests to my app')\n\nif __name__ == '__main__':\n    start_http_server(8000)\n    while True:\n        REQUESTS.inc()\n        time.sleep(random.random())\n```",
        "benefits": ["Pull-Based Model for dynamic environments", "Powerful PromQL", "Efficient Service Discovery", "Flexible Alerting", "Strong Community Support"],
        "best_practices": ["Use recording rules for complex queries", "Implement actionable alerting rules", "Use relabeling to add metadata", "Use federation for long-term storage"],
        "anti_patterns": ["High-cardinality labels (e.g., user IDs)", "Storing logs in Prometheus", "Missing `le` label in histogram queries", "Alerting on raw values without smoothing"],
        "learning_resources": ["[Prometheus Documentation](https://prometheus.io/docs/)", "[Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)", "[Prometheus: Up & Running (Book)](https://www.oreilly.com/library/view/prometheus-up/9781492034131/)"]
    },
    "security": {
        "title": "Why Security-First Development?",
        "explanation": "Security-first development (DevSecOps) integrates security practices throughout the SDLC rather than treating it as an afterthought. This \"shift-left\" approach catches vulnerabilities early when they are cheapest and easiest to fix.",
        "key_concepts": {
            "SAST (Static Analysis)": "Analyzes an application's source code for security vulnerabilities without executing it.",
            "DAST (Dynamic Analysis)": "Tests a running application for vulnerabilities by simulating external attacks.",
            "Dependency Scanning": "Identifies known vulnerabilities in third-party libraries and dependencies used by the application.",
            "SBOM (Software Bill of Materials)": {
                "description": "A formal record containing the details and supply chain relationships of various components used in building software.",
                "code_example": "{\n  \"bomFormat\": \"CycloneDX\",\n  \"specVersion\": \"1.4\",\n  \"components\": [\n    { \"type\": \"library\", \"name\": \"react\", \"version\": \"18.2.0\" }\n  ]\n}",
                "lang": "json"
            }
        },
        "real_world_scenario": "A CI/CD pipeline is configured to automatically scan every code change. It runs a SAST tool to check for coding flaws, a dependency scanner for vulnerable libraries, and a container scanner for OS vulnerabilities. A high-severity finding will automatically fail the build, preventing the insecure code from being deployed.",
        "code_example": "```yaml\n# Example: Security Scan in GitHub Actions\nname: Security Scan\non: [push, pull_request]\njobs:\n  container-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build image\n        run: docker build -t app:${{ github.sha }} .\n      - name: Run Trivy\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: 'app:${{ github.sha }}'\n          format: 'table'\n          severity: 'CRITICAL,HIGH'\n```",
        "benefits": ["Early Detection of Vulnerabilities", "Cost Reduction", "Compliance with Regulations", "Increased Customer Trust", "Automated and Consistent Security Checks"],
        "best_practices": ["Implement blocking security gates in CI", "Use secret scanning with pre-commit hooks", "Maintain an SBOM for all releases", "Conduct threat modeling during design"],
        "anti_patterns": ["Security as a final gate", "Ignoring vulnerability findings", "Relying only on perimeter security", "Storing secrets in code"],
        "learning_resources": ["[OWASP Top 10](https://owasp.org/www-project-top-ten/)", "[NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)", "[DevSecOps Maturity Model](https://owasp.org/www-project-devsecops-maturity-model/)"]
    },
    "serverless": {
        "title": "Why Serverless?",
        "explanation": "Serverless computing abstracts infrastructure management, allowing developers to focus on code. Cloud providers handle scaling, patching, and availability, charging only for actual execution time. It excels for event-driven workloads with variable traffic.",
        "key_concepts": {
            "FaaS (Function as a Service)": {
                "description": "The core of serverless, where application logic is run in ephemeral, stateless compute containers triggered by events.",
                "code_example": "import json\n\ndef lambda_handler(event, context):\n    # event: contains data for the function to process\n    print(f\"Received event: {json.dumps(event)}\")\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Lambda!')\n    }",
                "lang": "python"
            },
            "Event-Driven": "Functions are executed in response to triggers, such as an HTTP request, a new message in a queue, or a file upload.",
            "Cold vs. Warm Starts": "A cold start is the first time a function runs, involving longer setup time. Subsequent calls may hit a 'warm' instance for lower latency.",
            "Pay-Per-Use": "Billing is based on the number of invocations and the precise duration of function execution, eliminating costs for idle time."
        },
        "real_world_scenario": "An image processing service where uploading a photo to an S3 bucket automatically triggers a Lambda function. The function resizes the image into various thumbnails, adds a watermark, and saves them back to another S3 bucket, all without managing any servers.",
        "code_example": "```python\n# Example: AWS Lambda for S3 event processing\nimport boto3\ns3 = boto3.client('s3')\n\ndef lambda_handler(event, context):\n    bucket = event['Records'][0]['s3']['bucket']['name']\n    key = event['Records'][0]['s3']['object']['key']\n    \n    # Download the file, process it (e.g., resize), and re-upload\n    # ... (image processing logic not shown)\n    \n    print(f\"Processed file {key} from bucket {bucket}\")\n    return {'status': 'success'}\n```",
        "benefits": ["No Server Management", "Automatic Scaling", "Pay-Per-Use Pricing", "Faster Time-to-Market", "Built-in High Availability"],
        "best_practices": ["Keep functions focused (single responsibility)", "Minimize cold starts with provisioned concurrency", "Use layers for shared dependencies", "Implement dead letter queues"],
        "anti_patterns": ["Long-running processes", "Functions that maintain local state", "Monolithic functions", "Synchronous chains of Lambda calls"],
        "learning_resources": ["[AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)", "[Serverless Framework Docs](https://www.serverless.com/framework/docs)", "[AWS Lambda Powertools](https://awslabs.github.io/aws-lambda-powertools-python/)"]
    },
    "blockchain": {
        "title": "Why Blockchain?",
        "explanation": "Blockchain technology provides a decentralized, immutable ledger for trustless transactions. By distributing data across many nodes with cryptographic verification, blockchains eliminate the need for trusted intermediaries, enabling applications like DeFi and digital ownership.",
        "key_concepts": {
            "Decentralized Ledger": "A distributed database shared and synchronized among members of a network, with no central authority.",
            "Immutability": "Once a transaction is recorded on the blockchain, it is cryptographically sealed and cannot be altered or deleted.",
            "Smart Contracts": {
                "description": "Self-executing code stored on the blockchain that runs when predetermined conditions are met.",
                "code_example": "contract HelloWorld {\n  function sayHello() public pure returns (string memory) {\n    return \"Hello, Blockchain!\";\n  }\n}",
                "lang": "solidity"
            },
            "Consensus Mechanism": "The protocol (e.g., Proof of Work, Proof of Stake) that nodes use to agree on the state of the ledger."
        },
        "real_world_scenario": "A decentralized finance (DeFi) lending platform where users can lend or borrow cryptocurrency. All transactions are governed by smart contracts, which automatically handle interest rates, collateral, and liquidations without a traditional bank.",
        "code_example": "```solidity\n// Example: Simple Storage Smart Contract\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract SimpleStorage {\n    uint256 private storedData;\n\n    event DataStored(uint256 newValue);\n\n    function set(uint256 x) public {\n        storedData = x;\n        emit DataStored(x);\n    }\n\n    function get() public view returns (uint256) {\n        return storedData;\n    }\n}\n```",
        "benefits": ["Immutability", "Decentralization and Censorship Resistance", "Transparency", "Programmable Logic via Smart Contracts", "Global and Permissionless Access"],
        "best_practices": ["Use established libraries (e.g., OpenZeppelin)", "Conduct security audits", "Use upgradeable proxy patterns", "Follow checks-effects-interactions pattern"],
        "anti_patterns": ["Storing sensitive data on-chain", "Unbounded loops that run out of gas", "External calls before state changes (reentrancy)", "Deploying without thorough audits"],
        "learning_resources": ["[Ethereum Documentation](https://ethereum.org/developers/docs/)", "[Solidity by Example](https://solidity-by-example.org/)", "[OpenZeppelin Contracts Docs](https://docs.openzeppelin.com/contracts/5.x/)"]
    },
    "iot": {
        "title": "Why IoT Architecture?",
        "explanation": "Internet of Things (IoT) architecture connects physical devices to cloud services for data collection, analysis, and actuation. These systems span edge computing, specialized communication protocols, and time-series databases to handle continuous telemetry from millions of devices.",
        "key_concepts": {
            "Telemetry": "The continuous stream of data (e.g., temperature, location, status) sent from an IoT device to the cloud.",
            "MQTT": {
                "description": "A lightweight publish/subscribe messaging protocol designed for constrained devices and low-bandwidth networks, common in IoT.",
                "code_example": "import paho.mqtt.client as mqtt\n\nclient = mqtt.Client()\nclient.connect(\"broker.hivemq.com\", 1883)\nclient.publish(\"sensors/temp\", \"22.5\")",
                "lang": "python"
            },
            "Edge Computing": "Processing data locally on or near the IoT device to reduce latency, conserve bandwidth, and enable offline functionality.",
            "Digital Twin": "A virtual representation of a physical object or system, updated in real-time with data from its physical counterpart."
        },
        "real_world_scenario": "A fleet of refrigerated delivery trucks is equipped with sensors that continuously stream temperature and location data to the cloud via MQTT. A dashboard monitors the fleet in real-time, and an automated alert is triggered if any truck's temperature goes outside the safe range, preventing spoilage.",
        "code_example": "```python\n# Example: IoT Device Simulator with MQTT\nimport paho.mqtt.client as mqtt\nimport json, time, random\n\nclient = mqtt.Client(client_id='sensor-001')\nclient.connect('iot.example.com', 1883)\n\nwhile True:\n    telemetry = {\n        'temperature': round(random.uniform(20, 30), 2),\n        'humidity': round(random.uniform(40, 60), 2)\n    }\n    client.publish('devices/sensor-001/telemetry', json.dumps(telemetry))\n    print(f\"Published: {telemetry}\")\n    time.sleep(10)\n```",
        "benefits": ["Real-Time Data from Physical World", "Edge Processing for Low Latency", "Scalability for Millions of Devices", "Predictive Insights and Maintenance", "Automation and Control"],
        "best_practices": ["Use TLS/mTLS for all communication", "Implement unique device credentials", "Design for intermittent connectivity", "Use time-series databases"],
        "anti_patterns": ["Hardcoded credentials in firmware", "Unencrypted communication", "Sending raw data without edge preprocessing", "Ignoring device lifecycle management"],
        "learning_resources": ["[AWS IoT Documentation](https://docs.aws.amazon.com/iot/)", "[MQTT Protocol Specification](https://mqtt.org/specification/)", "[TimescaleDB for IoT](https://www.timescale.com/iot)"]
    },
    "monitoring": {
        "title": "Why Unified Observability?",
        "explanation": "Modern systems generate signals across three pillars: metrics, logs, and traces. Unified observability platforms correlate these signals, enabling engineers to understand system behavior holistically and rapidly debug issues, reducing Mean Time to Resolution (MTTR).",
        "key_concepts": {
            "Metrics": "Aggregated, numeric data over time (e.g., CPU usage, request rate). Answers 'What is happening?'.",
            "Logs": {
                "description": "Immutable, timestamped records of discrete events. Answers 'Why is it happening?'.",
                "code_example": "{\"timestamp\": \"2024-01-01T12:00:00Z\", \"level\": \"error\", \"message\": \"Payment failed\", \"trace_id\": \"abc-123\"}",
                "lang": "json"
            },
            "Traces": "A representation of a single request's journey through all the services in a distributed system. Answers 'Where is it happening?'.",
            "Correlation": "The ability to link metrics, logs, and traces using shared metadata (like a trace ID) to get a complete picture of an issue."
        },
        "real_world_scenario": "A Prometheus alert fires for a high API error rate (metric). An engineer clicks a link in the alert to a Grafana dashboard, which shows a trace for a failed request (trace). The trace is linked to the exact error message and stack trace from the specific microservice that failed (log), enabling immediate root cause analysis.",
        "code_example": "```python\n# Example: Instrumented FastAPI with structured logging\nimport structlog\nfrom fastapi import FastAPI, Request\n\nlogger = structlog.get_logger()\napp = FastAPI()\n\n@app.middleware(\"http\")\nasync def logging_middleware(request: Request, call_next):\n    # In a real app, this would come from headers\n    trace_id = 'generated-trace-id-123'\n    log = logger.bind(trace_id=trace_id, path=request.url.path)\n\n    response = await call_next(request)\n    log.info(\"request_finished\", status=response.status_code)\n    return response\n```",
        "benefits": ["Unified View of System Health", "Faster MTTR", "Proactive Alerting", "Capacity Planning", "SLO Tracking and Reporting"],
        "best_practices": ["Instrument applications with OpenTelemetry", "Use structured logging with trace IDs", "Define SLOs with error budgets", "Create actionable alerts with runbooks"],
        "anti_patterns": ["Alert fatigue", "Siloed tools without correlation", "High-cardinality metric labels", "Missing context in alerts"],
        "learning_resources": ["[Grafana Documentation](https://grafana.com/docs/)", "[OpenTelemetry](https://opentelemetry.io/docs/)", "[Google SRE Book](https://sre.google/sre-book/table-of-contents/)"]
    },
    "data-lake": {
        "title": "Why Data Lake Architecture?",
        "explanation": "Data lakes store raw, structured, and unstructured data at scale in open formats, enabling diverse analytics from BI to machine learning. The medallion architecture (Bronze/Silver/Gold) progressively refines data quality, while table formats like Delta Lake add reliability with ACID transactions.",
        "key_concepts": {
            "Schema-on-Read": "Data is ingested in its raw format; structure is applied during processing, providing flexibility for future analysis.",
            "Medallion Architecture": "A multi-layered approach (Bronze/Raw, Silver/Cleaned, Gold/Curated) to incrementally improve data quality and structure.",
            "Open Table Formats (Delta Lake)": {
                "description": "Adds reliability features like ACID transactions, time travel, and schema enforcement to data lakes built on object storage.",
                "code_example": "MERGE INTO target_table t\nUSING source_updates s ON s.id = t.id\nWHEN MATCHED THEN UPDATE SET t.value = s.value\nWHEN NOT MATCHED THEN INSERT *",
                "lang": "sql"
            },
            "Decoupled Storage and Compute": "Storage (e.g., S3) is separate from compute (e.g., Spark), allowing each to be scaled independently for cost efficiency."
        },
        "real_world_scenario": "A retail company ingests raw JSON clickstream data from its website into the Bronze layer of a data lake on S3. A daily Spark job cleans, deduplicates, and structures this data into a Silver Delta table. Finally, another job aggregates the Silver data into a Gold table of daily customer activity, which is then used by analysts for BI dashboards and by data scientists to train recommendation models.",
        "code_example": "```python\n# Example: Delta Lake Medallion Architecture with PySpark\nfrom delta.tables import DeltaTable\n\n# Read from Bronze layer (raw JSON)\nb_df = spark.read.format(\"json\").load(\"s3://lake/bronze/events\")\n\n# Clean and write to Silver layer (Delta)\ns_df = b_df.dropDuplicates([\"event_id\"]).filter(\"user_id is not null\")\ns_df.write.format(\"delta\").mode(\"overwrite\").save(\"s3://lake/silver/events\")\n\n# Aggregate and write to Gold layer (Delta)\ng_df = s_df.groupBy(\"user_id\").count()\ng_df.write.format(\"delta\").mode(\"overwrite\").save(\"s3://lake/gold/user_counts\")\n```",
        "benefits": ["Schema-on-Read Flexibility", "Cost-Effective Storage", "Avoids Vendor Lock-In with Open Formats", "Decoupled Storage and Compute", "Unified Analytics for BI and ML"],
        "best_practices": ["Use medallion architecture", "Partition data by common query patterns", "Implement data quality checks", "Use Delta Lake or Iceberg for ACID guarantees"],
        "anti_patterns": ["Allowing a data swamp (no governance)", "Small files problem", "Skipping the Silver layer", "Over-partitioning"],
        "learning_resources": ["[Delta Lake Documentation](https://docs.delta.io/)", "[The Data Lakehouse Platform](https://www.databricks.com/product/data-lakehouse)", "[Data Engineering with Apache Spark (Book)](https://www.oreilly.com/library/view/data-engineering-with/9781098108717/)"]
    },
    "flink": {
        "title": "Why Apache Flink?",
        "explanation": "Apache Flink is a stream processing framework for stateful computations over unbounded and bounded data streams. Flink has been designed to run in all common cluster environments, perform computations at in-memory speed and at any scale.",
        "key_concepts": {
            "Stateful Functions": {
                "description": "Functions that can maintain state across events, enabling complex computations like windowing and aggregations.",
                "code_example": "class SumState(ProcessFunction):\n    def __init__(self):\n        self.sum_state = None\n\n    def open(self, context):\n        # Obtain state handle\n        self.sum_state = context.get_state(\n            ValueStateDescriptor('sum', Types.INT()))\n\n    def process_element(self, value, ctx):\n        current_sum = self.sum_state.value() or 0\n        self.sum_state.update(current_sum + value)\n        yield self.sum_state.value()",
                "lang": "python"
            },
            "Event Time vs. Processing Time": "Flink distinguishes between the time an event occurred and the time it's processed, crucial for accurate, out-of-order stream processing.",
            "Exactly-Once Semantics": "Guarantees that each event is processed exactly once, even in the case of failures, ensuring data integrity.",
            "Bounded and Unbounded Streams": "Flink can process both continuous, never-ending streams (unbounded) and finite datasets (bounded), unifying batch and stream processing."
        },
        "real_world_scenario": "A ride-sharing company uses Flink to process a real-time stream of GPS locations from its drivers. Flink calculates dynamic pricing based on demand in specific geographic areas (windows) and pushes updates to the rider app in real-time.",
        "code_example": "```python\n# PyFlink example: 5-second tumbling window word count\nfrom pyflink.datastream import StreamExecutionEnvironment\nfrom pyflink.table import StreamTableEnvironment, DataTypes\nfrom pyflink.table.window import Tumble\n\nenv = StreamExecutionEnvironment.get_execution_environment()\nt_env = StreamTableEnvironment.create(env)\n\n# Define source and sink tables (e.g., from Kafka)\n# ...\n\nmy_table = t_env.from_path(\"source\")\n\n# Perform a windowed aggregation\nresult = my_table \\\n    .window(Tumble.over(\"5.seconds\").on(\"rowtime\").alias(\"w\")) \\\n    .group_by(\"w, word\") \\\n    .select(\"word, count(1)\")\n```",
        "benefits": ["True Streaming with Low Latency", "High Throughput and Scalability", "Fault Tolerance with Exactly-Once Guarantees", "Unified API for Batch and Stream Processing"],
        "best_practices": ["Choose the correct time characteristic (event, processing)", "Manage state with checkpoints and savepoints", "Use Flink SQL/Table API for high-level abstractions", "Monitor backpressure to identify bottlenecks"],
        "anti_patterns": ["Using large objects as state", "Not enabling checkpointing for stateful jobs", "Ignoring watermarks for event time processing", "Mixing blocking calls in streaming functions"],
        "learning_resources": ["[Apache Flink Documentation](https://nightlies.apache.org/flink/flink-docs-stable/)", "[Flink Tutorials](https://nightlies.apache.org/flink/flink-docs-stable/try-flink/flink-sql.html)", "[Stream Processing with Apache Flink (Book)](https://www.oreilly.com/library/view/stream-processing-with/9781491974285/)"]
    },
    "mlops": {
        "title": "Why MLOps?",
        "explanation": "MLOps (Machine Learning Operations) is a set of practices that aims to deploy and maintain machine learning models in production reliably and efficiently. It combines ML, DevOps, and Data Engineering to manage the entire ML lifecycle, from data gathering to model monitoring.",
        "key_concepts": {
            "Reproducibility": {
                "description": "Ensuring that ML experiments and model training pipelines can be exactly reproduced by tracking code, data, and parameters.",
                "code_example": "# Using MLflow to log a git commit hash\nimport mlflow\n\nwith mlflow.start_run():\n    mlflow.log_param(\"git_commit\", get_git_commit_hash())\n    # ... training code ...",
                "lang": "python"
            },
            "Continuous Integration (CI)": "Automating the testing of ML code and components.",
            "Continuous Training (CT)": "Automatically retraining models on new data to prevent model drift.",
            "Continuous Deployment (CD)": "Automating the deployment of trained models into production."
        },
        "real_world_scenario": "An e-commerce company has a product recommendation model. An MLOps pipeline automatically retrains the model weekly on new user interaction data, runs evaluation tests, and if the new model performs better, deploys it as a canary release to serve a small percentage of users before a full rollout.",
        "code_example": "```yaml\n# Conceptual GitHub Actions workflow for Continuous Training (CT)\nname: Weekly Model Retraining\non:\n  schedule:\n    - cron: '0 0 * * 1' # Every Monday at midnight\njobs:\n  retrain:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout code\n        uses: actions/checkout@v4\n      - name: Fetch latest data\n        run: python scripts/fetch_data.py\n      - name: Train model\n        run: python scripts/train.py --output-path ./model\n      - name: Evaluate and register model\n        run: python scripts/evaluate.py --model-path ./model\n```",
        "benefits": ["Faster Experimentation and Development", "Reproducibility and Governance", "Reliable and Scalable Model Deployment", "Automated Model Monitoring and Retraining"],
        "best_practices": ["Version control data, not just code (e.g., with DVC)", "Track experiments with tools like MLflow", "Monitor for data and concept drift in production", "Implement a feature store for reusable features"],
        "anti_patterns": ["Training on your laptop without tracking", "Deploying models as a one-time event without monitoring", "Ignoring data quality and validation", "Coupling model training and serving pipelines tightly"],
        "learning_resources": ["[MLOps Principles](https://ml-ops.org/)", "[Google Cloud MLOps Guide](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)", "[Designing Machine Learning Systems (Book)](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/)"]
    },
    "llm": {
        "title": "Why Large Language Models (LLMs)?",
        "explanation": "Large Language Models (LLMs) are a type of neural network with billions of parameters, trained on vast amounts of text data. They can understand, generate, and manipulate human language, enabling a wide range of applications from chatbots and summarization to code generation.",
        "key_concepts": {
            "Transformer Architecture": "The neural network architecture, based on self-attention mechanisms, that is fundamental to most modern LLMs.",
            "Pre-training and Fine-tuning": "LLMs are first pre-trained on a massive, general dataset, then fine-tuned on a smaller, task-specific dataset to improve performance for a particular application.",
            "Prompt Engineering": {
                "description": "The art of crafting effective inputs (prompts) to guide the LLM to produce the desired output.",
                "code_example": "# Example of a simple prompt with a role\nprompt = f\"\"\"System: You are a helpful assistant.\nUser: What is the capital of France?\nAssistant:\"\"\"",
                "lang": "bash"
            },
            "Retrieval-Augmented Generation (RAG)": "A technique that enhances LLM responses by first retrieving relevant information from an external knowledge base and providing it as context."
        },
        "real_world_scenario": "A customer support chatbot uses an LLM with a RAG system. When a user asks about a specific product, the system retrieves the latest product manual from a vector database and feeds it to the LLM. The LLM then generates a helpful, accurate answer based on the up-to-date information.",
        "code_example": "```python\n# Conceptual RAG chain with LangChain\nfrom langchain_community.vectorstores import FAISS\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.runnables import RunnablePassthrough\n\n# Assume 'retriever', 'llm' are already configured\n\ntemplate = \"\"\"Answer the question based only on this context:\\n\\n{context}\\n\\nQuestion: {question}\"\"\"\nprompt = ChatPromptTemplate.from_template(template)\n\nrag_chain = (\n    {\"context\": retriever, \"question\": RunnablePassthrough()}\n    | prompt\n    | llm\n)\n\nrag_chain.invoke(\"What is the project status?\")\n```",
        "benefits": ["Human-like Text Generation", "Few-Shot Learning Capabilities", "Versatility Across Many NLP Tasks", "Code and Content Creation"],
        "best_practices": ["Use RAG to ground models in factual data", "Fine-tune on high-quality, domain-specific data", "Implement guardrails to prevent harmful outputs", "Be specific and provide context in prompts"],
        "anti_patterns": ["Trusting LLM outputs without verification (hallucinations)", "Using LLMs for tasks requiring deterministic logic", "Ignoring privacy implications of sending data to third-party APIs", "Underestimating the cost of inference at scale"],
        "learning_resources": ["[Hugging Face Transformers](https://huggingface.co/docs/transformers/index)", "[LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)", "[Attention Is All You Need (Paper)](https://arxiv.org/abs/1706.03762)"]
    },
    "sast": {
        "title": "What is SAST?",
        "explanation": "Static Application Security Testing (SAST) is a 'white-box' testing methodology that analyzes an application's source code, bytecode, or binary for security vulnerabilities without executing the program. It's a key practice in 'shifting security left.'",
        "key_concepts": {
            "Taint Analysis": {
                "description": "Tracking untrusted user input (tainted data) to see if it reaches a sensitive function (a sink) without proper sanitization.",
                "code_example": "import os\n\n# Tainted data from user input\nfilename = request.args.get('filename')\n\n# SINK: Potential path traversal\nos.path.join('/var/www/uploads', filename)",
                "lang": "python"
            },
            "Control-Flow Graph (CFG)": "A representation of all paths that might be traversed through a program during its execution.",
            "Data-Flow Analysis": "Gathers information about how data moves through a program, essential for finding bugs.",
            "False Positives/Negatives": "SAST tools can sometimes report vulnerabilities that don't exist (false positives) or miss real ones (false negatives)."
        },
        "real_world_scenario": "During a CI pipeline, a SAST scanner like SonarQube analyzes a Java codebase. It detects a potential SQL injection vulnerability where user input is directly concatenated into a database query string. The pipeline fails, preventing the insecure code from being merged.",
        "code_example": "```python\n# Example of a SQL Injection vulnerability a SAST tool would find\nfrom flask import Flask, request\nimport sqlite3\n\napp = Flask(__name__)\n\n@app.route(\"/user\")\ndef get_user():\n    user_id = request.args.get('id')\n    db = sqlite3.connect('database.db')\n    cursor = db.cursor()\n    \n    # VULNERABILITY: Unsanitized input used directly in a query\n    cursor.execute(f\"SELECT * FROM users WHERE id = {user_id}\")\n    \n    user = cursor.fetchone()\n    return str(user)\n```",
        "benefits": ["Early Detection in the SDLC", "No Need for a Running Application", "Covers a Wide range of Vulnerabilities", "Educates Developers on Secure Coding"],
        "best_practices": ["Integrate SAST into the CI/CD pipeline", "Triage and prioritize findings", "Use quality gates to fail builds on critical vulnerabilities", "Combine with DAST and dependency scanning"],
        "anti_patterns": ["Running scans manually and infrequently", "Ignoring high numbers of false positives without tuning", "Treating SAST as a silver bullet for all security issues", "Failing to train developers on fixing the issues found"],
        "learning_resources": ["[OWASP SAST Guide](https://owasp.org/www-community/Source_Code_Analysis_Tools)", "[SonarQube Documentation](https://docs.sonarqube.org/latest/)", "[SANS Secure Coding](https://www.sans.org/cyber-security-courses/?focus-area=secure-coding)"]
    },
    "aws-lambda": {
        "title": "Why AWS Lambda?",
        "explanation": "AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers. You can trigger Lambda from over 200 AWS services and SaaS applications, and only pay for what you use.",
        "key_concepts": {
            "Function as a Service (FaaS)": {
                "description": "The core model where code is executed in stateless, ephemeral containers.",
                "code_example": "import json\n\ndef lambda_handler(event, context):\n    # event: contains data for the function to process\n    print(f\"Received event: {json.dumps(event)}\")\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Lambda!')\n    }",
                "lang": "python"
            },
            "Event Source Mapping": "The configuration that connects an event source (like S3, SQS, or API Gateway) to a Lambda function to trigger it.",
            "Execution Role": "An IAM role that grants the Lambda function permissions to access other AWS services and resources.",
            "Concurrency and Throttling": "Controls for how many instances of a function can run simultaneously to manage downstream load."
        },
        "real_world_scenario": "A user uploads their profile picture to an S3 bucket. This event triggers a Lambda function that automatically resizes the image into thumbnail, medium, and large versions and saves them back to another S3 bucket for use in the web application.",
        "code_example": "```yaml\n# Example: AWS SAM template for an API-triggered Lambda\nAWSTemplateFormatVersion: '2010-09-09'\nTransform: AWS::Serverless-2016-10-31\nResources:\n  MyApiFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      Handler: app.lambda_handler\n      Runtime: python3.11\n      CodeUri: src/\n      Events:\n        ApiEvent:\n          Type: Api\n          Properties:\n            Path: /hello\n            Method: get\n```",
        "benefits": ["No Server Management", "Continuous Scaling", "Pay-per-Execution Cost Model", "Integrated with AWS Ecosystem"],
        "best_practices": ["Keep functions small and single-purpose", "Manage dependencies with Layers", "Use provisioned concurrency to reduce cold starts", "Implement Dead Letter Queues (DLQs) for error handling"],
        "anti_patterns": ["Long-running, monolithic functions", "Chaining Lambda functions synchronously", "Ignoring cold start impact on user-facing APIs", "Using overly permissive IAM roles"],
        "learning_resources": [
            "[AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)",
            "[Serverless Land](https://serverlessland.com/)",
            "[AWS Lambda Powertools](https://awslabs.github.io/aws-lambda-powertools-python/)"
        ]
    },
    "grafana": {
        "title": "Why Grafana?",
        "explanation": "Grafana is the leading open-source platform for monitoring and observability. It allows you to query, visualize, alert on, and understand your metrics no matter where they are stored, creating a unified view of your entire stack.",
        "key_concepts": {
            "Dashboards and Panels": "Dashboards are collections of panels, and each panel displays data from a specific query using a chosen visualization type (e.g., graph, table, heatmap).",
            "Data Sources": {
                "description": "Plugins that connect Grafana to various storage backends like Prometheus, Loki, Elasticsearch, and SQL databases.",
                "code_example": "{\n  \"name\": \"Prometheus\",\n  \"type\": \"prometheus\",\n  \"url\": \"http://prometheus:9090\",\n  \"access\": \"proxy\"\n}",
                "lang": "json"
            },
            "Alerting": "The ability to define rules based on query results and send notifications to systems like PagerDuty, Slack, or email.",
            "Explore": "An interactive query and troubleshooting view that allows you to correlate metrics, logs, and traces."
        },
        "real_world_scenario": "An SRE team has a Grafana dashboard that visualizes key SLOs for their service, pulling metrics from Prometheus and logs from Loki. When an alert fires for high error rates, they can immediately see the correlated logs and traces within the same dashboard to quickly diagnose the root cause.",
        "code_example": "```\n# Example PromQL query used in a Grafana panel for a 99% availability SLO\n(\n  sum(rate(http_requests_total{status_code=~\"5..\"}[5m]))\n  /\n  sum(rate(http_requests_total[5m]))\n) > 0.01\n```",
        "benefits": ["Unified Observability Platform", "Flexible Data Source Support", "Powerful Visualization Options", "Advanced Alerting", "Strong Community and Enterprise Support"],
        "best_practices": ["Use dashboard variables for dynamic filtering", "Correlate metrics, logs, and traces", "Define actionable alerts with clear runbooks", "Use 'Infrastructure as Code' to manage dashboards"],
        "anti_patterns": ["Overly complex, cluttered dashboards", "Alerting on non-actionable metrics", "Using screenshots instead of sharing live dashboards", "Not using version control for dashboard JSON"],
        "learning_resources": ["[Grafana Documentation](https://grafana.com/docs/grafana/latest/)", "[Grafana University](https://grafana.com/tutorials/)", "[Querying Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/)"]
    },
    "solidity": {
        "title": "Why Solidity?",
        "explanation": "Solidity is a high-level, contract-oriented programming language for writing smart contracts. It was designed for the Ethereum Virtual Machine (EVM) and is the most widely used language for decentralized applications (dApps) on Ethereum and other compatible blockchains.",
        "key_concepts": {
            "Smart Contract": "A program that runs at a specific address on the blockchain, governed by its code and data.",
            "EVM (Ethereum Virtual Machine)": "The runtime environment for smart contracts on Ethereum. Solidity code compiles down to EVM bytecode.",
            "State Variables": {
                "description": "Variables whose values are permanently stored in contract storage on the blockchain.",
                "code_example": "contract SimpleStorage {\n  // State variable stored on the blockchain\n  uint256 public myNumber;\n}",
                "lang": "solidity"
            },
            "Gas": "The fee required to execute a transaction or smart contract function on the Ethereum network. More complex operations cost more gas."
        },
        "real_world_scenario": "A developer writes a Solidity smart contract for an NFT (Non-Fungible Token). The contract defines the rules for minting new tokens, transferring ownership, and querying token metadata, all of which are enforced by the decentralized Ethereum network.",
        "code_example": "```solidity\n// Example: Simple Storage Smart Contract\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract SimpleStorage {\n    uint256 private storedData;\n\n    event DataStored(uint256 newValue);\n\n    function set(uint256 x) public {\n        storedData = x;\n        emit DataStored(x);\n    }\n\n    function get() public view returns (uint256) {\n        return storedData;\n    }\n}\n```",
        "benefits": ["Turing-complete for Complex Logic", "Statically Typed for Safety", "Large Developer Community and Tooling", "Inheritance and Library Support"],
        "best_practices": ["Use the Checks-Effects-Interactions pattern to prevent reentrancy", "Use established libraries like OpenZeppelin", "Favor pull over push for payments", "Ensure comprehensive test coverage and get external audits"],
        "anti_patterns": ["Using `tx.origin` for authorization", "Unprotected functions that modify state", "Integer overflow/underflow (on older versions)", "Relying on block timestamps for randomness"],
        "learning_resources": ["[Solidity Documentation](https://docs.soliditylang.org/)", "[CryptoZombies](https://cryptozombies.io/)", "[Solidity by Example](https://solidity-by-example.org/)"]
    },
    "database": {
        "title": "Database Engineering Principles",
        "explanation": "Database engineering is the discipline of designing, implementing, and maintaining the data storage systems that form the backbone of modern applications. It encompasses data modeling, performance tuning, and ensuring reliability and scalability.",
        "key_concepts": {
            "Data Modeling": "The process of creating a conceptual representation of data objects and the relationships between them (e.g., relational, document, graph).",
            "Indexing": {
                "description": "Creating data structures that improve the speed of data retrieval operations on a database table at the cost of additional writes and storage space.",
                "code_example": "CREATE INDEX idx_users_on_email\nON users (email);",
                "lang": "sql"
            },
            "ACID Transactions": "A set of properties (Atomicity, Consistency, Isolation, Durability) that guarantee data validity despite errors, power failures, and other mishaps.",
            "Replication": "The process of sharing information to ensure consistency between redundant resources, such as software or hardware components, to improve reliability and accessibility."
        },
        "real_world_scenario": "An engineer designs a relational database schema for a social media application. They add indexes to the `user_id` column in the `posts` table to speed up queries for a user's posts and set up read replicas to handle high read traffic without impacting write performance.",
        "code_example": "```sql\n-- Example: Creating an index to speed up user lookups\n\n-- Find all posts by a specific user (can be slow on large tables)\nSELECT * FROM posts WHERE user_id = 12345;\n\n-- Create an index on the user_id column\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n\n-- The same query now runs much faster by using the index\nSELECT * FROM posts WHERE user_id = 12345;\n```",
        "benefits": ["Data Integrity and Consistency", "High Performance Querying", "Scalability and High Availability", "Data Security and Access Control"],
        "best_practices": ["Normalize data to reduce redundancy (for relational DBs)", "Use connection pooling", "Regularly analyze query performance (e.g., with EXPLAIN)", "Implement a robust backup and recovery strategy"],
        "anti_patterns": ["Indexing every column", "Using `SELECT *` in production code", "Storing large binary objects (BLOBs) directly in the database", "Ignoring N+1 query problems in ORMs"],
        "learning_resources": ["[Designing Data-Intensive Applications (Book)](https://dataintensive.net/)", "[PostgreSQL Documentation](https://www.postgresql.org/docs/)", "[Database Internals (Book)](https://www.oreilly.com/library/view/database-internals/9781492040330/)"]
    },
    "quantum-computing": {
        "title": "Quantum Computing Fundamentals",
        "explanation": "Quantum computing leverages principles of quantum mechanics, such as superposition and entanglement, to process information in fundamentally new ways. It holds the potential to solve certain classes of problems—like optimization and simulation—that are intractable for even the most powerful classical supercomputers.",
        "key_concepts": {
            "Qubit": {
                "description": "The basic unit of quantum information. Unlike a classical bit (0 or 1), a qubit can exist in a superposition of both states simultaneously.",
                "code_example": "from qiskit import QuantumCircuit\n\n# Create a circuit with one quantum bit\nqc = QuantumCircuit(1)",
                "lang": "python"
            },
            "Superposition": "A principle of quantum mechanics that allows a qubit to be in a combination of both 0 and 1 states at the same time.",
            "Entanglement": "A phenomenon where two or more qubits become linked in such a way that their fates are intertwined, no matter how far apart they are.",
            "Quantum Gates": "The building blocks of quantum circuits, analogous to logic gates in classical computers, that perform operations on qubits."
        },
        "real_world_scenario": "A pharmaceutical company uses a quantum computer to simulate molecular interactions for drug discovery. By modeling the complex quantum behavior of molecules, they can identify promising drug candidates much faster than with classical simulations.",
        "code_example": "```python\n# Example: Creating an entangled Bell state with Qiskit\nfrom qiskit import QuantumCircuit\n\n# Create a quantum circuit with two qubits\nqc = QuantumCircuit(2)\n\n# Put the first qubit in superposition\nqc.h(0)\n\n# Entangle the two qubits with a CNOT gate\nqc.cx(0, 1)\n\n# The qubits are now in a Bell state\nprint(qc)\n```",
        "benefits": ["Solving Intractable Problems", "Exponential Speedup for Certain Algorithms", "Accurate Molecular and Material Simulation", "Breaking Current Cryptographic Standards (a threat and opportunity)"],
        "best_practices": ["Use simulators for development and testing", "Employ error mitigation techniques for noisy hardware", "Choose problems that have a known quantum advantage", "Understand the limitations of current NISQ-era hardware"],
        "anti_patterns": ["Expecting quantum computers to speed up all classical problems", "Ignoring the effects of noise and decoherence", "Running algorithms with deep circuits on current hardware", "Underestimating the need for classical post-processing"],
        "learning_resources": ["[Qiskit Textbook](https://qiskit.org/textbook/)", "[Quantum Country](https://quantum.country/)", "[Nielsen and Chuang (Book)](https://www.cambridge.org/us/academic/subjects/physics/quantum-physics-quantum-information-and-quantum-computation/quantum-computation-and-quantum-information-10th-anniversary-edition)"]
    },
    "istio": {
        "title": "Why Istio?",
        "explanation": "Istio is an open-source service mesh that transparently layers onto existing distributed applications. It provides a uniform and efficient way to secure, connect, and monitor services, without requiring any changes to the application code.",
        "key_concepts": {
            "Service Mesh": "A dedicated infrastructure layer for handling service-to-service communication, providing reliability, security, and observability.",
            "Envoy Proxy": "A high-performance proxy that Istio deploys as a 'sidecar' to each application container. All traffic in and out of the container flows through Envoy.",
            "Control Plane (Istiod)": "The central component that manages and configures the Envoy proxies to enforce policies and route traffic.",
            "Custom Resources (CRDs)": {
                "description": "Istio uses Kubernetes CRDs like `VirtualService` and `DestinationRule` to configure traffic management.",
                "code_example": "apiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: my-service\nspec:\n  host: my-service\n  subsets:\n  - name: v1\n    labels:\n      version: v1\n  - name: v2\n    labels:\n      version: v2",
                "lang": "yaml"
            }
        },
        "real_world_scenario": "A company with a microservices architecture uses Istio to enforce mTLS encryption for all internal traffic automatically. They also use a `VirtualService` to perform a canary release, gradually shifting 10% of traffic to a new version of a service to test it in production with minimal risk.",
        "code_example": "```yaml\n# Example: Istio VirtualService for canary deployment\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: my-service\nspec:\n  hosts:\n    - my-service.my-namespace.svc.cluster.local\n  http:\n  - route:\n    - destination:\n        host: my-service\n        subset: v1\n      weight: 90\n    - destination:\n        host: my-service\n        subset: v2 # The new version\n      weight: 10 # Send 10% of traffic to v2\n```",
        "benefits": ["Automatic mTLS and Security Policies", "Advanced Traffic Management (Canary, A/B)", "Rich Telemetry (Metrics, Logs, Traces)", "Platform-Agnostic and Transparent to Apps"],
        "best_practices": ["Start with a minimal profile and enable features as needed", "Use gateways for ingress and egress traffic", "Enforce strict mTLS by default", "Use `DestinationRule` to configure load balancing and connection pooling"],
        "anti_patterns": ["Applying Istio to all namespaces without consideration", "Complex, deeply nested VirtualServices", "Bypassing the Envoy sidecar for service-to-service communication", "Ignoring the performance overhead of the proxies"],
        "learning_resources": ["[Istio Documentation](https://istio.io/latest/docs/)", "[Istio: Up & Running (Book)](https://www.oreilly.com/library/view/istio-up-and/9781492043768/)", "[CNCF Service Mesh White Paper](https://www.cncf.io/reports/service-mesh-white-paper/)"]
    },
    "gpu": {
        "title": "Why GPU Computing?",
        "explanation": "GPU (Graphics Processing Unit) computing uses the massively parallel architecture of a GPU to accelerate applications. While originally designed for graphics, their ability to perform the same operation on many data points simultaneously makes them ideal for scientific computing, machine learning, and data processing workloads.",
        "key_concepts": {
            "Parallelism": "The ability to execute many calculations or processes simultaneously. GPUs contain thousands of smaller, efficient cores designed for parallel tasks.",
            "CUDA": "A parallel computing platform and programming model created by NVIDIA that allows developers to use a C/C++-like language to program GPUs.",
            "Kernel": {
                "description": "A function written by the programmer that is executed by many different GPU threads at once.",
                "code_example": "__global__ void vectorAdd(float *A, float *B, float *C, int N) {\n  int i = blockDim.x * blockIdx.x + threadIdx.x;\n  if (i < N) C[i] = A[i] + B[i];\n}",
                "lang": "c"
            },
            "Data Transfer": "A key performance consideration involving moving data between the CPU's main memory and the GPU's dedicated memory."
        },
        "real_world_scenario": "A data scientist trains a deep learning neural network for image recognition. The training process involves millions of matrix multiplications, which are executed in parallel on a GPU using a framework like TensorFlow or PyTorch, reducing training time from weeks to hours.",
        "code_example": "```python\n# Example: GPU array operations with CuPy (a NumPy-like library)\nimport numpy as np\nimport cupy as cp\nimport time\n\n# Create large arrays on the CPU and GPU\nx_cpu = np.ones((1000, 1000))\nx_gpu = cp.ones((1000, 1000))\n\n# CPU computation\nstart = time.time()\n_ = np.sum(x_cpu)\nprint(f\"CPU time: {time.time() - start:.5f}s\")\n\n# GPU computation\nstart = time.time()\n_ = cp.sum(x_gpu)\ncp.cuda.Stream.null.synchronize() # Wait for GPU to finish\nprint(f\"GPU time: {time.time() - start:.5f}s\")\n```",
        "benefits": ["Massive Parallelism for High Throughput", "Significant Speedup for AI/ML and Scientific Workloads", "Energy Efficiency for Parallel Tasks", "Growing Ecosystem of Libraries and Tools"],
        "best_practices": ["Minimize data transfer between CPU and GPU", "Use high-level libraries (PyTorch, TensorFlow, CuPy) when possible", "Batch operations to maximize GPU utilization", "Overlap computation with data transfer using CUDA streams"],
        "anti_patterns": ["Transferring small amounts of data back and forth frequently", "Using GPU for highly sequential, non-parallelizable tasks", "Ignoring memory management on the GPU", "Writing custom kernels for problems that are already solved by libraries"],
        "learning_resources": ["[NVIDIA CUDA Toolkit Documentation](https://docs.nvidia.com/cuda/)", "[Deep Learning with PyTorch (Book)](https://pytorch.org/deep-learning-with-pytorch)", "[NVIDIA Developer Blog](https://developer.nvidia.com/blog/)"]
    },
    "cryptography": {
        "title": "Post-Quantum Cryptography (PQC)",
        "explanation": "Post-Quantum Cryptography (PQC) refers to cryptographic algorithms that are thought to be secure against attacks by both classical and quantum computers. As large-scale quantum computers threaten to break current public-key cryptography (like RSA and ECC), PQC is being developed to ensure long-term data security.",
        "key_concepts": {
            "Shor's Algorithm": "A quantum algorithm that can efficiently factor large integers, which would break RSA and ECC encryption.",
            "Lattice-based Cryptography": {
                "description": "A leading approach for PQC that relies on the difficulty of solving problems in high-dimensional geometric structures called lattices.",
                "code_example": "// A simple 2D lattice basis\nVector v1 = {2, 1};\nVector v2 = {1, 2};\n// Finding the shortest non-zero vector is hard in high dimensions",
                "lang": "c"
            },
            "Key Encapsulation Mechanism (KEM)": "A technique used to secure and exchange symmetric keys, a common pattern in PQC algorithms like Kyber.",
            "Digital Signatures": "PQC also includes algorithms for creating digital signatures (like CRYSTALS-Dilithium) that are resistant to quantum attacks."
        },
        "real_world_scenario": "A government agency needs to encrypt classified data that must remain secure for decades. They use a hybrid encryption scheme, combining a classical algorithm (like AES) with a PQC key exchange mechanism (like Kyber). This ensures the data is secure today and remains secure even when large quantum computers become available.",
        "code_example": "```python\n# Conceptual example using the 'pqcrypto' library for Kyber\nimport pqcrypto.kem.kyber512 as kyber\n\nmessage = b'This is a secret message.'\n\n# Generate public and private keys\npublic_key, private_key = kyber.keypair()\n\n# Encapsulate to get a ciphertext and a shared secret\nciphertext, shared_secret_sender = kyber.enc(public_key)\n\n# Decapsulate the ciphertext to get the same shared secret\nshared_secret_receiver = kyber.dec(ciphertext, private_key)\n\n# Now both parties can use the shared secret for symmetric encryption\nassert shared_secret_sender == shared_secret_receiver\n```",
        "benefits": ["Long-Term Security Against Quantum Threats", "Based on Different, Hard Mathematical Problems", "Standardization Efforts by NIST", "Enables Secure Communication in a Post-Quantum World"],
        "best_practices": ["Use a hybrid approach during transition (classical + PQC)", "Follow NIST recommendations and use standardized algorithms", "Use high-level cryptographic libraries", "Consider the performance and key size implications of PQC algorithms"],
        "anti_patterns": ["Implementing your own cryptographic algorithms", "Using non-standardized or unvetted PQC algorithms", "Ignoring the need for a hybrid approach in the near term", "Hardcoding cryptographic keys"],
        "learning_resources": ["[NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/projects/post-quantum-cryptography)", "[Introduction to Post-Quantum Cryptography](https://www.nist.gov/itl/applied-cybersecurity-division/post-quantum-cryptography/pqc-basics)", "[Open Quantum Safe Project](https://openquantumsafe.org/)"]
    },
    "websockets": {
        "title": "Why WebSockets?",
        "explanation": "The WebSocket protocol enables two-way, full-duplex communication between a client and server over a single, long-lived TCP connection. Unlike traditional HTTP request-response, WebSockets allow the server to push data to the client in real-time without the client having to poll for updates.",
        "key_concepts": {
            "Full-Duplex": "Data can be sent and received simultaneously by both the client and server.",
            "Persistent Connection": "The connection remains open after the initial handshake, reducing the overhead of establishing new connections for each message.",
            "Handshake": {
                "description": "The initial communication starts as a standard HTTP request with an `Upgrade` header, which, if successful, establishes the WebSocket connection.",
                "code_example": "// Client-side JavaScript\nconst socket = new WebSocket('wss://example.com/socket');",
                "lang": "javascript"
            },
            "Frames": "Messages are sent as 'frames', which can be text or binary data."
        },
        "real_world_scenario": "A live stock trading application uses WebSockets to push real-time price updates to a user's browser. As soon as a stock price changes on the server, the new price is instantly sent to all connected clients, ensuring the user always sees the latest data without having to refresh the page.",
        "code_example": "```javascript\n// Example: Client-side WebSocket connection\nconst socket = new WebSocket('wss://api.example.com/stream');\n\n// Connection opened\nsocket.addEventListener('open', (event) => {\n  console.log('Connected to WebSocket server.');\n  socket.send('Hello Server!');\n});\n\n// Listen for messages from the server\nsocket.addEventListener('message', (event) => {\n  console.log('Message from server:', event.data);\n});\n\n// Listen for possible errors\nsocket.addEventListener('error', (event) => {\n  console.error('WebSocket error:', event);\n});\n```",
        "benefits": ["Real-Time Communication with Low Latency", "Reduced Network Overhead", "Efficient Bidirectional Data Flow", "Scalable for applications with many concurrent connections"],
        "best_practices": ["Implement a reconnection strategy on the client", "Use a subprotocol for structured messages (e.g., JSON)", "Secure connections with WSS (WebSocket Secure)", "Implement heartbeats (pings/pongs) to detect dead connections"],
        "anti_patterns": ["Using WebSockets for simple request-response tasks", "Not handling connection drops and reconnections gracefully", "Sending large, monolithic messages instead of smaller chunks", "Failing to secure the WebSocket endpoint"],
        "learning_resources": ["[MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)", "[RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)", "[Socket.IO](https://socket.io/)"]
    },
    "crdt": {
        "title": "What are CRDTs?",
        "explanation": "Conflict-free Replicated Data Types (CRDTs) are data structures designed for distributed systems that can be replicated and updated concurrently across multiple nodes without coordination. They are mathematically guaranteed to eventually converge to the same state, making them ideal for collaborative applications.",
        "key_concepts": {
            "Strong Eventual Consistency": "Guarantees that if no new updates are made, all replicas will eventually be in the same state.",
            "Commutative Operations": {
                "description": "The order in which concurrent updates are applied does not affect the final result.",
                "code_example": "// A simple counter where increment is commutative\nlet counter = 0;\nconst increment1 = () => counter += 1;\nconst increment2 = () => counter += 1;\n\n// order doesn't matter: a + b === b + a\n// increment1() then increment2() yields same result as the reverse",
                "lang": "javascript"
            },
            "State-based (CvRDTs)": "Replicas merge by sending their entire state to other replicas. Merging is idempotent and commutative.",
            "Operation-based (CmRDTs)": "Replicas send individual update operations to other replicas. Requires a more reliable delivery mechanism."
        },
        "real_world_scenario": "A collaborative document editor like Google Docs uses CRDT-like data structures. When two users type in the same paragraph simultaneously, their changes are applied locally and then sent to other replicas. The CRDT ensures that even if the updates arrive in different orders, the final state of the paragraph will be identical for both users.",
        "code_example": "```javascript\n// Example: A simple G-Counter (Grow-Only Counter) CRDT\nclass GCounter {\n    constructor(id) {\n        this.id = id;\n        this.payload = {};\n        this.payload[id] = 0;\n    }\n\n    increment() {\n        this.payload[this.id]++;\n    }\n\n    value() {\n        return Object.values(this.payload).reduce((sum, val) => sum + val, 0);\n    }\n\n    merge(other) {\n        const newPayload = { ...this.payload };\n        for (const id in other.payload) {\n            newPayload[id] = Math.max(newPayload[id] || 0, other.payload[id]);\n        }\n        this.payload = newPayload;\n    }\n}\n```",
        "benefits": ["Enables offline-first collaboration", "No central server required for conflict resolution", "High availability and fault tolerance", "Guaranteed eventual consistency"],
        "best_practices": ["Use established CRDT libraries (e.g., Y.js, Automerge)", "Choose the right CRDT for the data type (e.g., G-Counter, PN-Counter, LWW-Register)", "Design for idempotency in operations", "Understand the memory footprint of your chosen CRDT"],
        "anti_patterns": ["Using CRDTs for data requiring strong, immediate consistency", "Implementing complex CRDTs from scratch without deep understanding", "Ignoring the need for garbage collection (tombstones) in sets and maps", "Assuming network delivery guarantees for operation-based CRDTs"],
        "learning_resources": ["[A comprehensive study of CRDTs (Paper)](https://pages.lip6.fr/Marc.Shapiro/papers/RR-7687.pdf)", "[CRDT.tech](https://crdt.tech/)", "[Awesome CRDT](https://github.com/alangibson/awesome-crdt)"]
    }
};

export const TECHNOLOGY_METADATA: Record<string, TechnologyMetadata> = {
    "Terraform": { tags: ["iac", "automation", "hcl", "hashicorp"], category: 'DevOps & CI/CD' },
    "AWS CDK": { tags: ["iac", "aws", "cloudformation", "typescript"], category: 'Cloud & Infrastructure' },
    "Pulumi": { tags: ["iac", "automation", "multi-cloud"], category: 'DevOps & CI/CD' },
    "Python": { tags: ["language", "scripting", "backend"], category: 'Backend' },
    "Bash": { tags: ["scripting", "shell", "linux"], category: 'DevOps & CI/CD' },
    "Debezium": { tags: ["cdc", "kafka", "data-streaming"], category: 'Data & AI' },
    "Kafka": { tags: ["streaming", "messaging", "pubsub"], category: 'Data & AI' },
    "PostgreSQL": { tags: ["database", "sql", "relational"], category: 'Backend' },
    "Docker": { tags: ["containers", "virtualization", "devops"], category: 'DevOps & CI/CD' },
    "GitHub Actions": { tags: ["ci-cd", "automation", "devops"], category: 'DevOps & CI/CD' },
    "ArgoCD": { tags: ["gitops", "kubernetes", "ci-cd"], category: 'DevOps & CI/CD' },
    "Helm": { tags: ["kubernetes", "packaging", "deployment"], category: 'DevOps & CI/CD' },
    "Kustomize": { tags: ["kubernetes", "configuration", "deployment"], category: 'DevOps & CI/CD' },
    "Trivy": { tags: ["security", "scanning", "containers"], category: 'Security' },
    "SonarQube": { tags: ["sast", "code-quality", "security"], category: 'Security' },
    "OWASP ZAP": { tags: ["dast", "security", "web-scanning"], category: 'Security' },
    "Apache Kafka": { tags: ["streaming", "messaging", "pubsub"], category: 'Data & AI' },
    "Apache Flink": { tags: ["stream-processing", "analytics", "stateful"], category: 'Data & AI' },
    "Avro": { tags: ["schema", "serialization", "kafka"], category: 'Data & AI' },
    "MLflow": { tags: ["mlops", "tracking", "deployment"], category: 'Data & AI' },
    "Optuna": { tags: ["hyperparameter-tuning", "ml", "optimization"], category: 'Data & AI' },
    "FastAPI": { tags: ["api", "python", "backend", "web"], category: 'Backend' },
    "Scikit-learn": { tags: ["ml", "python", "data-science"], category: 'Data & AI' },
    "Kubernetes": { tags: ["orchestration", "containers", "devops"], category: 'DevOps & CI/CD' },
    "AWS SAM": { tags: ["serverless", "aws", "iac"], category: 'Cloud & Infrastructure' },
    "Lambda": { tags: ["serverless", "faas", "aws"], category: 'Cloud & Infrastructure' },
    "Step Functions": { tags: ["serverless", "orchestration", "aws"], category: 'Cloud & Infrastructure' },
    "DynamoDB": { tags: ["nosql", "database", "aws"], category: 'Backend' },
    "LangChain": { tags: ["llm", "ai", "orchestration"], category: 'Data & AI' },
    "Vector DB": { tags: ["ai", "database", "embedding", "search"], category: 'Data & AI' },
    "AWS Route53": { tags: ["dns", "aws", "networking"], category: 'Cloud & Infrastructure' },
    "AWS RDS Global": { tags: ["database", "aws", "disaster-recovery"], category: 'Backend' },
    "Solidity": { tags: ["blockchain", "smart-contract", "ethereum"], category: 'Blockchain' },
    "Hardhat": { tags: ["blockchain", "ethereum", "testing"], category: 'Blockchain' },
    "TypeScript": { tags: ["language", "javascript", "frontend"], category: 'Frontend & Web' },
    "Ethers.js": { tags: ["blockchain", "ethereum", "web3"], category: 'Blockchain' },
    "AWS IoT Core": { tags: ["iot", "aws", "mqtt"], category: 'Cloud & Infrastructure' },
    "TimescaleDB": { tags: ["database", "time-series", "sql"], category: 'Backend' },
    "MQTT": { tags: ["iot", "messaging", "pubsub"], category: 'Cloud & Infrastructure' },
    "Qiskit": { tags: ["quantum", "python", "research"], category: 'Quantum Computing' },
    "AWS Batch": { tags: ["batch-processing", "aws", "hpc"], category: 'Cloud & Infrastructure' },
    "ELK Stack": { tags: ["logging", "monitoring", "observability"], category: 'DevOps & CI/CD' },
    "VirusTotal API": { tags: ["security", "threat-intelligence", "api"], category: 'Security' },
    "ONNX Runtime": { tags: ["ml", "inference", "edge-ai"], category: 'Data & AI' },
    "Azure IoT Edge": { tags: ["iot", "edge-ai", "azure"], category: 'Cloud & Infrastructure' },
    "WebSockets": { tags: ["real-time", "web", "networking"], category: 'Frontend & Web' },
    "Redis": { tags: ["cache", "database", "in-memory"], category: 'Backend' },
    "Databricks": { tags: ["spark", "data-lake", "analytics"], category: 'Data & AI' },
    "Delta Lake": { tags: ["data-lake", "spark", "storage-format"], category: 'Data & AI' },
    "SQL": { tags: ["database", "language", "query"], category: 'Backend' },
    "Istio": { tags: ["service-mesh", "kubernetes", "networking"], category: 'DevOps & CI/CD' },
    "Consul": { tags: ["service-discovery", "networking", "hashicorp"], category: 'DevOps & CI/CD' },
    "CUDA": { tags: ["gpu", "hpc", "parallel-computing"], category: 'HPC & Systems' },
    "Dask": { tags: ["python", "parallel-computing", "hpc"], category: 'HPC & Systems' },
    "Nvidia Drivers": { tags: ["gpu", "hardware", "hpc"], category: 'HPC & Systems' },
    "Kopf": { tags: ["kubernetes", "operator", "python"], category: 'DevOps & CI/CD' },
    "Kubernetes API": { tags: ["kubernetes", "api", "automation"], category: 'DevOps & CI/CD' },
    "Node.js": { tags: ["backend", "javascript", "runtime"], category: 'Backend' },
    "Chainlink": { tags: ["blockchain", "oracle", "web3"], category: 'Blockchain' },
    "Kyber": { tags: ["cryptography", "post-quantum", "security"], category: 'Security' },
    "Cryptography Libraries": { tags: ["security", "encryption", "libraries"], category: 'Security' },
    "Prometheus API": { tags: ["monitoring", "api", "observability"], category: 'DevOps & CI/CD' },
    "Prometheus": { tags: ["monitoring", "metrics", "observability"], category: 'DevOps & CI/CD' },
    "Grafana": { tags: ["visualization", "dashboards", "monitoring"], category: 'DevOps & CI/CD' },
    "Loki": { tags: ["logging", "monitoring", "grafana"], category: 'DevOps & CI/CD' },
    "Thanos": { tags: ["prometheus", "monitoring", "long-term-storage"], category: 'DevOps & CI/CD' },
    "Jinja2": { tags: ["templating", "python", "automation"], category: 'Backend' },
    "WeasyPrint": { tags: ["pdf", "reporting", "python"], category: 'Backend' },
    "APScheduler": { tags: ["scheduling", "python", "automation"], category: 'Backend' },
    "VitePress": { tags: ["static-site", "documentation", "vue"], category: 'Frontend & Web' },
    "Vue.js": { tags: ["frontend", "javascript", "framework"], category: 'Frontend & Web' },
    "Go": { tags: ["language", "backend", "systems"], category: 'Backend' },
    "Vault": { tags: ["secrets-management", "security", "hashicorp"], category: 'Security' },
    "gRPC": { tags: ["api", "rpc", "networking"], category: 'Backend' },
    "React": { tags: ["frontend", "javascript", "ui-library"], category: 'Frontend & Web' },
    "Next.js": { tags: ["frontend", "react", "framework"], category: 'Frontend & Web' },
    "Tailwind CSS": { tags: ["css", "frontend", "utility-first"], category: 'Frontend & Web' },
    "SQLite": { tags: ["database", "sql", "embedded"], category: 'Backend' },
    "FFmpeg": { tags: ["video", "audio", "multimedia"], category: 'HPC & Systems' },
    "ImageHash": { tags: ["image-processing", "hashing", "python"], category: 'Data & AI' },
    "AWS S3 SDK": { tags: ["aws", "storage", "sdk"], category: 'Cloud & Infrastructure' },
    "PyYAML": { tags: ["python", "yaml", "serialization"], category: 'Backend' },
    "Typer": { tags: ["cli", "python", "framework"], category: 'Backend' },
};

export const TECH_PURPOSES: Record<string, string> = {
    "Terraform": "Manages infrastructure as code declaratively.",
    "AWS CDK": "Defines cloud infrastructure using familiar programming languages.",
    "Pulumi": "An open-source infrastructure as code tool for creating, deploying, and managing cloud infrastructure.",
    "Python": "A versatile language for backend development, scripting, and data analysis.",
    "Bash": "A command language for scripting and automating tasks in Unix-like environments.",
    "Debezium": "A distributed platform for Change Data Capture (CDC).",
    "Kafka": "A distributed event streaming platform for high-throughput data pipelines.",
    "PostgreSQL": "A powerful, open-source object-relational database system.",
    "Docker": "A platform for developing, shipping, and running applications in containers.",
    "GitHub Actions": "Automates software workflows, including CI/CD, directly within GitHub.",
    "ArgoCD": "A declarative, GitOps continuous delivery tool for Kubernetes.",
    "Helm": "The package manager for Kubernetes, simplifying application deployment.",
    "Kustomize": "A tool to customize Kubernetes resource configuration.",
    "Trivy": "A simple and comprehensive vulnerability scanner for containers.",
    "SonarQube": "A platform for continuous inspection of code quality and security.",
    "OWASP ZAP": "A web application security scanner for finding vulnerabilities.",
    "Apache Kafka": "A distributed event streaming platform (same as Kafka).",
    "Apache Flink": "A framework for stateful computations over data streams.",
    "Avro": "A data serialization system for efficient, schema-driven data exchange.",
    "MLflow": "An open-source platform to manage the ML lifecycle.",
    "Optuna": "An automatic hyperparameter optimization framework.",
    "FastAPI": "A modern, fast web framework for building APIs with Python.",
    "Scikit-learn": "A simple and efficient tool for data mining and data analysis in Python.",
    "Kubernetes": "An open-source system for automating deployment, scaling, and management of containerized applications.",
    "AWS SAM": "An open-source framework for building serverless applications on AWS.",
    "Lambda": "An AWS serverless compute service that runs code in response to events.",
    "Step Functions": "An AWS service to coordinate multiple services into serverless workflows.",
    "DynamoDB": "A key-value and document database that delivers single-digit millisecond performance at any scale.",
    "LangChain": "A framework for developing applications powered by language models.",
    "Vector DB": "A database designed to store and query vector embeddings for similarity search.",
    "AWS Route53": "A scalable and highly available Domain Name System (DNS) web service.",
    "AWS RDS Global": "A feature for RDS that allows a single database to span multiple AWS Regions.",
    "Solidity": "A contract-oriented, high-level language for implementing smart contracts.",
    "Hardhat": "A development environment for Ethereum software.",
    "TypeScript": "A typed superset of JavaScript that compiles to plain JavaScript.",
    "Ethers.js": "A complete and compact library for interacting with the Ethereum Blockchain.",
    "AWS IoT Core": "A managed cloud service that lets connected devices easily and securely interact with cloud applications.",
    "TimescaleDB": "An open-source time-series SQL database.",
    "MQTT": "A lightweight, publish-subscribe network protocol that transports messages between devices.",
    "Qiskit": "An open-source SDK for working with quantum computers at the level of pulses, circuits, and application modules.",
    "AWS Batch": "A service to run batch computing workloads on the AWS Cloud.",
    "ELK Stack": "A combination of three open-source tools—Elasticsearch, Logstash, and Kibana—for log analysis.",
    "VirusTotal API": "An API to access VirusTotal's dataset of malware and threat intelligence.",
    "ONNX Runtime": "A cross-platform inferencing and training accelerator for ML models.",
    "Azure IoT Edge": "A fully managed service that deploys cloud intelligence locally on IoT edge devices.",
    "WebSockets": "A communication protocol providing full-duplex communication channels over a single TCP connection.",
    "Redis": "An in-memory data structure store, used as a database, cache, and message broker.",
    "Databricks": "A unified data analytics platform for massive-scale data engineering and collaborative data science.",
    "Delta Lake": "An open-source storage layer that brings ACID transactions to Apache Spark and big data workloads.",
    "SQL": "A standard language for storing, manipulating and retrieving data in databases.",
    "Istio": "An open platform to connect, manage, and secure microservices.",
    "Consul": "A service networking solution to connect and secure services across any runtime platform.",
    "CUDA": "A parallel computing platform and programming model developed by Nvidia for general computing on GPUs.",
    "Dask": "A flexible library for parallel computing in Python.",
    "Nvidia Drivers": "Software that allows the operating system to communicate with Nvidia GPU hardware.",
    "Kopf": "A Python framework to write Kubernetes operators in a few lines of code.",
    "Kubernetes API": "The primary way to interact with a Kubernetes cluster to manage workloads and resources.",
    "Node.js": "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
    "Chainlink": "A decentralized oracle network that enables smart contracts to securely access off-chain data feeds.",
    "Kyber": "A key-encapsulation mechanism (KEM) chosen as a standard for post-quantum cryptography by NIST.",
    "Cryptography Libraries": "Libraries that provide implementations of cryptographic algorithms.",
    "Prometheus API": "The API for querying metrics from a Prometheus monitoring server.",
    "Prometheus": "An open-source systems monitoring and alerting toolkit.",
    "Grafana": "An open-source platform for monitoring and observability, allowing you to query, visualize, alert on, and understand your metrics.",
    "Loki": "A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.",
    "Thanos": "An open-source, highly available Prometheus setup with long-term storage capabilities.",
    "Jinja2": "A fast, expressive, extensible templating engine for Python.",
    "WeasyPrint": "A smart solution helping web developers to create PDF documents from HTML and CSS.",
    "APScheduler": "A Python library that lets you schedule your Python code to be executed later, either just once or periodically.",
    "VitePress": "A static site generator designed for building fast, content-centric websites.",
    "Vue.js": "A progressive framework for building user interfaces.",
    "Go": "An open-source programming language that makes it easy to build simple, reliable, and efficient software.",
    "Vault": "A tool for securely accessing secrets.",
    "gRPC": "A high-performance, open-source universal RPC framework.",
    "React": "A JavaScript library for building user interfaces.",
    "Next.js": "A React framework for building full-stack web applications.",
    "Tailwind CSS": "A utility-first CSS framework for rapidly building custom user interfaces.",
    "SQLite": "A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.",
    "FFmpeg": "A complete, cross-platform solution to record, convert and stream audio and video.",
    "ImageHash": "A Python library for perceptual image hashing.",
    "AWS S3 SDK": "The AWS SDK for interacting with the S3 object storage service.",
    "PyYAML": "A YAML parser and emitter for Python.",
    "Typer": "A library for building great Command Line Interfaces (CLIs).",
};

export const PROBLEM_CONTEXTS: Record<string, ProblemContext> = {
    "default": {
        title: "Default Problem Context",
        context: "A default problem context for projects where a specific one is not defined. This project aims to solve a common business problem through the application of modern technology and software engineering principles.",
        business_impact: ["Demonstrates a key technology pattern.", "Provides a reusable template for similar problems.", "Improves operational efficiency or user experience."],
        solution_approach: ["Leverage established cloud services and open-source tools.", "Follow industry best practices for security, reliability, and maintainability.", "Provide clear documentation and examples."],
        learning_objectives: ["Understand the core concepts of the technologies used.", "Learn how to apply architectural patterns to solve real-world problems.", "Gain experience with development and deployment workflows."]
    },
    "aws": {
        title: "Managing Cloud Infrastructure at Scale",
        context: "Provisioning and managing cloud infrastructure manually is error-prone, inconsistent, and does not scale. To build reliable systems, infrastructure must be treated as code—versioned, tested, and deployed through automated pipelines.",
        business_impact: ["**Reduced Risk:** Eliminates configuration drift and reduces human error.", "**Increased Velocity:** Enables rapid provisioning of consistent environments.", "**Improved Governance:** Provides an auditable trail of all infrastructure changes."],
        solution_approach: ["**Declarative IaC:** Use a tool like Terraform to define the desired state of the infrastructure.", "**Modularity:** Break down infrastructure into reusable, composable modules.", "**CI/CD Integration:** Automate the deployment of infrastructure changes through a GitOps workflow."],
        learning_objectives: ["Mastering Infrastructure as Code (IaC) with Terraform.", "Designing and implementing a secure and scalable multi-AZ VPC.", "Automating infrastructure deployment with CI/CD pipelines."]
    },
    "kubernetes": {
        title: "Deploying and Managing Containerized Applications",
        context: "While containers solve the problem of packaging applications, managing them in production—handling scaling, networking, and resilience—is complex. A container orchestrator is needed to automate these operational tasks.",
        business_impact: ["**High Availability:** Automatically restarts failed containers and reschedules them.", "**Scalability:** Scales applications horizontally based on demand.", "**Developer Productivity:** Abstracts away infrastructure, allowing teams to focus on application logic."],
        solution_approach: ["**Declarative Management:** Use Kubernetes to define the desired state of applications via YAML manifests.", "**GitOps:** Use a tool like ArgoCD to sync the cluster state from a Git repository.", "**Service Mesh:** Implement a service mesh like Istio for advanced traffic management and security."],
        learning_objectives: ["Understanding core Kubernetes concepts (Pods, Deployments, Services).", "Implementing automated CI/CD pipelines with GitOps.", "Managing application configuration and secrets securely."]
    },
    "database": {
        title: "Ensuring Data Integrity and Availability",
        context: "Databases are the core of most applications, but migrating them, ensuring they are highly available, and capturing changes in real-time are significant engineering challenges.",
        business_impact: ["**Zero Downtime:** Perform critical database migrations without impacting users.", "**Data Resilience:** Protect against data loss with robust backup and disaster recovery strategies.", "**Real-time Insights:** Enable streaming analytics by capturing database changes as they happen."],
        solution_approach: ["**Change Data Capture (CDC):** Use a tool like Debezium to stream database changes to Kafka.", "**Automated Failover:** Implement multi-region replication for disaster recovery.", "**Validation and Rollback:** Build automated data validation and rollback procedures into migration workflows."],
        learning_objectives: ["Implementing zero-downtime database migrations using CDC.", "Configuring high-availability and disaster recovery for relational databases.", "Building real-time data pipelines with Kafka."]
    },
    "deployment": {
        title: "Secure and Scalable Application Deployment",
        context: "Deploying applications securely and consistently, especially at scale, is fraught with challenges. Storing long-lived credentials in CI/CD systems creates a large attack surface, manual processes introduce human error, and ensuring that only compliant changes reach production is difficult to enforce.",
        business_impact: ["**Reduced Security Risk:** Eliminates static credentials from CI environments.", "**Increased Deployment Velocity:** Enables safe, automated, high-frequency deployments.", "**Enhanced Compliance:** Provides an auditable, policy-driven pipeline for all production changes."],
        solution_approach: ["**Hardened Runners:** Use minimal, single-purpose deployment runners isolated from the CI system.", "**Just-in-Time Credentials:** Integrate with a secrets manager like Vault to generate short-lived credentials for each deployment.", "**Policy as Code:** Use a tool like OPA to enforce deployment policies before execution."],
        learning_objectives: ["Implementing secure CI/CD patterns with short-lived credentials.", "Building hardened, minimal-footprint container images.", "Using gRPC and mTLS for secure inter-service communication."]
    },
    "self-hosted": {
        title: "Private, User-Centric Photo Sharing",
        context: "Commercial photo sharing platforms often prioritize engagement and data collection over user privacy and simplicity. For sharing sensitive family photos, especially with less tech-savvy relatives, a simpler, private, and more accessible alternative is needed. The challenge is to create an application that is easy to deploy and manage without technical expertise, while providing a user-friendly and accessible interface.",
        business_impact: ["**Data Privacy & Ownership:** Users retain full control over their personal photos.", "**Improved Accessibility:** Enables elderly or non-technical family members to participate in digital photo sharing.", "**Cost-Effective:** Avoids recurring subscription fees of commercial cloud services."],
        solution_approach: ["**Zero-Configuration Deployment:** Package the application as a single Docker container with an embedded database (SQLite) for easy setup.", "**Accessibility First Design:** Build the UI following WCAG guidelines with high contrast, large fonts, and simple navigation.", "**Passwordless Authentication:** Use magic links for login to remove the barrier of password management."],
        learning_objectives: ["Designing applications for self-hosting with minimal operational overhead.", "Building highly accessible web interfaces (WCAG).", "Choosing appropriate technology (e.g., SQLite) for simple, single-node applications."]
    },
    "video-processing": {
        title: "Efficiently Managing Large-Scale Video Archives",
        context: "Organizations and individuals with large video libraries face the challenge of identifying duplicate files, which consume significant storage space. Simple checksums (MD5, SHA) fail to detect duplicates that have been re-encoded, resized, or slightly edited. A more sophisticated approach is needed to analyze video content across disparate storage systems (local, S3, GCS) efficiently.",
        business_impact: ["**Storage Cost Reduction:** Frees up significant storage space by identifying and removing redundant video files.", "**Improved Media Management:** Creates a clean, de-duplicated library, making it easier to find and manage assets.", "**Operational Efficiency:** Automates a tedious manual task."],
        solution_approach: ["**Perceptual Hashing:** Use algorithms (like dHash) on video keyframes to identify visually identical content regardless of format or encoding.", "**Parallel Processing:** Leverage multiple CPU cores to process video files in parallel, speeding up scans.", "**Persistent Caching:** Store file metadata and hashes in a local database (SQLite) to avoid re-processing files on subsequent scans."],
        learning_objectives: ["Implementing perceptual hashing for multimedia analysis.", "Using FFmpeg for automated video processing.", "Building efficient, parallelized command-line tools in Python."]
    },
    "automation": {
        title: "Standardizing and Generating Operational Playbooks",
        context: "As infrastructure and operations scale, maintaining consistency across dozens or hundreds of configuration files, runbooks, and deployment scripts becomes a major challenge. Manual creation and updates lead to configuration drift, errors, and out-of-date documentation. There is a need to generate these assets from a single, high-level source of truth.",
        business_impact: ["**Enforced Consistency:** Ensures all generated playbooks and documents adhere to a standard template and include best practices.", "**Reduced Human Error:** Automates the creation of complex configurations, minimizing manual mistakes.", "**Increased Agility:** Allows for rapid generation of new playbooks and documentation when requirements change."],
        solution_approach: ["**Declarative Input:** Define the desired state and parameters in a simple, high-level format like YAML.", "**Templating Engine:** Use a powerful templating engine like Jinja2 to render different output formats (Ansible, Markdown, etc.) from a common set of templates.", "**Schema Validation:** Enforce the structure of the input YAML with a tool like Pydantic to provide clear error messages and prevent invalid configurations."],
        learning_objectives: ["Building template-based code and documentation generators.", "Using Jinja2 for complex templating logic.", "Creating user-friendly and robust CLIs with Python (e.g., Typer)."]
    }
};

export const ARCHITECTURE_DEFINITIONS: Record<string, ArchitectureDefinition> = {
    "default": {
        title: "Standard Three-Tier Architecture",
        layers: {
            "Presentation": "Handles user interaction and renders the UI. (e.g., React frontend)",
            "Application/Logic": "Contains the core business logic. (e.g., Python FastAPI backend)",
            "Data": "Responsible for data persistence and retrieval. (e.g., PostgreSQL database)"
        },
        data_flow: ["User request arrives at the Presentation layer.", "The request is forwarded to the Application layer for processing.", "The Application layer interacts with the Data layer to read or write data.", "A response is returned through the layers to the user."],
        real_world_scenario: "A typical **e-commerce website** where users browse products (Presentation), the backend handles orders and payments (Application), and data is stored in a database (Data)."
    },
    "aws": {
        title: "High-Availability AWS Web Architecture",
        layers: {
            "Edge": "Route 53 for DNS routing and CloudFront for global content caching.",
            "Load Balancing": "Application Load Balancer (ALB) to distribute traffic across multiple Availability Zones.",
            "Compute": "Auto Scaling Group of EC2 instances or an EKS cluster for containerized applications.",
            "Data": "RDS PostgreSQL in a Multi-AZ configuration for database resilience."
        },
        data_flow: ["A user's DNS query is resolved by Route 53 to the nearest CloudFront edge location.", "CloudFront serves cached content or forwards the request to the ALB.", "The ALB routes the request to a healthy instance in the compute layer.", "The application instance processes the request, interacting with the RDS database."],
        real_world_scenario: "Hosting a **mission-critical web application** that must remain available even if an entire AWS data center fails."
    },
    "kubernetes": {
        title: "GitOps-Managed Microservices Architecture",
        layers: {
            "CI/CD": "GitHub Actions for building and testing, pushing images to a container registry.",
            "Source of Truth": "A Git repository containing all Kubernetes manifests and Helm charts.",
            "Continuous Delivery": "ArgoCD running in the cluster, continuously syncing the live state with the Git repository.",
            "Application Runtime": "Multiple microservices running as Deployments within the Kubernetes cluster, communicating via Services."
        },
        data_flow: ["A developer pushes a code change to the application repository, triggering GitHub Actions.", "The CI pipeline builds a new container image and updates the version in the manifest Git repository.", "ArgoCD detects the change in the manifest repository.", "ArgoCD applies the updated manifests to the Kubernetes cluster, triggering a rolling deployment of the new version."],
        real_world_scenario: "A development team managing a **complex microservices application** with a fully automated, auditable, and secure deployment pipeline."
    },
    "deployment": {
        title: "Secure, Isolated Deployment Runner Architecture",
        layers: {
            "Orchestrator": "A CI/CD system (e.g., GitHub Actions) that triggers deployments but holds no long-lived credentials.",
            "Secure Runner": "A hardened, minimal Go application running in a distroless container. Listens for gRPC requests.",
            "Secrets Manager": "HashiCorp Vault, responsible for generating dynamic, short-lived credentials for each deployment task.",
            "Execution Environment": "Ephemeral, unprivileged containers where the actual deployment scripts run."
        },
        data_flow: ["The Orchestrator sends a deployment request to the Secure Runner via mTLS-secured gRPC.", "The Runner authenticates with Vault using its identity.", "The Runner requests short-lived credentials from Vault scoped to the specific task.", "The Runner injects credentials into a new, isolated Execution Environment and runs the deployment script.", "Logs are streamed back to the Orchestrator."],
        real_world_scenario: "An enterprise automating **PCI-compliant software deployments** where CI/CD systems are forbidden from having direct access to production credentials."
    },
    "self-hosted": {
        title: "Zero-Configuration Self-Hosted Web Application",
        layers: {
            "Frontend/UI": "A highly accessible React/Next.js single-page application.",
            "Backend API": "Serverless functions provided by Next.js API Routes, handling uploads and metadata.",
            "Data Persistence": "An embedded SQLite database, stored as a single file on the host's filesystem.",
            "Containerization": "Docker, packaging the entire application and its dependencies into a single, portable image."
        },
        data_flow: ["User accesses the Next.js frontend in their browser.", "The React UI makes API calls to the Next.js API routes on the same server.", "The API routes interact directly with the SQLite database file to manage users and photo metadata.", "Uploaded photos are stored directly on the host's filesystem in a mapped volume."],
        real_world_scenario: "A non-technical user deploying a **private photo gallery** on a home server or NAS with a single `docker run` command, without needing to configure a separate database."
    },
    "video-processing": {
        title: "CLI-based Parallelized Media Processing Engine",
        layers: {
            "User Interface": "A Command-Line Interface (CLI) built with a framework like Typer for user interaction.",
            "Core Orchestrator": "A Python application that manages file discovery, task distribution, and reporting.",
            "Worker Pool": "A pool of parallel processes that execute the CPU/IO-intensive tasks.",
            "Processing Tools": "External binaries like FFmpeg, called by worker processes to extract frames/audio.",
            "State Cache": "A local SQLite database for storing file hashes and metadata to prevent re-work."
        },
        data_flow: ["User initiates a scan via the CLI.", "The Core Orchestrator discovers video files in the target location (local or cloud).", "For each new or modified file, a task is sent to the Worker Pool.", "A worker process uses FFmpeg to extract keyframes, then generates perceptual hashes.", "The hashes and metadata are stored in the SQLite cache.", "Once all files are processed, the Orchestrator queries the cache to find duplicates and generates a report."],
        real_world_scenario: "A video editor running a command to **find and clean up duplicate clips** across several external hard drives and a cloud storage bucket."
    },
    "automation": {
        title: "Template-Based Configuration Generator",
        layers: {
            "Input": "A user-provided YAML file containing high-level parameters.",
            "Validation": "A Pydantic model that parses and validates the YAML file against a strict schema.",
            "Templating Engine": "Jinja2, which loads a specified template file.",
            "Rendering Logic": "A core Python script that loads the validated data and renders the template.",
            "Output": "The generated file in the desired format (e.g., Ansible YAML, Markdown)."
        },
        data_flow: ["User runs the CLI, providing an input YAML file and a template.", "The application loads the YAML and uses a Pydantic model to validate its structure and types.", "If valid, the data is passed as context to the Jinja2 templating engine.", "Jinja2 processes the template, injecting the data and executing any logic (loops, conditionals).", "The final rendered string is written to an output file."],
        real_world_scenario: "A DevOps team generating **standardized Ansible playbooks** for new microservices by filling out a simple `service.yml` file, ensuring all required security settings and monitoring configurations are included automatically."
    }
};
