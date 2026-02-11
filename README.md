<div align="center">
  <img width="1200" height="475" alt="Project Wiki Viewer Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # Project Wiki Viewer

  A wiki-style portfolio explorer built with **React + TypeScript + Vite**.
</div>

## Overview

Project Wiki Viewer is a single-page app for presenting portfolio projects in a structured, documentation-like layout. It uses a sidebar-driven navigation experience and a rich project detail view so visitors can explore project context, architecture, metrics, and insights quickly.

## Features

- **Wiki-style navigation** with a project sidebar and active project highlighting.
- **Responsive layout** with a mobile menu and desktop split view.
- **Detailed project pages** including technical and business context.
- **Interactive visual elements** (including D3-powered graphing components).
- **Static data source** for predictable, version-controlled content.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Visualization:** D3
- **Styling:** Tailwind CSS (via CDN in `index.html`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

The app will start on Vite's default local development port (typically `5173`).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` — Start the local dev server.
- `npm run build` — Build optimized production assets.
- `npm run preview` — Serve the production build locally.

## Project Structure

```text
.
├── components/        # Reusable UI and visualization components
├── App.tsx            # Main app shell (layout + state wiring)
├── constants.ts       # Project data source and static config
├── types.ts           # Shared TypeScript types
├── index.tsx          # React app entry point
├── index.html         # HTML shell + Tailwind/import map setup
├── vite.config.ts     # Vite configuration
└── README.md
```

## Customization

To add or update portfolio entries, edit `constants.ts` and keep fields aligned with the interfaces in `types.ts`.

## Deployment

You can deploy the app to any static hosting provider that supports Vite output, for example:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Typical flow:

1. Run `npm run build`
2. Deploy the generated `dist/` directory

## License

This repository currently does not include a license file. If this project is intended for public reuse, add a `LICENSE` file with your preferred license.
