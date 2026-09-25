import { expect, test } from '@playwright/test';
import { latestCode, signIn, signUp, uniqueUser } from './helpers';

test('protected pages send signed-out visitors to sign in', async ({ page }) => {
  for (const path of ['/', '/home', '/settings', '/onboarding']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/sign-in$/);
  }
});

test('a new user signs up with an email code and creates a workspace', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

  const user = await signUp(page, testInfo);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('أهلًا نورة');
  await expect(
    page.getByRole('main').getByText(`${user.slug}.rasmi.sa`, { exact: true }),
  ).toBeVisible();
  // Hijri date is shown next to the Gregorian one.
  await expect(page.locator('.ph .muted')).toContainText('هـ');
});

test('a wrong code is rejected with a clear message', async ({ page }, testInfo) => {
  const { email } = uniqueUser(testInfo);
  await page.goto('/sign-in');
  await page.locator('#email').fill(email);
  await page.locator('button[name=intent][value=request]').click();
  const code = await latestCode(email);
  await page.locator('#code').fill(code === '000000' ? '111111' : '000000');
  await page.locator('button[name=intent][value=verify]').click();
  await expect(page.locator('.banner[role=alert]')).toContainText('الرمز غير صحيح');
  await expect(page).toHaveURL(/\/sign-in$/);
});

test('an invalid email is rejected', async ({ page }) => {
  await page.goto('/sign-in');
  await page.locator('#email').fill('not-an-email');
  await page.locator('button[name=intent][value=request]').click();
  await expect(page.locator('.banner[role=alert]')).toContainText('بريدًا إلكترونيًا صحيحًا');
});

test('switching to English flips the layout to left-to-right and is remembered', async ({
  page,
}, testInfo) => {
  await signUp(page, testInfo);
  await page.goto('/settings');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // The preference is stored on the account, so it survives signing out and back in.
  await page.getByRole('button', { name: 'Sign out' }).last().click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Sign in or create an account');
});

test('the owner can rename the workspace and change its address', async ({ page }, testInfo) => {
  const user = await signUp(page, testInfo);
  await page.goto('/settings');
  await page.locator('#workspaceName').fill('Noura Design Studio');
  await page.locator('#slug').fill(`${user.slug}-2`.slice(0, 30));
  await page
    .locator('#workspaceName')
    .locator('xpath=ancestor::form')
    .locator('button[type=submit]')
    .click();
  await expect(page.getByRole('status')).toContainText('تم الحفظ');
});

test('a page address that is already taken is refused', async ({ browser, page }, testInfo) => {
  const first = await signUp(page, testInfo);

  const other = await browser.newContext({ locale: 'ar-SA' });
  const page2 = await other.newPage();
  await signIn(page2, uniqueUser(testInfo).email);
  await expect(page2).toHaveURL(/\/onboarding$/);
  await page2.locator('#workspaceName').fill('Another studio');
  await page2.locator('#slug').fill(first.slug);
  await page2.locator('button[type=submit]').click();
  await expect(page2.locator('.banner[role=alert]')).toContainText('هذا الرابط مستخدم');
  await other.close();
});

test('two accounts never see each other’s workspace', async ({ browser, page }, testInfo) => {
  const alice = await signUp(page, testInfo);
  const other = await browser.newContext({ locale: 'ar-SA' });
  const page2 = await other.newPage();
  const bob = await signUp(page2, testInfo);
  await page2.goto('/settings');
  await expect(page2.locator('#slug')).toHaveValue(bob.slug);
  await expect(page2.getByText(alice.slug)).toHaveCount(0);
  await other.close();
});
