# Testing

## Stack

- **Unit / component tests** — [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) + `@testing-library/user-event`, running in `jsdom`.
- **E2E tests** — [Playwright](https://playwright.dev), against the Vite dev server.
- **Coverage** — `@vitest/coverage-v8`.

## Running tests

```bash
pnpm test              # unit/component tests, once
pnpm test:watch        # unit/component tests, watch mode
pnpm test:coverage     # unit/component tests with a coverage report

pnpm test:e2e          # e2e tests, headless
pnpm test:e2e:ui       # Playwright's UI mode — step through/inspect a run visually
pnpm test:e2e:headed   # e2e tests in a visible browser window
```

The first time you run `pnpm test:e2e*`, install Playwright's browser once:

```bash
pnpm exec playwright install --with-deps chromium
```

`pnpm test:e2e` starts the Vite dev server itself (`playwright.config.ts`'s `webServer`) — you don't need `pnpm dev` running separately, though it'll reuse one if you already have it up.

## What's tested, and why

Unit/component tests target code with actual logic — the areas [CLAUDE.md](./CLAUDE.md) calls out (utilities, hooks, forms, filters, theme switching, loading/error states) — not presentational components that just render props as markup:

| Area | File(s) |
|---|---|
| Theme state, persistence, OS-preference fallback | `src/core/theme/useTheme.ts` |
| Contact form: validation, submit/success/error states | `src/features/contact/ContactForm.tsx` |
| Command palette: open/close, filtering, keyboard nav | `src/shared/layout/CommandPalette/*` |
| Live GitHub data: cache, fetch, loading/error/retry | `src/shared/layout/GithubRepos/*` |
| AI assistant client | `src/core/api/assistantClient.ts` |
| Polymorphic `Button` (button / link / router `Link`) | `src/design-system/Button/Button.tsx` |
| `ThemeToggle` interaction | `src/design-system/ThemeToggle/ThemeToggle.tsx` |
| Date/stat/score formatting utilities | `src/core/date/*`, `src/features/about/aboutStats.ts`, `src/shared/layout/SiteFooter/SiteFooter.helpers.ts` |
| Serverless API handlers (`/api/chat`, `/api/github`) — validation, error codes, response shaping | `api/*.ts` |

E2E covers the handful of flows a recruiter or visitor actually goes through: the home page loading, navigating to a section, opening/closing a project, toggling dark mode (and it persisting on reload), and submitting the contact form. It deliberately does **not** try to cover every page state — that's what the unit/component tests are for.

Purely presentational components (design-system primitives with no branching, `Section`/`Container`/layout wrappers, icons) are intentionally untested — they have no behavior to assert on beyond "does it render," which unit tests can't meaningfully verify anyway.

## Coverage

`vitest.config.ts`'s `coverage.include` is an **allowlist** of the files above — not "everything except a few exclusions." Most of the codebase is presentational JSX with no logic; including it in the coverage denominator would just dilute the percentage without catching real bugs. Add a file to that list only when it actually has logic worth covering.

Thresholds (70% statements/functions/lines, 65% branches) are enforced by `pnpm test:coverage`. They're a floor, not a target — don't write a test just to nudge the number up.

## Conventions

- Queries prefer role, label, and visible text (`getByRole`, `getByLabelText`) over CSS classes or DOM structure — see [CLAUDE.md](./CLAUDE.md)'s accessibility guidance. If a component can't be queried this way, that's usually a sign it needs a real accessible name, not a `data-testid`.
- `src/test/setup.ts` initializes the app's real i18next instance (so components render actual copy, not translation keys) and polyfills a few browser APIs jsdom doesn't implement (`matchMedia`, `IntersectionObserver`, `isContentEditable`).
- `api/*.test.ts` files run under Vitest's `node` environment (`/* @vitest-environment node */`) instead of `jsdom` — they're server-side Edge Function handlers with no DOM.
