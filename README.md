# Portfolio Projects Wiki

**An interactive knowledge base for exploring software engineering projects — no coding required.**

> **Try it now (live, no setup needed):**
> **[https://samueljackson-collab.github.io/Portfolio-Projects-Wiki-/](https://samueljackson-collab.github.io/Portfolio-Projects-Wiki-/)**

---

## What Is This?

This is a documentation website for a portfolio of software engineering projects. Each project has its own page explaining what it does, how it was built, what technologies it uses, and what decisions were made along the way.

Think of it like Wikipedia — but for one developer's projects. Click a project name, and you get a full breakdown of that project in plain language alongside technical details.

**Who is it for?**
- **Recruiters and hiring managers** who want to understand what projects exist and what skills they demonstrate.
- **Developers** who want to explore the architecture and implementation details.
- **Anyone curious** about what these projects actually do.

---

## What Does It Look Like?

The app has two panels: a sidebar on the left for browsing, and a detail view on the right that shows everything about the selected project.

```
┌─────────────────────┬──────────────────────────────────────────────────┐
│  🔍 Search projects │  AWS Infrastructure Automation                   │
│─────────────────────│  ● Production Ready  ████████████████████  100% │
│  📁 Production Ready│                                                  │
│    ▶ AWS Infra...   │  WHAT THIS PROJECT DOES                          │
│    ▶ Database Mig.. │  Automates the creation of an entire AWS         │
│    ▶ Kubernetes CI..│  cloud environment — servers, networking,        │
│    ▶ DevSecOps Pipe.│  databases — from code. No manual clicking       │
│─────────────────────│  in the AWS console required.                    │
│  📁 Advanced        │                                                  │
│    ▶ Blockchain Pl..│  TECHNOLOGIES USED                               │
│    ▶ FamilyBridge.. │  [Terraform] [AWS CDK] [Python] [Bash]           │
│─────────────────────│                                                  │
│  📁 Substantial     │  KEY HIGHLIGHTS                                  │
│    ▶ MLOps Platform │  • Multi-AZ VPC architecture                     │
│    ▶ AI Chatbot...  │  • Managed EKS (Kubernetes) cluster              │
│    ▶ Data Streaming │  • RDS PostgreSQL with automated backups         │
│    ...              │                                                  │
│─────────────────────│  ARCHITECTURE DECISIONS                          │
│  📁 Basic           │  Why use three IaC tools (Terraform, CDK,        │
│    ▶ Multi-Cloud... │  Pulumi)? Read the reasoning here.               │
│    ▶ Autonomous Dev │                                                  │
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

## How to Use This Wiki (Step-by-Step)

No installation. No accounts. Just open the link.

**Step 1 — Open the wiki**
Go to [https://samueljackson-collab.github.io/Portfolio-Projects-Wiki-/](https://samueljackson-collab.github.io/Portfolio-Projects-Wiki-/)

**Step 2 — Pick a project from the left sidebar**
Projects are grouped by how complete they are:
- **Production Ready** — fully built and deployed
- **Advanced** — nearly complete, with solid foundations
- **Substantial** — significant progress, most core features built
- **Basic / Planned** — early-stage or conceptual

Click any project name. The right panel immediately loads that project's full details.

**Step 3 — Read the project page**
Each project page includes:
- **What it does** — plain English description
- **Completion status** — shown as a progress bar (0–100%)
- **Technologies used** — every tool and language involved
- **Key features** — the main things the project can do
- **Architecture overview** — how the pieces fit together
- **Architecture Decision Records (ADRs)** — *why* specific technical choices were made (not just *what*)
- **Security analysis** — a STRIDE threat model covering potential risks and how they're mitigated
- **CI/CD workflow** — the automated build and deployment pipeline (where applicable)
- **Roadmap** — what's planned next for the project

**Step 4 — Search for anything**
Use the search box at the top of the sidebar to filter by:
- Project name (e.g., "Kubernetes")
- Technology (e.g., "Terraform", "Python")
- Tag or category (e.g., "security", "mlops", "blockchain")

Results filter in real time as you type.

**Step 5 — Explore the technology deep-dives**
Some project pages include deeper explanations of technologies like Terraform, Kafka, or ArgoCD. These explain what the tool is, why it was chosen, real-world use cases, and pitfalls to avoid.

---

## Project Highlights

Here are some of the most complete projects you can explore right now:

| Project | What It Does | Status |
|---------|-------------|--------|
| AWS Infrastructure Automation | Automates building an entire AWS cloud environment from code | ✅ Production Ready |
| Kubernetes CI/CD Pipeline | Automated code-to-deployment pipeline using GitOps | ✅ Production Ready |
| Database Migration Platform | Migrates databases with zero downtime using Change Data Capture | ✅ Production Ready |
| DevSecOps Pipeline | CI/CD pipeline with automated security scanning built in | ✅ Production Ready |
| Secure-Deployer | Hardened deployment runner using short-lived credentials | ✅ Production Ready |
| Advanced Monitoring & Observability | Unified metrics, logs, and traces with Prometheus and Grafana | ✅ Production Ready |
| FamilyBridge Photos | Self-hosted photo sharing app designed for elderly users | 🔶 Advanced |
| Advanced AI Chatbot | RAG-based chatbot that answers questions from a private knowledge base | 🔷 Substantial |
| MLOps Platform | End-to-end machine learning workflow with drift detection | 🔷 Substantial |

---

## What Each Status Means

| Status | Meaning |
|--------|---------|
| ✅ Production Ready | Fully built, tested, documented, and deployable |
| 🔶 Advanced | Core functionality complete, minor gaps remain |
| 🔷 Substantial | Most features implemented, still in active development |
| 🟡 Basic | Foundation laid, significant work remaining |
| 📋 Planned | Scoped and designed, not yet built |

---

## Running It Locally (For Developers)

> This section is only needed if you want to run the wiki on your own machine. Most people can just use the live link above.

### System Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18 or newer |
| npm | 9 or newer |
| Browser | Chrome, Firefox, or Safari (recent version) |

### Quick Start

**1. Install dependencies**
```bash
npm install
```

**2. Start the development server**
```bash
npm run dev
```

**3. Open in your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

**4. Build for production**
```bash
npm run build
```

**5. Preview the production build**
```bash
npm run preview
```

---

## Architecture Overview (For Developers)

```
┌────────────────────────────────────────────────────────────┐
│                    React Single-Page App                  │
│                                                            │
│   ┌────────────────────┐      ┌────────────────────────┐   │
│   │ Sidebar            │ ---> │ ProjectDetail          │   │
│   │ - status groups    │      │ - feature sections     │   │
│   │ - fuzzy search     │      │ - architecture notes   │   │
│   └─────────┬──────────┘      └───────────┬────────────┘   │
│             │                             │                │
│             ▼                             ▼                │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ App.tsx                                              │  │
│   │ - selected project state                            │  │
│   │ - mobile sidebar behavior                          │  │
│   │ - root layout                                      │  │
│   └─────────┬────────────────────────────────────────────┘  │
│             │                                               │
│             ▼                                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ constants.ts + types.ts                              │  │
│   │ - all project data (29 projects)                    │  │
│   │ - TypeScript interfaces                             │  │
│   └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Data & Rendering Flow
Project data loads from `constants.ts` → App initializes state → Sidebar renders grouped navigation → User selects a project → `ProjectDetail` renders that project's sections → Visualization components render additional context

### Project Structure
```
.
├── App.tsx              # Root component, state management
├── index.tsx            # React entry point
├── index.html           # HTML shell
├── constants.ts         # All project data (29 projects)
├── types.ts             # TypeScript interfaces
├── vite.config.ts       # Build configuration
├── package.json
└── components/
    ├── Sidebar.tsx          # Navigation + search
    ├── ProjectDetail.tsx    # Main project view
    ├── ProjectInsights.tsx  # Analytics and insights
    ├── TechStackGraph.tsx   # D3 technology visualization
    ├── ProgressBar.tsx      # Completion percentage bar
    ├── CodeBlock.tsx        # Syntax-highlighted code
    ├── Icons.tsx            # Icon components
    └── ErrorBoundary.tsx    # Error handling
```

### Technology Stack

| Technology | Version | Role |
|------------|---------|------|
| React | 19.2.x | UI rendering |
| TypeScript | 5.8.x | Type safety |
| Vite | 6.x | Dev server and build tooling |
| D3 | 7.x | Graph and visualization rendering |
| Tailwind CSS (CDN) | Runtime | Utility-first UI styling |

---

## Troubleshooting (For Developers)

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| App not loading on `localhost:3000` | Dev server not running or port conflict | Run `npm run dev` and check for port conflicts |
| Search feels slow | Expected — search uses a short debounce delay | Pause briefly after typing |
| Build fails | TypeScript error or missing dependency | Run `npm install` then `npm run build` again |
| Blank project page | Invalid project state | Refresh the page; check `constants.ts` data |

**Debug tips:**
- Run `npm run build` before deploying to catch type errors.
- Check the browser console (F12) for runtime errors.
- Run `npm test` to run the unit test suite.

---

## Adding or Updating Projects (For Developers)

All project data lives in `constants.ts`. Each project follows the `Project` interface defined in `types.ts`. To add a project:

1. Add a new entry to the `ALL_PROJECTS_DATA` array in `constants.ts`.
2. Follow the existing structure: `id`, `name`, `slug`, `description`, `status`, `completion_percentage`, `tags`, `technologies`, `features`, `key_takeaways`, `readme`.
3. Run `npm run build` to validate your changes compile correctly.

---

## Security & Operational Notes (For Developers)

- The app renders entirely client-side — no server, no database, no user data collected.
- Dev server binds to `0.0.0.0:3000`, reachable on your local network (useful for testing on phones/tablets).
- Tailwind CSS loads from CDN in `index.html`. For offline environments, install Tailwind locally.
- Never commit secrets in `.env` files. The `GEMINI_API_KEY` config in `vite.config.ts` is reserved for future AI feature work; the current app does not make API calls.

---

## Roadmap

- [ ] Add URL-based routing so you can share a direct link to a specific project.
- [ ] Add export/share modes for project summaries (PDF, shareable link).
- [ ] Externalize project content to Markdown files or a CMS for easier editing without code changes.
- [ ] Improve keyboard navigation and accessibility coverage.
- [ ] Add tests for search filtering and project grouping logic.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Make focused changes — update `constants.ts` for data changes, components for UI changes.
3. Validate with `npm run build` before opening a PR.
4. Update this README if you change architecture or behavior.

---

## License

No license file is currently included. Add a `LICENSE` file before distributing publicly.
