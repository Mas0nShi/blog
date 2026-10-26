import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT || 3100)

// When browsers run in the Playwright Docker image (see e2e/run.sh), the
// server on the host is reached through host.docker.internal.
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`
const wsEndpoint = process.env.PW_WS_ENDPOINT

// layout regressions don't need high-DPI captures; keep artifacts small
const mobile = { ...devices['Pixel 7'], deviceScaleFactor: 1 }

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'e2e/.report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'e2e/.report', open: 'never' }]],

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001
    }
  },

  use: {
    baseURL,
    connectOptions: wsEndpoint ? { wsEndpoint } : undefined,
    timezoneId: 'Asia/Shanghai',
    locale: 'zh-CN'
  },

  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' }
    },
    {
      name: 'desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' }
    },
    {
      name: 'mobile-light',
      use: { ...mobile, colorScheme: 'light' }
    },
    {
      name: 'mobile-dark',
      use: { ...mobile, colorScheme: 'dark' }
    }
  ],

  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: `pnpm exec next start -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          NOTION_FIXTURES: process.env.NOTION_FIXTURES || 'replay'
        }
      }
})
