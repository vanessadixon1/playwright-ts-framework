import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const ENV = {
  BASE_URL: optional('BASE_URL', 'https://www.saucedemo.com'),
  API_BASE_URL: optional('API_BASE_URL', 'https://dummyjson.com'),
  STANDARD_USER: optional('STANDARD_USER', 'standard_user'),
  LOCKED_USER: optional('LOCKED_USER', 'locked_out_user'),
  TEST_PASSWORD: optional('TEST_PASSWORD', 'secret_sauce'),
  API_TOKEN: optional('API_TOKEN', ''),
  IS_CI: process.env.CI === 'true',
} as const;

export { requireEnv, optional as optionalEnv };
