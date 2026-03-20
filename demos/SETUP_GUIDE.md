# Practical Setup & Use Guide

Step-by-step instructions for every supported workflow, with actual commands and expected outputs.

---

## Prerequisites Check

Run these to confirm your environment before starting:

```bash
node --version
# Expected: v18.x.x or v20.x.x (LTS recommended)

npm --version
# Expected: 9.x.x or 10.x.x

git --version
# Expected: git version 2.x.x
```

If Node.js is not installed:
- **macOS/Linux:** `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`
- **Windows:** Download from https://nodejs.org (LTS version)
- **Alternative:** Use `nvm` — `nvm install 20 && nvm use 20`

---

## Setup Workflow 1: Local Development

### Step 1 — Clone the repository
```bash
git clone https://github.com/samueljackson-collab/Portfolio-Projects-Wiki-
cd Portfolio-Projects-Wiki-
```

### Step 2 — Install dependencies
```bash
npm install
```
Expected: installs ~350 packages in ~15 seconds. No warnings expected.

### Step 3 — Start the development server
```bash
npm run dev
```

The server starts on `http://localhost:3000`. The terminal shows:
```
  VITE v6.0.0  ready in 312 ms
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Open your browser to `http://localhost:3000`.

### What you get in dev mode
- Hot module replacement (HMR) — changes to `.tsx` files reflect in < 500ms
- Source maps for debugging
- No build step required

---

## Setup Workflow 2: Production Build

```bash
npm run build
```

Produces `dist/` directory:
```
dist/
├── index.html          (0.46 kB)
└── assets/
    ├── index-*.css     (48 kB, Tailwind + custom styles)
    └── index-*.js      (892 kB, React + D3 + all project data)
```

To preview the production build locally:
```bash
npm run preview
# Opens http://localhost:4173
```

---

## Setup Workflow 3: GitHub Pages Deployment

The included `.github/workflows/deploy.yml` deploys automatically on every push to `main`.

### Manual deployment steps
```bash
# Ensure you're on main
git checkout main

# Build
npm run build

# The deploy.yml workflow handles:
# 1. npm ci
# 2. npm run build
# 3. Push dist/ to gh-pages branch
# 4. GitHub Pages serves from gh-pages branch
```

### GitHub Pages Configuration
In your repository settings → Pages:
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` / `/(root)`

The `vite.config.ts` sets `base: '/Portfolio-Projects-Wiki-/'` for correct asset paths.

---

## Setup Workflow 4: Running Tests

```bash
# Run all tests once
npm run test:run

# Watch mode (re-runs on file change)
npm run test

# Coverage report
npm run test:coverage
```

### Expected test output
```
 ✓ src/test/components/Sidebar.test.tsx (8 tests)
 ✓ src/test/components/ProjectDetail.test.tsx (6 tests)
 ✓ src/test/components/ProgressBar.test.tsx (4 tests)
 ✓ src/test/components/CodeBlock.test.tsx (5 tests)
 ✓ src/test/App.test.tsx (7 tests)
 ✓ src/test/constants.test.ts (12 tests)
 ✓ src/test/utils/fuzzyMatch.test.ts (9 tests)

 Tests  51 passed (51)
