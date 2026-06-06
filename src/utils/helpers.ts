import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { logger } from './logger';

export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

export async function retryAction<T>(
  action: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (err) {
      logger.warn(`Attempt ${attempt}/${retries} failed: ${(err as Error).message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('retryAction exhausted all attempts');
}

export function generateRandomEmail(): string {
  return faker.internet.email().toLowerCase();
}

export function generateRandomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    job: faker.person.jobTitle(),
  };
}

export function generateRandomString(length = 8): string {
  return faker.string.alphanumeric(length);
}

export async function takeNamedScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `reports/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

export function parseEnvNumber(key: string, fallback: number): number {
  const val = process.env[key];
  const parsed = val ? parseInt(val, 10) : NaN;
  return isNaN(parsed) ? fallback : parsed;
}

export function maskSensitive(value: string): string {
  if (value.length <= 4) return '****';
  return `${value.slice(0, 2)}${'*'.repeat(value.length - 4)}${value.slice(-2)}`;
}
