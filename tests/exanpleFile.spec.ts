import { test, expect } from '@playwright/test';

const URL = 'https://www.saucedemo.com/';

test.describe('SauceDemo Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // 1. Positive
  test('Valid login', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  // 2. Negative - wrong password
  test('Invalid password', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('wrong_pass');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText(
      'Username and password do not match'
    );
  });

  // 3. Negative - wrong username
  test('Invalid username', async ({ page }) => {
    await page.getByTestId('username').fill('wrong_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
  });

  // 4. Validation - empty username
  test('Empty username', async ({ page }) => {
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('Username is required');
  });

  // 5. Validation - empty password
  test('Empty password', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('Password is required');
  });

  // 6. Business rule - locked user
  test('Locked out user', async ({ page }) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('locked out');
  });

  // 7. Session - logout
  test('Logout test', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    await expect(page).toHaveURL(URL);
    await expect(page.getByTestId('login-button')).toBeVisible();

    // 8. Session - back button after logout
    await page.goBack();
    await expect(page).toHaveURL(URL);
    await expect(page.getByTestId('login-button')).toBeVisible();

      // 8. UI check - error message can be closed
  test('Close error message', async ({ page }) => {
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();

    await page.getByTestId('error-button').click();

    await expect(page.getByTestId('error')).toHaveCount(0);
  });
  
  });
});