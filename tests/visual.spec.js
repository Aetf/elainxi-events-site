import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  // Wait for any animations to settle
  await page.waitForTimeout(1000); 
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test('tutorial page visual regression', async ({ page }) => {
  await page.goto('/tutorial.html');
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot('tutorial.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
});
