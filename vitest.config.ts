import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Dates are domain data here (a bonus code's expiry is a real deadline a
    // customer relies on), so the suite must not depend on the machine that
    // runs it. Pinning the zone means a green run in Zurich is a green run on
    // a UTC CI runner — the failure mode is otherwise "passed locally, failed
    // in CI" with nothing in the diff to explain it.
    env: { TZ: 'UTC' },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
