# Portfolio Projects Wiki

Portfolio Projects Wiki is a **Wiki.js-inspired, single-page technical portfolio system** for showcasing engineering projects with real implementation depth. Instead of short résumé bullets, it presents each project as a structured technical record: problem context, architecture reasoning, implementation details, technology deep dives, status, and progress.

It is designed for:
- **Developers** building a high-signal, technical portfolio
- **Recruiters and hiring managers** who want quick confidence in project maturity
- **Engineering reviewers** who need architecture and tradeoff context, not just screenshots

---

## Table of Contents

- [Overview](#overview)
- [Design Goals](#design-goals)
- [Key Capabilities](#key-capabilities)
- [Architecture Overview](#architecture-overview)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Configuration Categories](#configuration-categories)
  - [Navigation & Discovery](#navigation--discovery)
  - [Project Detail Content Model](#project-detail-content-model)
  - [Technical Deep Dives](#technical-deep-dives)
  - [Runtime & Layout Behavior](#runtime--layout-behavior)
  - [Build & Tooling Settings](#build--tooling-settings)
- [Generated Output & Data Flow](#generated-output--data-flow)
- [How to Extend This Portfolio Wiki](#how-to-extend-this-portfolio-wiki)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Roadmap Ideas](#roadmap-ideas)
- [Contributing](#contributing)
- [License](#license)

## Overview

Portfolio Projects Wiki solves a common portfolio problem: **project information is often fragmented and too shallow**. This app centralizes project metadata and narrative into a reusable data model and renders it through a consistent interface.

At runtime, the app loads a local project dataset and provides:
1. **Sidebar-first project discovery** with status grouping and fuzzy search
2. **Detailed project pages** with summary, metadata, architecture, and learning outcomes
3. **Technology-focused educational context** to explain why tools were chosen
4. **Responsive interactions** for mobile and desktop review workflows

Because content is data-driven from TypeScript records, you can scale portfolio depth without rewriting UI templates for each new project.

## Design Goals

The project prioritizes documentation quality and technical credibility over decorative portfolio aesthetics.

- **Explain engineering judgment, not just outcomes**
  - Projects can include architecture decisions, threat modeling, and tradeoff narratives.
- **Keep authoring scalable**
  - Adding a project should mostly be a data-entry task in `constants.ts`, not a UI rewrite.
- **Support fast portfolio review loops**
  - Search + status grouping helps reviewers quickly focus on the most mature work.
- **Preserve consistency across projects**
  - Shared sections and component patterns reduce style drift.

## Key Capabilities

- **Status-grouped project explorer**
  - Projects are grouped by maturity stages like Production Ready and In Development.
- **Debounced fuzzy search**
  - Users can quickly find projects by name, description, or tags.
- **Rich project detail surface**
  - Includes project metadata, key takeaways, architecture notes, and optional ADR/threat model sections.
- **Technology deep-dive context**
  - Includes structured explanations, examples, best practices, anti-patterns, and learning resources.
- **Responsive sidebar UX**
  - Mobile-friendly drawer behavior with outside-click and Escape-key handling.
- **Client-side rendering model**
  - No backend required for core browsing; all current content ships with the app.

## Architecture Overview

The app is intentionally simple: one root orchestration component with dataset-driven rendering and focused presentation components.

```text
┌──────────────────────────────────────────────────────────────┐
│                      React SPA (Vite)                       │
│                                                              │
│  ┌───────────────┐           ┌───────────────────────────┐   │
│  │ Sidebar       │           │ ProjectDetail             │   │
│  │ - search      │──────────▶│ - metadata + summary      │   │
│  │ - status list │           │ - architecture sections   │   │
│  └──────┬────────┘           │ - optional ADR/threat     │   │
│         │                    └───────────────┬───────────┘   │
│         │                                    │               │
│         ▼                                    ▼               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ App.tsx                                                │  │
│  │ - selected project slug state                          │  │
│  │ - mobile sidebar open/close state                      │  │
│  │ - top-level layout and event orchestration             │  │
│  └──────────────────────┬─────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ constants.ts + types.ts                                │  │
│  │ - source-of-truth project records                      │  │
│  │ - type contracts for compile-time safety               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Architectural Characteristics

| Characteristic | Current Approach | Why It Matters |
|---|---|---|
| Source of Truth | In-repo TypeScript constants | Enables deterministic rendering and easy versioning |
| State Management | Local React state in `App.tsx` | Keeps complexity low and behavior explicit |
| Search Strategy | Debounced fuzzy matching | Better UX on growing project catalogs |
| Rendering Model | Client-side only | Zero backend overhead for showcase scenarios |
| Content Reuse | Shared section components | Consistent presentation across projects |

## System Requirements

- **Node.js**: 18+
- **npm**: 9+
- **Browser**: current Chrome, Edge, Firefox, or Safari

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url> portfolio-projects-wiki
   cd portfolio-projects-wiki
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - Vite is configured for `0.0.0.0:3000`
   - Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
```

Preview production output:

```bash
npm run preview
```

## Getting Started

### Quick Start Workflow

1. Launch the app with `npm run dev`.
2. Use the sidebar to browse project groups by status.
3. Type in the search field to fuzzy-match project names, descriptions, and tags.
4. Select a project to inspect:
   - Overview and key learnings
   - Metadata and progress
   - Architecture explanation and layered flow
   - Optional ADR and threat-model content
5. Follow related project links to compare implementations across domains.

### Example Reviewer Workflow

**Goal:** Evaluate production-level cloud and platform engineering depth in under 10 minutes.

1. Filter for **Production Ready** projects in the sidebar.
2. Open **AWS Infrastructure Automation** and review architecture + business impact.
3. Open **Database Migration Platform** and inspect ADR/threat model content.
4. Compare key takeaways and technology choices across projects.
5. Use tech deep-dive sections to validate practical understanding beyond buzzwords.

### Example Contributor Workflow

**Goal:** Add a new project without changing core UI code.

1. Add a project object in `constants.ts` with required fields.
2. Ensure its shape satisfies interfaces in `types.ts`.
3. Add meaningful tags for search discoverability.
4. Optionally include `adr`, `threatModel`, and `readme` sections.
5. Run `npm run build` to verify type and bundling integrity.

## Usage Guide

### Interface Overview

- **Sidebar**
  - Grouped project navigation
  - Search input with debounce for smoother filtering
  - Active item highlighting
- **Main detail pane**
  - Project metadata and status/progress indicators
  - Detailed narrative sections
  - Code/markdown blocks for structured artifacts
- **Mobile top header**
  - Displays active project title
  - Toggle button to open/close sidebar

### Core Interaction Flow

1. **Initialize app state** from the first project slug.
2. **Render grouped project list** in the sidebar.
3. **Accept search query** and apply debounced fuzzy filtering.
4. **Select project** and update active slug.
5. **Render detail view** with related context and deep-dive sections.
6. **On mobile**, close drawer after selection or on Escape/outside click.

### Review Flow by Persona

| Persona | Recommended Path | Typical Outcome |
|---|---|---|
| Recruiter | Filter by status → open 2–3 top projects → review summaries | Fast confidence in project maturity |
| Engineering Manager | Review architecture + key takeaways + linked technologies | Signal on depth and decision quality |
| Senior IC Interviewer | Inspect ADR/threat model/code snippets where present | Evidence of systems thinking and tradeoffs |

## Configuration Categories

### Navigation & Discovery

| Area | Behavior |
|------|----------|
| Grouping | Projects grouped by status labels (e.g., Production Ready, Advanced) |
| Search | Debounced query updates to reduce over-rendering while typing |
| Match Strategy | Fuzzy match across project name, description, and tags |
| Selection | Active slug drives detail pane rendering |

### Project Detail Content Model

Each project can include a rich schema:

- Identity: `id`, `name`, `slug`
- Summary: `description`, `features`, `key_takeaways`
- Delivery status: `status`, `completion_percentage`
- Discoverability: `tags`, related links
- Technical documentation (optional): `readme`, `adr`, `threatModel`

This allows simple projects and advanced projects to coexist while preserving a consistent UI surface.

### Technical Deep Dives

The app includes educational metadata for technologies to support reviewer understanding. Typical fields include:
- Why this technology exists
- Key concepts with examples
- Real-world scenario
- Best practices and anti-patterns
- Curated learning resources

This makes the portfolio useful as both a showcase and a learning artifact.

### Runtime & Layout Behavior

- Desktop uses a persistent split-pane layout.
- Mobile uses a temporary sidebar drawer.
- Drawer closes when:
  - A project is selected
  - User clicks outside the sidebar
  - User presses Escape
  - Viewport switches to desktop breakpoint

### Build & Tooling Settings

`vite.config.ts` currently configures:
- Host: `0.0.0.0`
- Port: `3000`
- React plugin for TSX transformation
- Env mapping for `GEMINI_API_KEY` into `process.env` keys

## Generated Output & Data Flow

This is a **front-end-only application** at present.

### Data Flow

1. Project records are defined in `constants.ts`.
2. `App.tsx` tracks selected project slug and sidebar visibility.
3. Sidebar filters and groups project records.
4. Selected slug resolves to a project object.
5. `ProjectDetail` renders sectioned technical content.

### Rendering Characteristics

- All content is rendered client-side.
- No network request is required for core project browsing.
- Data validity depends on schema alignment with `types.ts`.

### State & Event Notes

- Search input is debounced to improve responsiveness and avoid unnecessary list recalculation.
- Mobile drawer close behaviors are defensive and include selection-close, outside-click close, escape-close, and resize-close.
- Active project rendering is slug-driven, making state transitions predictable and easy to debug.

## How to Extend This Portfolio Wiki

### Add a New Project Entry

Use existing project objects in `constants.ts` as templates and include:
- Clear one-line description
- Honest status and completion percentage
- Practical tags users might search for
- At least 3 meaningful features or outcomes
- Optional deep sections when available (`adr`, `threatModel`, `readme`)

### Suggested Quality Checklist

Before committing a new project entry:

- [ ] Slug is unique and URL-safe
- [ ] Description explains technical scope, not only business impact
- [ ] Tags are concrete (`kafka`, `terraform`, `ci-cd`) rather than vague (`backend`)
- [ ] Key takeaways are specific and experience-backed
- [ ] Optional architecture notes explain data/control flow
- [ ] `npm run build` passes without type errors

### Content Depth Heuristics

To keep project quality consistent:

- Prefer **specific claims** over generic claims.
  - Better: “Implemented canary deploy rollback on health-check failure.”
  - Weaker: “Used modern DevOps practices.”
- Include at least one **tradeoff statement** for mature projects.
- Include at least one **operational concern** (security, reliability, observability, cost).

## Project Structure

```text
.
├── App.tsx
├── index.tsx
├── index.html
├── constants.ts
├── types.ts
├── vite.config.ts
├── package.json
├── metadata.json
└── components/
    ├── Sidebar.tsx
    ├── ProjectDetail.tsx
    ├── ProjectInsights.tsx
    ├── TechStackGraph.tsx
    ├── ProgressBar.tsx
    ├── CodeBlock.tsx
    ├── Icons.tsx
    └── ErrorBoundary.tsx
```

## Technology Stack

| Technology | Version | Responsibility |
|------------|---------|----------------|
| React | 19.x | Component architecture and rendering |
| TypeScript | 5.8.x | Static typing for data contracts and props |
| Vite | 6.x | Dev server, HMR, and production build pipeline |
| @vitejs/plugin-react | 5.x | React integration with Vite |
| D3 | 7.x | Visualization support for graph-oriented components |
| Tailwind CSS (CDN) | Runtime CDN | Utility styling in UI templates |

### Why This Stack Works for a Portfolio Wiki

- **React + TypeScript**: balances rapid iteration with maintainable contracts.
- **Vite**: keeps cold start and HMR fast for content-heavy UI iteration.
- **D3**: enables richer visual storytelling for architecture/technology relationships.
- **Tailwind utility style**: consistent visual language with minimal CSS overhead.

## Environment Variables

The current app does not require API calls for core behavior, but Vite config maps:

```bash
GEMINI_API_KEY=your_key_here
```

This value is exposed through build-time environment handling in `vite.config.ts` as:
- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

## Troubleshooting

### Common Issues

**App not reachable at `localhost:3000`**
- Ensure `npm run dev` is running.
- Check if another process is already using port 3000.

**Search appears delayed**
- A small debounce interval is intentionally used.
- Pause briefly after typing to see filtered results.

**Build fails**
- Reinstall dependencies with `npm install`.
- Re-run `npm run build` and inspect TypeScript errors.

**Project detail appears blank or wrong**
- Verify `slug` uniqueness in `constants.ts`.
- Confirm project objects satisfy `types.ts` contracts.

### Debug Commands

```bash
npm run dev
npm run build
npm run preview
```

### Practical Debug Workflow

1. Reproduce issue in dev server.
2. Inspect browser console and terminal output.
3. Validate changed data shape against `types.ts`.
4. Confirm active slug exists in `constants.ts`.
5. Run production build before opening PR.

## Best Practices

- **Keep project entries structured and complete**
  - Add key takeaways, architecture context, and measurable outcomes.
- **Use meaningful tags**
  - Improves search quality and reviewer navigation.
- **Document tradeoffs**
  - ADR and threat-model sections help demonstrate engineering judgment.
- **Validate before sharing**
  - Run `npm run build` to catch type or build regressions.
- **Prefer consistency over novelty**
  - Reuse existing section patterns for maintainable portfolio growth.
- **Write for skim + depth**
  - Keep top section concise; reserve detail for expandable technical sections.
- **Keep status honest**
  - A candid “In Development” project with clear learnings is stronger than inflated maturity claims.

## Roadmap Ideas

- Add route-based deep links for each project slug.
- Persist selected project and UI preferences in local storage.
- Add automated tests for search, grouping, and drawer behavior.
- Externalize project content to markdown or CMS pipelines.
- Improve accessibility auditing and keyboard navigation coverage.
- Add structured export mode for recruiter-friendly summaries.
- Add per-project changelog panels for evolution tracking.

## Contributing

Contributions are welcome.

1. Create a focused branch.
2. Keep changes scoped and well-documented.
3. Run local validation (`npm run build` minimum).
4. Update README/docs when user-visible behavior changes.
5. Prefer adding structured content over ad hoc formatting styles.

## License

No license file is currently included.
If you intend to distribute this project publicly, add a `LICENSE` file with your preferred terms.
