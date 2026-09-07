import { expect, test } from '@playwright/test'

test('navigates to the Projects section from the primary nav', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Projects' }).click()

  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole('heading', { name: 'Projects', level: 2 })).toBeInViewport()
})
