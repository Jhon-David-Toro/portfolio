import { expect, test } from '@playwright/test'

test('loads the portfolio home page with the hero content visible', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Jhon David Toro Muriel/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jhon David Toro Muriel')
  await expect(page.getByRole('banner').getByRole('link', { name: 'JT' })).toBeVisible()
})
