import { readFile } from 'node:fs/promises';
import { expect, type Page, type TestInfo } from '@playwright/test';

const MAILBOX = '.data/e2e/mailbox.log';

/** Reads the newest sign-in code emailed to `email` by the file mail transport. */
export async function latestCode(email: string): Promise<string> {
  let code: string | undefined;
  await expect
    .poll(async () => {
      const text = await readFile(MAILBOX, 'utf8').catch(() => '');
      const mails = text
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as { to: string; subject: string })
        .filter((mail) => mail.to === email);
      code = mails.at(-1)?.subject.match(/\d{6}/)?.[0];
      return code;
    })
    .toBeTruthy();
  return code!;
}

export function uniqueUser(testInfo: TestInfo) {
  const id = `${testInfo.project.name}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return { email: `${id}@example.com`, slug: `t-${id}`.slice(0, 30).replace(/-+$/, '') };
}

export async function signIn(page: Page, email: string) {
  await page.goto('/sign-in');
  await page.locator('#email').fill(email);
  await page.locator('button[name=intent][value=request]').click();
  await expect(page.locator('#code')).toBeVisible();
  await page.locator('#code').fill(await latestCode(email));
  await page.locator('button[name=intent][value=verify]').click();
}

/** Signs up a new user and completes onboarding. Ends on /home. */
export async function signUp(page: Page, testInfo: TestInfo) {
  const user = uniqueUser(testInfo);
  await signIn(page, user.email);
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.locator('#name').fill('نورة العتيبي');
  await page.locator('#workspaceName').fill('استوديو نورة');
  await page.locator('#slug').fill(user.slug);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/home$/);
  return user;
}
