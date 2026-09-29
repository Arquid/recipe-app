import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      'e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      thresholds: {
        statements: 85,
        branches: 70,
        functions: 85,
        lines: 90,
      },
    },
  },
})
