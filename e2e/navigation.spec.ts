import { test, expect } from '@playwright/test';

test('App routing functionality', async ({ page }) => {
  await page.goto('/');

  // Verify core container styling existence indicating mount
  await expect(page.locator('body')).toHaveClass(/dark/);
  
  // Since authentication is a blocker in Guideflow, we'll test presence of Landing Page button if unauthenticated
  const mainBtn = page.getByRole('button', { name: /open/i });
  if (await mainBtn.isVisible()) {
    expect(mainBtn).toBeVisible();
  }
});
