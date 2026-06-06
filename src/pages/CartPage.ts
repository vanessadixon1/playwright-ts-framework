import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle = 'Swag Labs';
  readonly pageUrl = '/cart.html';

  private get cartItems()        { return this.page.locator('.cart_item'); }
  private get checkoutButton()   { return this.page.locator('[data-test="checkout"]'); }
  private get continueButton()   { return this.page.locator('[data-test="continue-shopping"]'); }

  private cartItemName(name: string) {
    return this.page.locator(`.cart_item:has-text("${name}")`);
  }

  async assertItemInCart(productName: string): Promise<void> {
    await expect(this.cartItemName(productName)).toBeVisible();
  }

  async assertCartItemCount(expected: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expected);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueButton.click();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
}
