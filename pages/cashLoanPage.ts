import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './homePage';

export class CashLoanPage {
  private readonly homePage: HomePage;
  private readonly loansLink: Locator;
  private readonly cashLoansLink: Locator;
  private readonly applyButton: Locator;
  private loanPopupPage?: Page;

  constructor(public readonly page: Page) {
    this.homePage = new HomePage(page);
    this.loansLink = this.page.getByRole('link', { name: 'Loans', exact: true });
    this.cashLoansLink = this.page.getByRole('banner').getByRole('link', { name: 'Cash loans' });
    this.applyButton = this.page.locator('.btn-m').first();
  }

  async navigateToLoans() {
    await this.homePage.goto();
    await this.loansLink.hover();
    await this.cashLoansLink.click();
  }

  async applyForLoan(pin: string, phone: string) {
    const popupPromise = this.page.waitForEvent('popup');
    await this.applyButton.click();
    this.loanPopupPage = await popupPromise;

    const pinInput = this.loanPopupPage.locator('input[formcontrolname="pin"]');
    const phoneInput = this.loanPopupPage.locator('input[formcontrolname="phone"]');
    const agreementCheckbox = this.loanPopupPage.locator('input[formcontrolname="agreementStatus"]');

    await pinInput.fill(pin);
    await phoneInput.type(phone, { delay: 100 });

    if (!(await agreementCheckbox.isChecked())) {
        await agreementCheckbox.check();
    }
    await expect(agreementCheckbox).toBeChecked();

    const orderButton = this.loanPopupPage.getByRole('button', { name: 'Order' });
    await orderButton.waitFor();
    await orderButton.click();
  }

  async verifyOrderSuccess() {
    if (!this.loanPopupPage) {
      throw new Error('Loan popup page is not available. Make sure applyForLoan() was called first.');
    }
    
    const successMessage = this.loanPopupPage.getByText('Your order has been accepted');
    await successMessage.waitFor();
    await expect(successMessage).toBeVisible();
  }
}
