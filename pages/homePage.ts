import { Page, expect } from '@playwright/test';

export class HomePage {
    
    constructor(private readonly page: Page) {}
    
    async goto() {
      await this.page.goto('/en');
      await expect(this.page).toHaveTitle(/Bank of Baku/);
    }
}
