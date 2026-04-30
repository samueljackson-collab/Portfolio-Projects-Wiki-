# Advanced AI Chatbot

**Status:** Substantial | **Completion:** 55%

## Description
RAG chatbot indexing portfolio assets with tool-augmented workflows.

## Key Features
- Retrieval-Augmented Generation
- WebSocket streaming
- Context awareness

## Technologies
Python, FastAPI, LangChain, Vector DB

## README

## Advanced AI Chatbot with RAG

This project builds an AI chatbot that uses Retrieval-Augmented Generation (RAG) to provide answers based on a private knowledge base (in this case, the project portfolio data).

### How it Works
1.  **Indexing:** All project documentation is chunked, converted to vector embeddings, and stored in a Vector Database.
2.  **Retrieval:** When a user asks a question, the question is embedded and used to perform a similarity search in the vector DB to find the most relevant document chunks.
3.  **Augmentation:** The retrieved chunks are added to the prompt as context for the Large Language Model (LLM).
4.  **Generation:** The LLM generates an answer based on the provided context, ensuring the response is grounded in facts from the knowledge base.

## Architecture Decisions

### ADR-001: Choice of Vector Database

**Status:** Accepted

**Context:** The RAG system requires a vector database to store and efficiently query document embeddings. Options include managed services, self-hosted open-source databases, and in-memory libraries.

**Decision:** We will start with an in-memory library like **FAISS** for its simplicity and performance in a single-node setup. This allows for rapid prototyping.

**Consequences:**
*   **Pros:** Extremely fast, no operational overhead, easy to integrate into a Python application.
*   **Cons:** Does not scale beyond the memory of a single machine. Not suitable for very large datasets or production use cases requiring high availability. We will plan to migrate to a scalable solution like Pinecone or a self-hosted ChromaDB as the project matures.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** A user impersonates another to access their chat history. **Mitigation:** Implement standard user authentication and authorization.
*   **Tampering:** An attacker modifies the documents in the vector database to poison the RAG context. **Mitigation:** Secure the indexing pipeline and database with strict access controls. Perform regular data integrity checks.
*   **Repudiation:** A user denies sending a harmful prompt. **Mitigation:** Log all user prompts and LLM responses for auditing.
*   **Information Disclosure:** The LLM reveals sensitive information from the source documents that the user should not have access to. **Mitigation:** Implement access controls on the document retrieval step. Ensure the retriever only returns documents the user is authorized to see.
*   **Denial of Service:** Users submit complex queries that cause excessive computational load on the LLM or vector DB. **Mitigation:** Implement rate limiting and query complexity analysis.
*   **Elevation of Privilege:** A user crafts a prompt (prompt injection) that tricks the LLM into using a tool to perform an unauthorized action. **Mitigation:** Carefully validate all inputs passed to tools. Use a sandboxed environment for tool execution. Fine-tune the LLM to be robust against injection attacks.

