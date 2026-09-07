import { fileURLToPath } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import { localApiPlugin } from './localApiPlugin.js'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only auto-loads VITE_-prefixed vars into process.env for its own
  // import.meta.env handling — server-only vars like GEMINI_API_KEY (see
  // .env.example) need to be loaded and assigned explicitly to be visible
  // to api/*.ts when localApiPlugin runs it in dev. loadEnv's 3rd arg
  // ('') means "load every var, not just VITE_-prefixed ones".
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), localApiPlugin()],
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
    build: {
      // Vite's default build target downlevels syntax for a wider set of
      // browsers than this portfolio needs to support — Lighthouse flagged
      // the resulting transforms/helpers as unnecessary "legacy JavaScript"
      // shipped to browsers that don't need them. Every evergreen browser
      // (including Safari, which lagged on some ES2022 features) has
      // supported this baseline for years.
      target: 'es2022',
    },
  }
})
