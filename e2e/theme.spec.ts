import { expect, test } from '@playwright/test'

test('toggles dark mode from the tools menu and persists it across a reload', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark')

  await page.getByRole('button', { name: 'Open tools menu' }).click()
  const themeSwitch = page.getByRole('switch')
  await themeSwitch.click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(themeSwitch).toHaveAttribute('aria-checked', 'true')

  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
