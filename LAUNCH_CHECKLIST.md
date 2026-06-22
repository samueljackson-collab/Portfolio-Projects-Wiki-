# Portfolio Projects Wiki — Production Launch Checklist

This is a static React SPA. Run through these checks before demo use.

## 1. Setup Verification

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 1 | App starts | `npm install && npm run dev`, open http://localhost:5173 | App loads, no blank screen, no console errors | |
| 2 | No TypeScript errors | `npm run build` | Build succeeds, exits 0 | |
| 3 | No lint errors | `npm run lint` | Zero errors reported | |

## 2. Core Feature Flows

| # | Feature | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 4 | All projects load | Open the main projects view | All portfolio projects appear with title, description, status | |
| 5 | Project detail view | Click any project | Detail panel/page opens with full info | |
| 6 | Sidebar navigation | Click different tags in sidebar | View updates to show matching projects | |
| 7 | Sidebar search | Type a keyword in the search bar | Projects filter in real-time by matching text | |
| 8 | Project status badges | View project cards | Status badges (Production Ready/Advanced/Substantial/In Development/Basic) display correctly | |

## 3. Visualizations

| # | Feature | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 9 | D3 dependency graph | Scroll to the Tech Stack Selection section in any project detail view | D3 graph renders, nodes and edges visible | |
| 10 | Graph interactions | Hover or click nodes in D3 graph | Tooltip or highlight appears | |
| 11 | Graph performance | View graph with all projects loaded | No jank or freeze — graph renders smoothly | |
| 12 | Mermaid diagrams | Open a project that includes architecture diagrams | Mermaid diagrams render correctly (not raw text) | |
| 13 | Mermaid in multiple projects | Check 2-3 different projects with diagrams | All render without errors | |

## 4. Data & Content

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 14 | constants.ts load | Open DevTools → Network, check JS bundle size | constants.ts payload doesn't cause >3s load (196KB file — monitor this) | |
| 15 | All tech tags | Browse project cards | Tech stack tags render correctly for all projects | |
| 16 | External links | Click GitHub or live demo links on a project | Opens correct external URL | |

## 5. Responsive / Visual

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 17 | Mobile layout | Resize browser to 375px wide | Sidebar collapses or adapts, content still readable | |
| 18 | Dark/light mode | Toggle theme if available | Both modes render without broken styles | |
| 19 | No layout overflow | Browse all views at 1280px | No horizontal scrollbars from overflow | |

## 6. Performance

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 20 | Initial load | Hard-refresh, watch Network tab | Page interactive in under 4s (accounting for 196KB constants) | |
| 21 | Build size | `npm run build`, check dist/ | Total JS payload reasonable (note constants.ts — consider lazy-loading if >500KB) | |

## 7. Security

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 22 | No secrets in bundle | Search `dist/` for common secret patterns | No API keys or tokens in built output | |
| 23 | Safe external links | Inspect all `<a>` tags pointing offsite | All have `rel="noopener noreferrer"` | |
