import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

// Separate from vite.config.ts on purpose: the app's own config wires up
// the React Compiler babel pass and the local /api dev proxy, neither of
// which tests need — keeping this minimal avoids coupling test runs to
// dev-server-only plugins.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  // Dummy EmailJS credentials so ContactForm's tests exercise the real
  // submit/success/error flow (mocking @emailjs/browser itself) instead of
  // the short-circuited "not configured" branch — these are fake values,
  // never read outside the test environment.
  define: {
    'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify('test-service'),
    'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify('test-template'),
    'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify('test-public-key'),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      // Deliberately an allowlist, not "everything minus exclusions": most
      // of this codebase is presentational JSX (design-system primitives,
      // Section components, layout chrome) with no branches worth covering
      // — including it would only dilute the percentage without catching
      // real bugs. This list is the actual "code with significant logic"
      // the project's test suite targets; it should grow as more such code
      // is added, not as a way to inflate the number.
      include: [
        'api/chat.ts',
        'api/github.ts',
        'src/app/i18n/i18n.ts',
        'src/content/profile/profile.ts',
        'src/content/projects/projects.ts',
        'src/core/api/assistantClient.ts',
        'src/core/date/formatMonthYear.ts',
        'src/core/style/cx.ts',
        'src/core/theme/useTheme.ts',
        'src/design-system/Button/Button.tsx',
        'src/design-system/ThemeToggle/ThemeToggle.tsx',
        'src/features/about/aboutStats.ts',
        'src/features/contact/ContactForm.tsx',
        'src/shared/layout/CommandPalette/CommandPalette.tsx',
        'src/shared/layout/CommandPalette/CommandPalette.helpers.ts',
        'src/shared/layout/GithubRepos/githubApi.ts',
        'src/shared/layout/GithubRepos/useGithubActivity.ts',
        'src/shared/layout/SiteFooter/SiteFooter.helpers.ts',
        'src/shared/layout/Terminal/Terminal.helpers.ts',
      ],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
    },
  },
})
