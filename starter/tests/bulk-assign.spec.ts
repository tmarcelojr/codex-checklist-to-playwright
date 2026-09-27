import { test, expect } from '@playwright/test';

test('bulk assignment changes only selected owners and survives refresh', async ({ page }) => {
  // Expected starting state is documented in README.md.
  const startingOwners = {
    'NS-1042': 'Alex',
    'NS-1043': 'Sam',
    'NS-1044': 'Alex',
    'NS-1045': 'Sam',
    'NS-1046': 'Maya',
    'NS-1047': 'Alex',
  };
  const expectedOwners = { ...startingOwners, 'NS-1042': 'Maya', 'NS-1043': 'Maya' };
  const tickets = page.getByRole('table', { name: 'Support tickets' });

  async function checkOwners(owners: Record<string, string>) {
    await expect(tickets.getByRole('checkbox')).toHaveCount(6);
    for (const [id, owner] of Object.entries(owners)) {
      const row = tickets.getByRole('row').filter({
        has: page.getByRole('checkbox', { name: `Select ${id}`, exact: true }),
      });
      await expect(row.getByRole('cell', { name: owner, exact: true })).toBeVisible();
    }
  }

  await test.step('Open the support queue and check starting owners', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Support queue' })).toBeVisible();
    await checkOwners(startingOwners);
  });

  await test.step('Select NS-1042 and NS-1043 and assign both to Maya', async () => {
    await tickets.getByRole('checkbox', { name: 'Select NS-1042', exact: true }).check();
    await tickets.getByRole('checkbox', { name: 'Select NS-1043', exact: true }).check();
    await page.getByLabel('Assign to', { exact: true }).selectOption({ label: 'Maya' });
    await page.getByRole('button', { name: 'Assign tickets', exact: true }).click();
  });

  await test.step('Check both changed owners and every unchanged owner', async () => {
    await checkOwners(expectedOwners);
  });

  await test.step('Refresh and check all six owners remain correct', async () => {
    await page.reload();
    await checkOwners(expectedOwners);
  });
});
