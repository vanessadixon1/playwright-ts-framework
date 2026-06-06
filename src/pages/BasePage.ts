import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract get pageTitle(): string;
  abstract get pageUrl(): string;

  async navigate(): Promise<void> {
    logger.info(`Navigating to: ${this.pageUrl}`);
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async assertOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.pageUrl));
  }

  async assertPageTitle(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  protected async clickAndWait(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await this.waitForPageLoad();
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
    logger.info(`Screenshot saved: ${name}`);
  }
}
