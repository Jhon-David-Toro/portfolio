import { expect, test } from '@playwright/test'

test('opens a project case study and closes it again', async ({ page }) => {
  await page.goto('/#projects')

  const firstCard = page.getByRole('button', { name: /Analytics Dashboard/ })
  await firstCard.scrollIntoViewIfNeeded()
  await firstCard.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible()

  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).not.toBeVisible()
})
