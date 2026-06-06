import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { UsersApi } from '../api/endpoints/UsersApi';
import { AuthApi } from '../api/endpoints/AuthApi';
import { ENV } from '../utils/env';
import { logger } from '../utils/logger';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

type ApiFixtures = {
  usersApi: UsersApi;
  authApi: AuthApi;
};

type AuthFixtures = {
  authenticatedPage: InventoryPage;
};

export const test = base.extend<PageFixtures & ApiFixtures & AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request, ENV.API_BASE_URL));
  },

  authApi: async ({ request }, use) => {
    await use(new AuthApi(request, ENV.API_BASE_URL));
  },

  authenticatedPage: async ({ page }, use) => {
    logger.info('Setting up authenticated session');
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(ENV.STANDARD_USER, ENV.TEST_PASSWORD);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertOnInventoryPage();
    await use(inventoryPage);
  },
});

export { expect };
