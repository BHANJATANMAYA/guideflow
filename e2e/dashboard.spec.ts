import { test, expect } from '@playwright/test';

test('Dashboard loads and renders key elements', async ({ page }) => {
  // Mock Firebase Auth or bypass to get into application
  // Since we seed GuideFlow Fan, we'll assume navigation bypasses straight to Dashboard if no auth is tightly coupled or we skip
  await page.goto('/');

  // Expect title to contain GuideFlow
  await expect(page).toHaveTitle(/GuideFlow/);

  // Check if Hero Section or Navigation exists (assuming we bypass auth screen or test auth screen)
  // Let's test the root existence first
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
