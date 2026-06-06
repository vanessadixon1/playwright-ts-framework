import { test, expect } from '../../src/fixtures';
import { USERS } from '../../src/data/users';

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('@smoke - login form is visible', async ({ loginPage }) => {
    await loginPage.assertLoginFormVisible();
  });

  test('@smoke - successful login with standard user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.assertOnInventoryPage();
    expect(await inventoryPage.getCurrentUrl()).toContain('/inventory.html');
  });

  test('@regression - locked user sees error message', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out');
  });

  test('@regression - invalid credentials shows error', async ({ loginPage }) => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);
    await loginPage.assertErrorMessage('Epic sadface: Username and password do not match');
  });

  test('@regression - empty username shows required error', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.assertErrorMessage('Epic sadface: Username is required');
  });

  test('@regression - empty password shows required error', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, '');
    await loginPage.assertErrorMessage('Epic sadface: Password is required');
  });
});
