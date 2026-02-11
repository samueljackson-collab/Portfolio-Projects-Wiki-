# Portfolio Projects Wiki

An interactive, single-page **project knowledge base** for exploring a portfolio in a Wiki.js-inspired format. The app organizes projects by maturity, supports fuzzy search, and provides deep technical context (architecture, implementation notes, tradeoffs, and technology insights) for each project.

---

## ✨ Features

- **Project explorer sidebar** with grouped statuses (Production Ready → Basic).
- **Fuzzy search** across project names, descriptions, and tags.
- **Detailed project pages** with:
  - feature highlights,
  - progress/completion indicators,
  - architecture and problem-context sections,
  - related project suggestions.
- **Interactive tech stack visualization** using D3 force-directed graphs.
- **Technology deep-dive content** for domain knowledge and best practices.
- **Responsive UI** with mobile sidebar toggle, keyboard/overlay close behavior, and desktop-friendly layout.
- **State persistence** (e.g., graph zoom/selection and active tags) via local storage.

---

## 🛠 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Visualization:** D3
- **Styling:** Tailwind CSS (CDN-based utility classes)

---

## 📁 Project Structure

```text
.
├── App.tsx                 # App shell + routing by selected project state
├── components/
│   ├── Sidebar.tsx         # Search + grouped project navigation
│   ├── ProjectDetail.tsx   # Main project content renderer
│   ├── TechStackGraph.tsx  # D3 graph visualization
│   └── ...
├── constants.ts            # Primary data source for projects and knowledge sections
├── types.ts                # Shared TypeScript interfaces
├── index.tsx               # React entry point
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (bundled with Node)

### Installation

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Then open the local URL shown by Vite (usually `http://localhost:5173`).

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🧠 Data Model

Project content is driven by static TypeScript data and types:

- `constants.ts` contains project records and domain/reference content.
- `types.ts` defines canonical entities (project metadata, architecture definitions, problem contexts, deep-dive structures).

This makes it easy to scale content while keeping rendering components mostly generic.

---

## 📌 Notes

- This repo is currently structured as a client-side viewer with embedded data.
- If desired, data can later be externalized to JSON/MD files or a headless CMS with minimal UI changes.

---

## 📜 License

No license file is currently included in this repository. Add a `LICENSE` if you plan to distribute this project publicly.
