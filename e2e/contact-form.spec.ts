import { expect, test } from '@playwright/test'

// Doesn't assert success specifically: EmailJS credentials are a secret not
// present in every environment this suite runs in. What must always hold,
// regardless of whether the send actually goes through, is that submitting
// gives the visitor a clear, visible outcome instead of silently doing
// nothing — so this checks that the status region ends up non-empty.
test('submits the contact form and shows a status message', async ({ page }) => {
  await page.goto('/#contact')

  await page.getByLabel('Name', { exact: true }).fill('Ada Lovelace')
  await page.getByLabel('Email', { exact: true }).fill('ada@example.com')
  await page.getByLabel('Message', { exact: true }).fill('Hello from the Playwright suite.')

  await page.getByRole('button', { name: /send message/i }).click()

  const status = page.getByRole('status')
  await expect(status).not.toBeEmpty({ timeout: 10_000 })
})
