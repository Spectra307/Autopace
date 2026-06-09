import { test, expect } from '@playwright/test';

test('homepage loads and shows Autopace branding', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Autopace/);
  await expect(page.getByText('Autopace Templates Marketplace')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse templates' })).toBeVisible();
});
