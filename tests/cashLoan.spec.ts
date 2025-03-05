import { test, expect } from '@playwright/test';
import { CashLoanPage } from './../pages/cashLoanPage';

test.describe('Bank of Baku Get Cash Loan', () => {
  test('Should apply for a cash loan successfully', async ({ page }) => {
    const cashLoanPage = new CashLoanPage(page);
    
    await cashLoanPage.navigateToLoans();
    await expect(page).toHaveURL(/loans/i);
    
    await cashLoanPage.applyForLoan('4cd0nuz', '553554356');
    await cashLoanPage.verifyOrderSuccess();
  });
});