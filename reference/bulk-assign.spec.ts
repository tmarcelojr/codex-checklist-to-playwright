import { test, expect } from '@playwright/test';

test('bulk assignment changes only selected tickets and survives refresh', async ({ page }) => {
  const row = (id: string) => page.getByRole('row').filter({
    has: page.getByRole('checkbox', { name: `Select ${id}`, exact: true })
  });
  // These expectations come from the documented release checklist and seed data,
  // not the app's assignment implementation or its response message.
  const initialOwners: Record<string, string> = {
    'NS-1042': 'Alex', 'NS-1043': 'Sam', 'NS-1044': 'Alex',
    'NS-1045': 'Sam', 'NS-1046': 'Maya', 'NS-1047': 'Alex'
  };
  const expectedOwners = { ...initialOwners, 'NS-1042': 'Maya', 'NS-1043': 'Maya' };
  async function checkOwners(expected: Record<string, string>) {
    await expect(page.getByRole('checkbox')).toHaveCount(6);
    for (const [id, name] of Object.entries(expected)) {
      await expect(row(id).getByRole('cell', { name, exact: true }), `${id} must belong to ${name}`).toBeVisible();
    }
  }

  await test.step('Check the starting owners', async () => {
    await page.goto('/');
    await checkOwners(initialOwners);
  });
  await test.step('Select two tickets and assign them to Maya', async () => {
    await page.getByRole('checkbox', { name: 'Select NS-1042', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Select NS-1043', exact: true }).check();
    await page.getByRole('combobox', { name: 'Assign to', exact: true }).selectOption('Maya');
    await page.getByRole('button', { name: 'Assign tickets', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('2 tickets assigned to Maya.');
  });
  await test.step('Check both selected and every unselected ticket', async () => {
    await checkOwners(expectedOwners);
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(0);
  });
  await test.step('Refresh and verify the saved owners', async () => {
    await page.reload();
    await checkOwners(expectedOwners);
  });
});
