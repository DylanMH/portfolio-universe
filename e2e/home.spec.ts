import { test, expect } from '@playwright/test'

test('homepage loads and navigation opens sections', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Dylan Houston/)
  await expect(page.locator('nav')).toBeVisible()

  await page.getByText('Skills', { exact: false }).first().click()

  await page.waitForURL('**/skills')
  await expect(page.locator('h2:has-text("Skills")')).toBeVisible()
})