```

---

## Using the App

### Browsing Projects
1. **Sidebar groups** projects by status — scroll down to see all status bands
2. **Click any project name** to load its full detail view in the right pane
3. **Expand/collapse sections** by clicking the section header (▼ / ▶)

### Searching Projects
1. Click the search box at the top of the sidebar
2. Type any term — search is **fuzzy** (partial matches work):
   - `kube` matches "Kubernetes CI/CD", "Advanced Kubernetes Operators"
   - `mlop` matches "MLOps Platform"
   - `sec` matches "DevSecOps Pipeline", "Quantum-Safe Cryptography", "Advanced Cybersecurity Platform"
3. Search checks: project name, description text, and all tags
4. Results are grouped by status — non-matching projects are hidden

### Viewing Tech Stack Graph
1. Select a project that has multiple technologies
2. Scroll to the "Technology Stack" section
3. The D3 force-directed graph shows:
   - **Teal nodes** = the current project
   - **Blue nodes** = technology dependencies
   - **Edges** = "uses" relationship
4. Drag nodes to rearrange, scroll to zoom

### Viewing CI/CD Workflows
1. Select any project with a CI/CD workflow (e.g., K8s CI/CD, DevSecOps)
2. Scroll to "CI/CD Workflow" section
3. The YAML is syntax-highlighted
4. Click the copy icon (📋) to copy the full workflow YAML

### Viewing ADRs
1. Select a project with ADRs (e.g., AWS Infrastructure — has 2 ADRs)
2. Scroll to "Architecture Decisions"
3. ADRs show: ID, title, status badge, context, decision, consequences
4. Dependency arrows connect related ADRs

### Mobile Usage
1. On a screen narrower than 768px, the sidebar is hidden by default
2. Tap the **☰ (hamburger)** icon in the top-right to open the sidebar
3. Select a project — the sidebar automatically closes
4. Tap **✕** or press **Escape** to close the sidebar without selecting

---

## Adding a New Project

1. Open `constants.ts`
2. Add a new entry to `ALL_PROJECTS_DATA` array:

```typescript
{
  "id": 30,
  "name": "My New Project",
  "slug": "my-new-project",
  "description": "Brief description of what it does.",
  "status": "In Development",   // "Production Ready" | "Advanced" | "Substantial" | "In Development" | "Basic" | "Planned"
  "completion_percentage": 50,
  "tags": ["python", "aws", "automation"],
  "github_path": "projects/30-my-new-project",
  "technologies": ["Python", "AWS Lambda", "DynamoDB"],
  "features": ["Feature one", "Feature two"],
  "key_takeaways": ["Key lesson learned."],
  "readme": "## My New Project\n\nFull markdown description...",
  "adrs": [
    {
      "id": "ADR-001",
      "title": "Choice of Database",
      "status": "Accepted",
      "context": "Why we needed to choose a database.",
      "decision": "We chose DynamoDB because...",
      "consequences": "Pros and cons...",
      "relations": []
    }
  ],
  "external_links": [
    {
      "title": "DynamoDB Documentation",
      "url": "https://docs.aws.amazon.com/dynamodb/",
      "description": "Official AWS DynamoDB docs."
    }
  ]
}
```

3. Save the file — the dev server hot-reloads and your project appears immediately in the sidebar

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `npm install` fails with ERESOLVE | Peer dependency conflict | Run `npm install --legacy-peer-deps` |
| Port 3000 already in use | Another process on port 3000 | `npx kill-port 3000` then `npm run dev` |
| Blank white screen | JavaScript error at startup | Open devtools → Console, look for red errors |
| Project not appearing in sidebar | `slug` conflict or invalid `status` | Check `constants.ts` — status must be one of the 6 valid enum values |
| D3 graph not rendering | Container width is 0 at mount | Resize the window; D3 uses ResizeObserver to re-render |
| TypeScript build error | Type mismatch in constants.ts | Run `npx tsc --noEmit` to see specific errors |
| Search not finding project | Tag not in `tags[]` array | Add the search term to the project's `tags` array in `constants.ts` |

### Debug Commands
```bash
# Check TypeScript errors only (no build)
npx tsc --noEmit

# Check ESLint issues
npm run lint

# Check for undefined/null project slugs
node -e "const {ALL_PROJECTS_DATA} = require('./constants.ts'); console.log(ALL_PROJECTS_DATA.map(p=>p.slug))"
```

---

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GEMINI_API_KEY` | Optional AI features (not used in core app) | No |

Set with: `echo "GEMINI_API_KEY=your-key" > .env` (Vite reads `.env` automatically)

---

## Performance Notes

- Initial page load: ~300ms (development), ~120ms (production build)
- Search debounce: 200ms (prevents excessive re-renders while typing)
- D3 graph: ~50ms to render on first load, near-instant on subsequent renders
- All 29 projects load client-side — no server required after the initial bundle load
