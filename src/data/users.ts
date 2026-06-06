import { ENV } from '../utils/env';

export const USERS = {
  standard: {
    username: ENV.STANDARD_USER,
    password: ENV.TEST_PASSWORD,
  },
  locked: {
    username: ENV.LOCKED_USER,
    password: ENV.TEST_PASSWORD,
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

export const API_USERS = {
  validLogin: {
    username: 'emilys',
    password: 'emilyspass',
  },
  invalidLogin: {
    username: 'nonexistent_user',
    password: 'wrong_password',
  },
} as const;
