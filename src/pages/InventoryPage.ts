import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  readonly pageTitle = 'Swag Labs';
  readonly pageUrl = '/inventory.html';

  private get inventoryList()      { return this.page.locator('.inventory_list'); }
  private get inventoryItems()     { return this.page.locator('.inventory_item'); }
  private get cartIcon()           { return this.page.locator('.shopping_cart_link'); }
  private get cartBadge()          { return this.page.locator('.shopping_cart_badge'); }
  private get sortDropdown()       { return this.page.locator('[data-test="product-sort-container"]'); }
  private get burgerMenuButton()   { return this.page.locator('#react-burger-menu-btn'); }
  private get logoutLink()         { return this.page.locator('#logout_sidebar_link'); }
  private get pageHeader()         { return this.page.locator('.primary_header'); }

  private addToCartButton(productName: string) {
    return this.page.locator(`.inventory_item:has-text("${productName}") button`);
  }

  private itemPrice(productName: string) {
    return this.page.locator(`.inventory_item:has-text("${productName}") .inventory_item_price`);
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.inventoryList).toBeVisible();
    logger.info('Confirmed on inventory page');
  }

  async getInventoryCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addItemToCart(productName: string): Promise<void> {
    logger.info(`Adding to cart: ${productName}`);
    await this.addToCartButton(productName).click();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    logger.info(`Removing from cart: ${productName}`);
    await this.page
      .locator(`.inventory_item:has-text("${productName}") button:has-text("Remove")`)
      .click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    if (!(await badge.isVisible())) return 0;
    return parseInt(await badge.textContent() ?? '0', 10);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    logger.info(`Sorting products by: ${option}`);
    await this.sortDropdown.selectOption(option);
  }

  async getItemPrices(): Promise<number[]> {
    const priceElements = this.page.locator('.inventory_item_price');
    const texts = await priceElements.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    logger.info('Logged out successfully');
  }

  async assertCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(expected));
    }
  }
}
