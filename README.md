# Portfolio Projects Wiki

Interactive, Wiki.js-inspired portfolio documentation studio for developers, recruiters, and technical reviewers.

Explore structured, project-oriented knowledge pages with architecture context, implementation details, progress indicators, and technology deep dives.

## Table of Contents
- [Why This Exists](#why-this-exists)
- [What You Get](#what-you-get)
- [Feature Breakdown](#feature-breakdown)
- [Architecture Overview](#architecture-overview)
- [Data & Rendering Flow](#data--rendering-flow)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Runtime Behavior](#runtime-behavior)
- [Project Categories](#project-categories)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)
- [Security & Operational Notes](#security--operational-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Why This Exists
Keeping a portfolio technically useful is hard when project notes live in scattered docs or vague summaries. This project provides a single interactive knowledge base where each project includes meaningful engineering context:

- Problem framing and motivation
- Architecture and implementation notes
- Maturity/status tracking
- Stack-level reference insights
- Related project navigation

Instead of maintaining many disconnected pages, content is modeled in TypeScript and rendered consistently through reusable UI components.

## What You Get
| Capability | Outcome |
| --- | --- |
| Grouped project explorer | Browse projects by maturity/status from a structured sidebar |
| Fuzzy search workflow | Quickly locate projects by name, description, or tags |
| Rich project detail view | Read highlights, architecture context, and technical tradeoffs |
| Technology insight sections | Review deeper notes for stacks, tools, and implementation patterns |
| Responsive navigation | Smooth mobile/desktop transitions with overlay and keyboard-close behavior |

## Feature Breakdown
### 1) Guided Project Discovery
`Sidebar` groups projects by status and supports debounced fuzzy search to reduce noise in larger collections.

### 2) Detail-First Project Presentation
`ProjectDetail` renders structured sections (highlights, metrics, architecture, and supporting technical context) for the selected project.

### 3) Visual Technology Context
`TechStackGraph` and insight components surface stack relationships and deeper explanatory context for better technical storytelling.

### 4) Reliable App Orchestration
`App.tsx` coordinates selected project state, mobile sidebar behavior, and top-level layout rendering for a stable single-page experience.

## Architecture Overview
```text
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
│   │ - selected project orchestration                    │  │
│   │ - mobile sidebar open/close behavior                │  │
│   │ - root layout and routing-by-state                  │  │
│   └─────────┬────────────────────────────────────────────┘  │
│             │                                               │
│             ▼                                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ constants.ts + types.ts                              │  │
│   │ - project records                                    │  │
│   │ - shared interfaces                                  │  │
│   └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Data & Rendering Flow
Project dataset load (`constants.ts`)
      ↓
`App` initializes selected project state
      ↓
`Sidebar` renders grouped + searchable navigation
      ↓
User selects project slug
      ↓
`ProjectDetail` renders project-specific sections
      ↓
Auxiliary components render deeper visuals/insights

## System Requirements
| Requirement | Minimum | Notes |
| --- | --- | --- |
| Node.js | 18+ | Recommended current LTS |
| npm | 9+ | Bundled with Node.js |
| Browser | Modern Chromium / Firefox / Safari | Needed for local UI use |

## Quick Start
### 1) Install dependencies
```bash
npm install
```

### 2) Start development server
```bash
npm run dev
```
By default, Vite is configured to run on `0.0.0.0:3000`.

### 3) Use the app
- Open `http://localhost:3000`
- Select a project from the sidebar
- Use search to filter by name/description/tags
- Review architecture and stack insights in the detail pane

### 4) Build for production
```bash
npm run build
```

### 5) Preview production build
```bash
npm run preview
```

## Configuration Reference
### Vite Server Configuration
`vite.config.ts` currently sets:
- Host: `0.0.0.0`
- Port: `3000`
- React plugin enabled (`@vitejs/plugin-react`)

### Environment Defines
The config maps `GEMINI_API_KEY` from env into:
- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

> Note: this project is currently a local data-driven wiki viewer and does not require runtime API calls for core browsing behavior.

## Runtime Behavior
### Search & Navigation
- Search is debounced before filtering.
- Fuzzy matching checks project names, descriptions, and tags.
- Sidebar groups and sorts projects by maturity status.

### Responsive UX
- Mobile header includes a sidebar toggle.
- Sidebar closes on selection, outside click, or `Escape` key.
- Desktop breakpoint behavior automatically resets mobile sidebar visibility.

### Rendering Model
- App state tracks active project by slug.
- Detail view is selected via in-memory lookup from `PROJECTS_DATA`.
- Content is rendered entirely client-side.

## Project Categories
Projects are grouped into the following status bands:

- Production Ready
- Advanced
- Substantial
- In Development
- Basic

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
| Technology | Version (declared) | Role |
| --- | --- | --- |
| React | 19.2.x | UI rendering |
| TypeScript | 5.8.x | Type safety and shared models |
| Vite | 6.x | Dev server and build tooling |
| @vitejs/plugin-react | 5.x | React integration for Vite |
| D3 | 7.x | Graph and visualization rendering |
| Tailwind CSS (CDN) | Runtime CDN | Utility-first UI styling |

## Troubleshooting
| Problem | Likely Cause | Fix |
| --- | --- | --- |
| App not loading on `localhost:3000` | Dev server not running / port conflict | Restart `npm run dev` and free conflicting port |
| Search feels unresponsive | Debounce delay while typing | Pause briefly after typing; verify project data exists |
| Build fails | Dependency mismatch or TypeScript issues | Reinstall deps and run `npm run build` again |
| Blank/incorrect project page | Invalid selected slug state | Refresh app and verify data integrity in `constants.ts` |

### Debug Tips
- Run `npm run build` before sharing/deploying changes.
- Check browser devtools console for runtime errors.
- Keep project data shape aligned with `types.ts` contracts.

## Security & Operational Notes
- This project is currently client-rendered and data-driven from repository sources.
- Avoid committing secrets in any local `.env*` files.
- Dev server binds to `0.0.0.0`; convenient for LAN testing, broader than localhost-only.
- Tailwind utilities are loaded from CDN in `index.html`; move to local bundling for fully offline environments.

## Roadmap
- Add URL-based routing for deep linking to specific project slugs.
- Add export/share modes for project summaries.
- Add tests for search, grouping, and selection behavior.
- Externalize project content to markdown or CMS-backed sources.
- Improve accessibility coverage and keyboard navigation patterns.

## Contributing
1. Fork the repository and create a feature branch.
2. Keep changes focused and minimal.
3. Validate with at least `npm run build` before opening a PR.
4. Update `README.md` and related docs when architecture or behavior changes.

## License
No license file is currently included. Add a `LICENSE` if you plan to distribute publicly.
