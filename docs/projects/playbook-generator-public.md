# Playbook-Generator Public

**Status:** Substantial | **Completion:** 65%

## Description
An automation tool that generates standardized operational playbooks (Ansible, Markdown) from a high-level YAML definition.

## Key Features
- Template-based generation
- Support for multiple output formats (Ansible, Markdown)
- Schema validation for input files (Pydantic)
- Extensible with custom modules and filters
- CLI for easy integration into pipelines

## Technologies
Python, Jinja2, PyYAML, Typer

## README

## Playbook-Generator

An automation tool to enforce consistency and best practices by generating operational playbooks from a simple, high-level YAML definition. It supports multiple output formats, like Ansible playbooks for infrastructure automation and Markdown documents for runbooks.

### Architecture
- **Core:** A Python CLI built with Typer.
- **Templating:** Uses the Jinja2 templating engine to render playbooks from templates.
- **Input Validation:** Leverages Pydantic to define and enforce a strict schema for the input YAML files, providing clear error messages.

### Key Features
- **Standardization:** Ensures all playbooks follow a consistent structure and include necessary guardrails.
- **Extensible:** New playbook formats can be supported by simply adding a new Jinja2 template.
- **Validation:** Prevents errors by validating input YAML against a Pydantic schema before generation.

### Usage
1.  **Define Configuration:** Create a `config.yml` file with the high-level parameters for your task.
2.  **Generate Playbook:** `playbook-gen --input config.yml --template ansible-deploy.j2 --output deploy.yml`
3.  **Generate Documentation:** `playbook-gen --input config.yml --template markdown-runbook.md.j2 --output runbook.md`

## Architecture Decisions

### ADR-001: Choice of CLI Framework

**Status:** Accepted

**Context:** The application requires a clean and user-friendly Command Line Interface (CLI). We considered using Python's built-in `argparse`, `Click`, and `Typer`.

**Decision:** We will use **Typer**.

**Consequences:**
*   **Pros:** Typer is built on top of Click and provides a modern, intuitive way to build CLIs using Python type hints. This reduces boilerplate code and makes the CLI self-documenting. It automatically generates excellent help output.
*   **Cons:** Adds an external dependency. It is a newer library than `argparse` or `Click`, though it is stable and well-supported.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** Not directly applicable.
*   **Tampering:** An attacker modifies a Jinja2 template to inject malicious commands into the generated playbook. **Mitigation:** Templates should be stored in a version-controlled Git repository with branch protection rules. Use checksums to verify template integrity.
*   **Repudiation:** A user denies creating a playbook with a specific configuration. **Mitigation:** The input YAML file, when stored in Git, provides a clear audit trail of who defined the playbook's parameters.
*   **Information Disclosure:** Sensitive data (e.g., passwords) is accidentally hardcoded into an input YAML file. **Mitigation:** Implement a secret scanning pre-commit hook in the repository where input files are stored. The documentation will strongly advise using a secrets management tool (like Vault) in the generated playbooks instead of raw values.
*   **Denial of Service:** A malformed or deeply nested YAML input file causes the generator to crash or consume excessive memory. **Mitigation:** Use Pydantic to strictly validate the input YAML against a defined schema before processing. Implement resource limits if running the generator in a containerized environment.
*   **Elevation of Privilege:** A user crafts a malicious input value that exploits a vulnerability in the Jinja2 templating engine to execute arbitrary code on the machine running the generator. **Mitigation:** Keep all dependencies (especially Jinja2 and PyYAML) up-to-date. Run the generator with the minimum necessary permissions. Consider running the generation step in a sandboxed environment.

