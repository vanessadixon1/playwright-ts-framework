import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  readonly pageTitle = 'Swag Labs';
  readonly pageUrl = '/';

  private get usernameInput() { return this.page.locator('[data-test="username"]'); }
  private get passwordInput() { return this.page.locator('[data-test="password"]'); }
  private get loginButton()   { return this.page.locator('[data-test="login-button"]'); }
  private get errorMessage()  { return this.page.locator('[data-test="error"]'); }
  private get loginLogo()     { return this.page.locator('.login_logo'); }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in as: ${username}`);
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.loginButton.click();
  }

  async assertLoginFormVisible(): Promise<void> {
    await expect(this.loginLogo).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
    logger.info(`Error message verified: ${message}`);
  }

  async assertNoErrorMessage(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
