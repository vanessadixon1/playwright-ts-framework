import { test, expect } from '../../src/fixtures';

test.describe('Inventory Page', () => {
  test.use({ storageState: undefined });

  test('@smoke - inventory page loads with products', async ({ authenticatedPage }) => {
    const count = await authenticatedPage.getInventoryCount();
    expect(count).toBeGreaterThan(0);
  });

  test('@regression - products sorted A-Z by default', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('az');
    const items = await authenticatedPage['page'].locator('.inventory_item_name').allTextContents();
    const sorted = [...items].sort((a, b) => a.localeCompare(b));
    expect(items).toEqual(sorted);
  });

  test('@regression - products sorted by price low-to-high', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('lohi');
    const prices = await authenticatedPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('@regression - products sorted by price high-to-low', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('hilo');
    const prices = await authenticatedPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('@smoke - add item to cart updates badge count', async ({ authenticatedPage }) => {
    await authenticatedPage.assertCartCount(0);
    await authenticatedPage.addItemToCart('Sauce Labs Backpack');
    await authenticatedPage.assertCartCount(1);
  });

  test('@regression - add multiple items to cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart('Sauce Labs Backpack');
    await authenticatedPage.addItemToCart('Sauce Labs Bike Light');
    await authenticatedPage.assertCartCount(2);
  });

  test('@regression - remove item from cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart('Sauce Labs Backpack');
    await authenticatedPage.assertCartCount(1);
    await authenticatedPage.removeItemFromCart('Sauce Labs Backpack');
    await authenticatedPage.assertCartCount(0);
  });

  test('@regression - navigate to cart page', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addItemToCart('Sauce Labs Backpack');
    await authenticatedPage.goToCart();
    await cartPage.assertItemInCart('Sauce Labs Backpack');
  });

  test('@smoke - logout redirects to login page', async ({ authenticatedPage, loginPage }) => {
    await authenticatedPage.logout();
    await loginPage.assertLoginFormVisible();
  });
});
