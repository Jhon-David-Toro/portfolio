import { defineConfig, devices } from '@playwright/test'

const PORT = 5173
const BASE_URL = `http://localhost:${PORT}`

// Points at the Vite dev server rather than a production build/preview:
// fast to boot for local `test:e2e:ui` iteration, and CI runs its own
// `pnpm build` as a separate, independent check (see .github/workflows/ci.yml)
// rather than gating e2e on it.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Locally, drive the system's own Edge/Chrome instead of Playwright's
        // bundled Chromium — some networks can't reach cdn.playwright.dev to
        // download it (a real issue hit during development; see TESTING.md).
        // CI always has unrestricted network, so it keeps using Playwright's
        // own pinned Chromium there for full reproducibility across runs.
        ...(process.env.CI ? {} : { channel: 'msedge' }),
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
