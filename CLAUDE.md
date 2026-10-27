# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at localhost:4321
npm run build     # production build → ./dist/
npm run preview   # serve production build locally
npx astro check   # TypeScript + Astro type checking
```

No test runner or linter configured.

## Architecture

**Stack:** Astro 5 · Tailwind CSS 4 (via `@tailwindcss/vite`) · MDX · Node.js adapter

### Data layer (`src/content/`)

All static data lives as TypeScript objects — not Astro Content Collections:

- `technologies.ts` — tech stack grouped by category (`ITypeTechnology[]`)
- `experienceInformation.ts` — education/work history
- `contactInformation.ts` — email, phone, social links

### Projects (`src/pages/projects/`)

Each project is an MDX file at `src/pages/projects/content/NNN_project-name.mdx` with YAML frontmatter:

```yaml
---
title: string
description: string
image: string        # path to image asset
technologies: string[]
url: string          # slug used for routing
links:
  github: string
  live: string
---
```

`[project].astro` reads these files via `import.meta.glob`, runs `getStaticPaths()`, and renders each at `/projects/[url]`.

### Routing

- `src/pages/index.astro` — home page (About + Stack + Contact composed inline)
- `src/pages/[slug].astro` — catch-all dynamic route
- `src/pages/projects/[project].astro` — project detail pages

### Layout & components

`Layout.astro` wraps every page with the sidebar nav. Components are purely presentational — props in, Tailwind-styled HTML out. No client-side JS framework; interactivity lives in `src/assets/js/main.js`.

### Interfaces (`src/interfaces/Interface.ts`)

Central type definitions: `IProject`, `ITechnology`, `ITypeTechnology`, `IGithub`, `IExperienceInformation`. Import from here when adding typed data.

## Adding content

**New project:** create `src/pages/projects/content/NNN_name.mdx` following the frontmatter schema above — routing is automatic.

**New technology:** add an entry to the relevant `ITypeTechnology` array in `src/content/technologies.ts`.
