# Jhon David Toro Muriel — Developer Portfolio

**[🇪🇸 Leer en español](./README.es.md)**

An interactive, production-quality developer portfolio — not a template. Built with React 19, TypeScript, and Vite, and treated as a real product: typed end to end, tested, accessible, internationalized, and instrumented with real (not simulated) Core Web Vitals.

**Production domain:** `portfolio.doxel.dev` (configured in `SITE_URL`/canonical tags — see [Deployment](#deployment) for its current status).

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Engineering guidelines](#engineering-guidelines)
- [Contact](#contact)

## Features

- **Content** — Hero, About, Experience timeline, Education, Projects, Skills, and Contact sections, all driven by typed content modules (`src/content/`), not copy hardcoded into JSX.
- **Bilingual** — Full English/Spanish translations via i18next, with the visitor's choice persisted and the `<html lang>` attribute kept in sync.
- **Theming** — Light/dark mode with no flash of the wrong theme on load. On desktop, switching themes animates a circular reveal from the click point via the native View Transitions API; on mobile it falls back to a cheaper cross-fade, since the circular reveal measurably drops frames on weaker GPUs.
- **Command palette** — <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd> opens a searchable list of actions: jump to a section, toggle theme/language, copy email, open GitHub, open the terminal.
- **AI assistant** — A chat widget (and a terminal `ask` command) answering visitor questions, grounded strictly in this portfolio's own content via a server-side Gemini proxy — it never invents claims about experience or skills.
- **Live GitHub activity** — A modal showing real repositories, star counts, and commit counts, fetched server-side via GitHub's GraphQL API (not the client, to keep the token private and avoid the public API's 60 req/hour limit).
- **Contact form** — Real email delivery via EmailJS, with accessible loading/success/error states (not just a spinner that disappears).
- **Terminal easter egg** — A draggable faux terminal (with a maximize toggle) running a small set of real commands (`help`, `whoami`, `cd`, `ask`, `clear`, …).
- **Constellation background** — A canvas particle network that reacts to the cursor, gated behind a desktop-width check and `prefers-reduced-motion`, paused whenever the tab is hidden.
- **Real performance metrics** — The footer reports this page's actual LCP/CLS/TTFB, measured with the native `PerformanceObserver` API (no client library), not a marketing claim.
- **Accessibility** — Semantic landmarks, a skip link, visible focus states, keyboard-operable menus/modals/palette, and `aria-live` regions for async state changes.

## Tech stack

| | |
|---|---|
| **Framework** | React 19, with the React Compiler enabled (`babel-plugin-react-compiler`) |
| **Language** | TypeScript, `strict` mode |
| **Build tool** | Vite |
| **Styling** | SCSS Modules, CSS custom properties for theming |
| **Routing** | React Router |
| **i18n** | react-i18next |
| **Animation** | Motion (Framer Motion), the View Transitions API, Lenis (smooth scroll) |
| **Forms/email** | EmailJS |
| **Serverless** | Vercel Edge Functions (`api/`) for the AI assistant and GitHub proxy |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Package manager** | pnpm |

No global state library, no CSS framework, no UI kit — see [`CLAUDE.md`](./CLAUDE.md)'s dependency-discipline rules for why.

## Getting started

```bash
git clone <this-repo>
cd portfolio
pnpm install
cp .env.example .env   # optional — see below
pnpm dev
```

The dev server runs at `http://localhost:5173`. The `api/*.ts` serverless functions run locally too, through a small Vite plugin (`localApiPlugin.ts`) that adapts them to Node's dev server — no Vercel CLI required.

## Environment variables

Copy `.env.example` to `.env` and fill in what you need. Every feature that depends on one degrades gracefully without it (the contact form shows a clear error state; the AI assistant and GitHub modal show a "not configured" message) — nothing crashes.

| Variable | Used by | Required for |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | `src/features/contact/ContactForm.tsx` | Sending the contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | same | same |
| `VITE_EMAILJS_PUBLIC_KEY` | same | same |
| `GEMINI_API_KEY` | `api/chat.ts` (server-only) | The AI assistant widget |
| `GITHUB_TOKEN` | `api/github.ts` (server-only) | The live GitHub repositories modal |

`GEMINI_API_KEY` and `GITHUB_TOKEN` are deliberately **not** `VITE_`-prefixed — anything with that prefix is inlined into the client bundle and visible to anyone who opens devtools. See the comments in `.env.example` for where to get each key.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Type-check, then build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Type-check the whole project (app, api/, e2e/, test configs) |
| `pnpm test` | Run unit/component tests once |
| `pnpm test:watch` | Run unit/component tests in watch mode |
| `pnpm test:coverage` | Run unit/component tests with a coverage report |
| `pnpm test:e2e` | Run the Playwright e2e suite, headless |
| `pnpm test:e2e:ui` | Playwright's interactive UI mode |
| `pnpm test:e2e:headed` | Run e2e tests in a visible browser window |

## Project structure

```text
src/
├── app/            # Composition root: providers, router, i18n setup
├── content/         # Typed content — profile, experience, projects, skills, locales
├── core/            # Framework-agnostic logic: hooks, api clients, theming, SEO
├── design-system/   # Reusable, presentational primitives (Button, Modal, Section, …)
├── features/        # Business logic per section (Hero, Contact, Projects, …)
├── pages/           # Route-level composition
├── shared/           # Cross-feature app "chrome" (header, footer, command palette, …)
├── styles/          # Design tokens, themes, global styles
└── test/            # Vitest setup

api/                 # Vercel Edge Functions (AI assistant, GitHub proxy)
e2e/                 # Playwright end-to-end tests
```

Full rationale for this layering — dependency direction, where a given piece of logic belongs — is in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Testing

85 unit/component tests (Vitest + React Testing Library) targeting code with actual logic — hooks, forms, the command palette, the two serverless handlers — plus 5 Playwright end-to-end scenarios covering the flows a real visitor goes through. Full breakdown, conventions, and how to run everything: [`TESTING.md`](./TESTING.md).

## Architecture

Layering, dependency rules, and the reasoning behind the bigger technical decisions (View Transitions over a JS animation library, no global state, why the AI assistant is grounded server-side) are documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Deployment

Built for [Vercel](https://vercel.com): `vite build` produces the static site, and everything under `api/` deploys automatically as Edge Functions — no extra config. To deploy: connect this repo to a Vercel project, set the five variables from [Environment variables](#environment-variables) in its dashboard (Settings → Environment Variables), and deploy. `SITE_URL` (`src/core/seo/seo.constants.ts`) should match whatever domain you deploy to, since it's used to build canonical/Open Graph URLs.

## Engineering guidelines

[`CLAUDE.md`](./CLAUDE.md) is the source of truth for architecture, tooling, and quality standards on this project — TypeScript strictness, component conventions, accessibility, performance, and dependency discipline. `AGENTS.md` points to it for tools that look for that filename by convention.

## Contact

**Jhon David Toro Muriel** — [GitHub](https://github.com/Jhon-Toro) · [toromurieljhon@gmail.com](mailto:toromurieljhon@gmail.com)
