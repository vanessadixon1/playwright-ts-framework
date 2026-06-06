import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 4 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ...(process.env.ALLURE_RESULTS
      ? [['allure-playwright', { resultsDir: 'reports/allure-results' }] as const]
      : []),
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    headless: CI ? true : false,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'tests/ui/**/*.spec.ts',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: 'tests/ui/**/*.spec.ts',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: 'tests/ui/**/*.spec.ts',
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: 'tests/ui/**/*.spec.ts',
    },
    {
      name: 'api',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
      testMatch: 'tests/api/**/*.spec.ts',
    },
  ],

  outputDir: 'reports/test-artifacts',

  webServer: process.env.LOCAL_SERVER
    ? {
        command: 'npm run start:app',
        url: BASE_URL,
        reuseExistingServer: !CI,
        timeout: 120_000,
      }
    : undefined,
});
