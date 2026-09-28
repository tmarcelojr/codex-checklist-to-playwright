import { test, expect } from '@playwright/test';

test('bulk assignment changes only selected tickets and survives refresh', async ({ page }) => {
  const row = (ticketId: string) => page.getByRole('row').filter({
    has: page.getByRole('checkbox', { name: `Select ${ticketId}`, exact: true })
  });
  const initialOwners: Record<string, string> = {
    'NS-1042': 'Alex',
    'NS-1043': 'Sam',
    'NS-1044': 'Alex',
    'NS-1045': 'Sam',
    'NS-1046': 'Maya',
    'NS-1047': 'Alex'
  };
  const assignedOwners = {
    ...initialOwners,
    'NS-1042': 'Maya',
    'NS-1043': 'Maya'
  };

  async function expectOwners(expectedOwners: Record<string, string>) {
    await expect(page.getByRole('checkbox')).toHaveCount(6);
    for (const [ticketId, owner] of Object.entries(expectedOwners)) {
      await expect(
        row(ticketId).getByRole('cell', { name: owner, exact: true }),
        `${ticketId} should belong to ${owner}`
      ).toBeVisible();
    }
  }

  await test.step('Confirm the documented starting owners', async () => {
    await page.goto('/');
    await expectOwners(initialOwners);
  });

  await test.step('Assign the two selected tickets to Maya', async () => {
    await page.getByRole('checkbox', { name: 'Select NS-1042', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Select NS-1043', exact: true }).check();
    await page.getByRole('combobox', { name: 'Assign to', exact: true }).selectOption('Maya');
    await page.getByRole('button', { name: 'Assign tickets', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('2 tickets assigned to Maya.');
  });

  await test.step('Confirm selected and unselected ticket owners', async () => {
    await expectOwners(assignedOwners);
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0);
  });

  await test.step('Refresh and confirm all six owners persist', async () => {
    await page.reload();
    await expectOwners(assignedOwners);
  });
});
