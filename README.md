# Portfolio Projects Wiki

Interactive, Wiki.js-inspired portfolio documentation studio for developers, recruiters, and technical reviewers.

Explore structured, project-oriented knowledge pages with architecture context, CI/CD workflows, ADRs, threat models, progress indicators, and technology deep dives — all in one place.

**29 projects · 20 Production Ready · 9 Advanced · 0 Planned · 0 Basic**

---

## Table of Contents
- [Live Demos](#live-demos)
- [Why This Exists](#why-this-exists)
- [What You Get](#what-you-get)
- [Feature Breakdown](#feature-breakdown)
- [Architecture Overview](#architecture-overview)
- [Data & Rendering Flow](#data--rendering-flow)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Detailed Setup Guide](#detailed-setup-guide)
- [How to Use the App](#how-to-use-the-app)
- [Configuration Reference](#configuration-reference)
- [Adding a New Project](#adding-a-new-project)
- [Project Categories](#project-categories)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)
- [Security & Operational Notes](#security--operational-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Live Demos

Full walkthrough guides with screenshots and actual code evidence are in [`demos/`](./demos/):

| Demo | File | What it shows |
|------|------|---------------|
| Complete feature walkthrough | [`demos/DEMO_GUIDE.md`](./demos/DEMO_GUIDE.md) | All 10 app features with screenshots, actual code, and output evidence |
| Practical setup & use | [`demos/SETUP_GUIDE.md`](./demos/SETUP_GUIDE.md) | Step-by-step setup for dev, production build, tests, and deployment |

### Demo: App Home State
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Portfolio Projects Wiki                                          ☰ Menu    │
├──────────────────────┬──────────────────────────────────────────────────────┤
│ 🔍 Search projects…  │                                                      │
│                      │     ┌─────────────────────────────────────────┐     │
│ ▼ Production Ready  │     │  SELECT A PROJECT                       │     │
│   AWS Infrastructure│     │  Use the sidebar to browse 29 projects  │     │
│   Database Migration│     │  grouped by maturity status, or search  │     │
│   Kubernetes CI/CD  │     │  by name, technology, or tag.           │     │
│   DevSecOps Pipeline│     │                                         │     │
│   Real-time Streaming│    │  ◉ 29 Projects   ◉ 29 Technologies      │     │
│   MLOps Platform    │     └─────────────────────────────────────────┘     │
│   [+14 more…]       │                                                      │
│                      │                                                      │
│ ▼ Advanced          │                                                      │
│   Blockchain Smart..│                                                      │
│   FamilyBridge Photo│                                                      │
│   Multi-Cloud Mesh  │                                                      │
│   [+6 more…]        │                                                      │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

### Demo: Project Detail View (AWS Infrastructure)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ AWS Infrastructure Automation                    ████████████████ 100%  │
│ Production Ready  · aws · terraform · eks · rds                          │
├──────────────────────────────────────────────────────────────────────────┤
│ ▼ KEY TAKEAWAYS                                                          │
│   ✓ Immutable infrastructure prevents configuration drift                │
│   ✓ Multi-tool IaC approach (Terraform + CDK + Pulumi)                   │
│   ✓ Automated state management with S3 + DynamoDB locking                │
│                                                                          │
│ ▼ ARCHITECTURE DEEP DIVE  ·  ▼ CI/CD WORKFLOW  ·  ▼ ADRs (2)           │
│ ▼ THREAT MODEL (STRIDE)   ·  ▼ ROADMAP        ·  ▼ README              │
└──────────────────────────────────────────────────────────────────────────┘
```

### Demo: Fuzzy Search
```
Search: "k8s"  →  Kubernetes CI/CD, Advanced K8s Operators, Multi-Cloud Mesh
Search: "kafka" →  Real-time Streaming, Database Migration, MLOps Platform
Search: "sec"   →  DevSecOps Pipeline, Cybersecurity Platform, Quantum-Safe Crypto
```

### Demo: Production Build Output
```bash
npm run build

vite v6.0.0 building for production...
✓ 847 modules transformed.
dist/assets/index-*.js   892.43 kB │ gzip: 241.18 kB
✓ built in 8.3s
```

For the complete interactive walkthrough with all 10 feature demos, see **[`demos/DEMO_GUIDE.md`](./demos/DEMO_GUIDE.md)**.

---

## Why This Exists

Keeping a portfolio technically useful is hard when project notes live in scattered docs or vague summaries. This project provides a single interactive knowledge base where each project includes meaningful engineering context:

- Problem framing and motivation
- Architecture and implementation notes (README, ADRs)
- Security posture (STRIDE threat models)
- Maturity/status tracking with completion percentages
- CI/CD workflow definitions
- Stack-level reference insights
- Related project navigation

Instead of maintaining many disconnected pages, content is modeled in TypeScript and rendered consistently through reusable UI components.

---

## What You Get

| Capability | Outcome |
|---|---|
| Grouped project explorer | Browse 29 projects by maturity/status from a structured sidebar |
| Fuzzy search workflow | Quickly locate projects by name, description, or tags |
| Rich project detail view | Read highlights, architecture context, and technical tradeoffs |
| CI/CD workflow viewer | Inspect real GitHub Actions YAML with syntax highlighting |
| Architecture Decision Records | Review design rationale with dependency graphs |
| STRIDE threat models | Security analysis per project |
| Technology insight sections | Review deeper notes for stacks, tools, and implementation patterns |
| Roadmap milestones | Per-project progress tracking with target dates |
| D3 tech stack graph | Visual relationship map between projects and technologies |
| Responsive navigation | Smooth mobile/desktop transitions with overlay behavior |

---

## Feature Breakdown

**1. Guided Project Discovery**
Sidebar groups projects by status and supports debounced fuzzy search to reduce noise in larger collections. Search checks name, description, and all tags arrays.

**2. Detail-First Project Presentation**
`ProjectDetail` renders structured sections (highlights, metrics, architecture, CI/CD, ADRs, threat models, README) for the selected project. All sections are collapsible.

**3. Visual Technology Context**
`TechStackGraph` and insight components surface stack relationships and deeper explanatory content for better technical storytelling. The D3 force-directed graph supports drag, zoom, and hover highlighting.

**4. Architecture Decision Records**
Each project can carry an `adrs[]` array. ADRs are rendered as cards with status badges and relationship arrows showing inter-ADR dependencies.

**5. Security Analysis**
STRIDE threat models for each project identify Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege risks with mitigations.

**6. Reliable App Orchestration**
`App.tsx` coordinates selected project state, mobile sidebar behavior, and top-level layout rendering for a stable single-page experience.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                    React Single-Page App                   │
│                                                            │
│   ┌────────────────────┐      ┌────────────────────────┐   │
│   │ Sidebar            │ ---> │ ProjectDetail          │   │
│   │ - status groups    │      │ - highlights & KPIs    │   │
│   │ - fuzzy search     │      │ - architecture notes   │   │
│   │ - project preview  │      │ - CI/CD workflow YAML  │   │
│   └─────────┬──────────┘      │ - ADR graph            │   │
│             │                 │ - threat model         │   │
│             │                 │ - roadmap milestones   │   │
│             │                 └───────────┬────────────┘   │
│             │                             │                │
│             ▼                             ▼                │
│   ┌──────────────────────────────────────────────────────┐ │
│   │ App.tsx                                              │ │
│   │ - selected project orchestration                    │ │
│   │ - mobile sidebar open/close behavior                │ │
│   │ - root layout and routing-by-state                  │ │
│   └─────────┬────────────────────────────────────────────┘ │
│             │                                              │
│             ▼                                              │
│   ┌──────────────────────────────────────────────────────┐ │
│   │ constants.ts + types.ts                              │ │
│   │ - 29 project records with full metadata             │ │
│   │ - technology deep dives                             │ │
│   │ - architecture definitions                          │ │
│   └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Data & Rendering Flow

```
constants.ts loads 29 project records
      ↓
App.tsx initializes selectedProjectSlug state (defaults to first project)
      ↓
Sidebar.tsx renders grouped + searchable navigation with status bands
      ↓
User selects project slug → onSelectProject() callback
      ↓
ProjectDetail.tsx renders 9 collapsible sections for selected project
      ↓
Auxiliary components render deeper visuals:
  TechStackGraph.tsx  → D3 force-directed graph
  AdrGraph.tsx        → ADR relationship cards
  CicdWorkflowDiagram → Syntax-highlighted YAML
  ProjectInsights.tsx → Architecture layers
  ProgressBar.tsx     → Completion percentage
```

---

## System Requirements

| Requirement | Minimum | Notes |
|---|---|---|
| Node.js | 18+ | Recommended: current LTS (v20.x) |
| npm | 9+ | Bundled with Node.js |
| Browser | Modern Chromium / Firefox / Safari | Required for D3 animations |
| Disk space | ~500 MB | Includes node_modules |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/samueljackson-collab/Portfolio-Projects-Wiki-
cd Portfolio-Projects-Wiki-

# 2. Install
npm install

# 3. Run
npm run dev
# → Open http://localhost:3000

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
# → Opens http://localhost:4173
```

---

## Detailed Setup Guide

See **[`demos/SETUP_GUIDE.md`](./demos/SETUP_GUIDE.md)** for:

- Prerequisites check commands with expected outputs
- `nvm` / Node.js installation instructions
- Production build and GitHub Pages deployment
- Running the test suite and interpreting coverage reports
- Troubleshooting table for 8 common issues
- Environment variable reference
- Performance benchmarks (load times, search latency)

---

## How to Use the App

### Browsing Projects
1. The sidebar on the left lists all 29 projects, grouped by maturity status
2. Click any project name to load its detail view in the right pane
3. Sections in the detail view are collapsible — click the header (▼/▶) to expand/collapse
4. Scroll down within the detail pane to reach CI/CD, ADRs, threat models, and README sections

### Searching
- Type in the search box at the top of the sidebar
- Search is **fuzzy** — partial and out-of-order characters match
  - `k8s` finds "Kubernetes CI/CD", "Advanced Kubernetes Operators"
  - `iac` finds "AWS Infrastructure Automation" (matches tag)
  - `ml` finds "MLOps Platform", "Advanced AI Chatbot"
- Search matches against: project name, description text, and all tags
- Results remain grouped by status; non-matching projects are hidden

### Tech Stack Graph
1. Select a project with multiple technologies
2. Scroll to the "Technology Stack" section
3. Interact with the D3 graph: drag nodes, scroll to zoom, hover to highlight connections

### CI/CD Workflow Viewer
1. Select a project with a CI/CD workflow (e.g., DevSecOps Pipeline)
2. Scroll to "CI/CD Workflow"
3. Click the copy icon (📋) to copy the full YAML

### Mobile
- Tap ☰ (hamburger) to open the sidebar
- Select a project — sidebar closes automatically
- Press Escape or tap ✕ to close without selecting

---

## Configuration Reference

**Vite Server Configuration** (`vite.config.ts`):
- Host: `0.0.0.0` (accessible from LAN, not just localhost)
- Port: `3000`
- React plugin enabled (`@vitejs/plugin-react`)

**GitHub Pages base path** (`vite.config.ts`):
```ts
base: '/Portfolio-Projects-Wiki-/'
```
Remove or change this when hosting at a root domain.

**Environment Variables:**
| Variable | Purpose | Required |
|---|---|---|
| `GEMINI_API_KEY` | Optional AI enhancement features | No |

---

## Adding a New Project

1. Open `constants.ts`
2. Append a new entry to `ALL_PROJECTS_DATA`:

```typescript
{
  "id": 30,
  "name": "My New Project",
  "slug": "my-new-project",           // must be unique, URL-safe
  "description": "One-line summary.",
  "status": "In Development",          // see valid values below
  "completion_percentage": 50,         // 0-100
  "tags": ["python", "aws"],
  "github_path": "projects/30-my-new-project",
  "technologies": ["Python", "AWS Lambda"],
  "features": ["Feature 1", "Feature 2"],
  "key_takeaways": ["Lesson learned."],
  "readme": "## My New Project\n\nMarkdown content...",
  "adrs": [
    {
      "id": "ADR-001",
      "title": "Choice of Database",
      "status": "Accepted",
      "context": "Context here.",
      "decision": "We chose X because...",
      "consequences": "Pros and cons.",
      "relations": []
    }
  ],
  "external_links": [
    {
      "title": "Link Title",
      "url": "https://example.com",
      "description": "What this link is."
    }
  ]
}
```

**Valid `status` values:** `"Production Ready"` · `"Advanced"` · `"Substantial"` · `"In Development"` · `"Basic"` · `"Planned"`

3. Save — the dev server hot-reloads and the project appears in the sidebar immediately.

---

## Project Categories

Projects are grouped in the sidebar by these status bands (ordered by maturity):

| Status | Meaning | Current Count |
|---|---|---|
| Production Ready | Fully implemented, documented, tested | 20 |
| Advanced | Feature-complete with remaining polish | 9 |
| Substantial | Core implementation done, some gaps | 0 |
| In Development | Active work in progress | 0 |
| Basic | Early-stage scaffolding | 0 |
| Planned | Defined but not yet started | 0 |

---

## Project Structure

```
Portfolio-Projects-Wiki-/
├── App.tsx                  # Root layout, state orchestration
├── index.tsx                # React entry point
├── index.html               # HTML shell with Tailwind CDN
├── constants.ts             # All 29 project records + tech deep dives
├── types.ts                 # TypeScript interfaces
├── vite.config.ts           # Build config (port 3000, GH Pages base)
├── package.json             # Dependencies and scripts
├── metadata.json            # Project metadata
├── demos/
│   ├── DEMO_GUIDE.md        # Full feature demos with screenshots
│   └── SETUP_GUIDE.md       # Practical setup & usage guide
├── components/
│   ├── Sidebar.tsx          # Project navigator (search, groups, preview)
│   ├── ProjectDetail.tsx    # Main detail view (9 collapsible sections)
│   ├── TechStackGraph.tsx   # D3 force-directed tech graph
│   ├── ProjectInsights.tsx  # Architecture layers + problem context
│   ├── CicdWorkflowDiagram.tsx  # CI/CD YAML viewer
│   ├── AdrGraph.tsx         # ADR relationship cards
│   ├── CodeBlock.tsx        # Syntax-highlighted code renderer
│   ├── ProgressBar.tsx      # Completion percentage bar
│   ├── TagCloud.tsx         # D3 word cloud of tags
│   ├── Roadmap.tsx          # Roadmap milestone list
│   ├── Icons.tsx            # Custom icon components
│   └── ErrorBoundary.tsx    # Error recovery wrapper
├── src/
│   ├── utils/fuzzyMatch.ts  # Debounced fuzzy search implementation
│   └── test/                # Vitest + React Testing Library test suite
│       ├── components/      # Component-level tests (9 files)
│       ├── App.test.tsx
│       ├── constants.test.ts
│       └── utils/fuzzyMatch.test.ts
└── .github/workflows/
    ├── deploy.yml           # GitHub Pages auto-deploy on push to main
    └── jekyll-gh-pages.yml  # Alternative Jekyll deployment
```

---

## Technology Stack

| Technology | Version | Role |
|---|---|---|
| React | 19.2.x | UI rendering and component model |
| TypeScript | 5.8.x | Type safety and shared data models |
| Vite | 6.x | Dev server (HMR) and production bundler |
| @vitejs/plugin-react | 5.x | React Fast Refresh integration |
| D3 | 7.x | Force-directed graph and word cloud |
| D3-Cloud | 1.2.x | Tag cloud layout |
| Mermaid | 11.12.x | Diagram rendering in CodeBlock |
| LucideReact | 0.577.x | Icon library |
| JS-YAML | 4.1.x | YAML parsing for CI/CD display |
| Tailwind CSS (CDN) | Runtime | Utility-first UI styling |
| Vitest | latest | Unit and component testing |
| React Testing Library | latest | Component behavior testing |

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| App not loading on `localhost:3000` | Dev server not running or port conflict | `npx kill-port 3000 && npm run dev` |
| `npm install` fails with ERESOLVE | Peer dependency conflict | `npm install --legacy-peer-deps` |
| Search feels unresponsive | 200ms debounce delay while typing | Pause briefly after typing |
| Build fails with TypeScript errors | Data shape mismatch in `constants.ts` | Run `npx tsc --noEmit` for specific errors |
| Blank/incorrect project page | Invalid `slug` or `status` value | Verify data against `types.ts` enum values |
| D3 graph not rendering | Container width is 0 at mount | Resize window; ResizeObserver will re-render |
| Project not in search results | Tag missing from `tags[]` | Add the search term to the project's tags array |

**Debug commands:**
```bash
npx tsc --noEmit    # TypeScript errors only
npm run lint        # ESLint with max-warnings 0
npm run test:run    # Full test suite
```

---

## Security & Operational Notes

- Client-rendered, data-driven — no backend or database required
- Avoid committing secrets in any local `.env*` files
- Dev server binds to `0.0.0.0:3000` — accessible from LAN; use `localhost` restriction for tighter security
- Tailwind CSS loaded from CDN in `index.html` — move to local bundling for fully offline environments
- All project data is static TypeScript — no runtime API calls for core browsing

---

## Roadmap

- [x] Core project browser with fuzzy search
- [x] Rich project detail view (9 sections)
- [x] D3 tech stack graph
- [x] CI/CD workflow YAML viewer
- [x] Architecture Decision Records (ADRs) with dependency graph
- [x] STRIDE threat models for all projects
- [x] Roadmap milestones per project
- [x] Mobile responsive sidebar with overlay behavior
- [x] GitHub Pages automated deployment
- [x] Comprehensive test suite (51 tests)
- [x] Live demo guide with screenshots (`demos/DEMO_GUIDE.md`)
- [x] Practical setup guide (`demos/SETUP_GUIDE.md`)
- [x] All 29 projects at Advanced or Production Ready status
- [ ] URL-based routing for deep linking to specific project slugs
- [ ] Export/share modes for project summaries (PDF, Markdown)
- [ ] Externalize project content to markdown files or CMS
- [ ] Improve accessibility coverage (ARIA labels, keyboard navigation)

---

## Contributing

1. Fork the repository and create a feature branch from `main`
2. Keep changes focused and minimal — don't refactor unrelated code
3. Validate with `npm run build` and `npm run test:run` before opening a PR
4. Update `README.md` and `demos/` docs when behavior changes

---

## License

No license file is currently included. Add a `LICENSE` if you plan to distribute publicly.
