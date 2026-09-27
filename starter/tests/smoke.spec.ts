import { test, expect } from '@playwright/test';

test('queue is ready before a user chooses tickets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Support queue' })).toBeVisible();
  await expect(page.getByRole('checkbox')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Assign tickets' })).toBeDisabled();
});
