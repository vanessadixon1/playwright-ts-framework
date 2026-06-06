import { test, expect } from '../../src/fixtures';

test.describe('Cart Page', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.addItemToCart('Sauce Labs Backpack');
    await authenticatedPage.addItemToCart('Sauce Labs Bike Light');
    await authenticatedPage.goToCart();
  });

  test('@smoke - cart displays added items', async ({ cartPage }) => {
    await cartPage.assertItemInCart('Sauce Labs Backpack');
    await cartPage.assertItemInCart('Sauce Labs Bike Light');
    await cartPage.assertCartItemCount(2);
  });

  test('@regression - cart item names are correct', async ({ cartPage }) => {
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('@regression - continue shopping returns to inventory', async ({ cartPage, inventoryPage }) => {
    await cartPage.continueShopping();
    await inventoryPage.assertOnInventoryPage();
  });

  test('@regression - proceed to checkout navigates correctly', async ({ cartPage, page }) => {
    await cartPage.proceedToCheckout();
    expect(page.url()).toContain('/checkout-step-one.html');
  });
});
