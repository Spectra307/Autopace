# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> homepage loads and shows Autopace branding
- Location: tests\homepage.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Autopace Templates Marketplace')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Autopace Templates Marketplace')

```

```yaml
- main:
  - img "Next.js logo"
  - list:
    - listitem:
      - text: Get started by editing
      - code: src/app/page.tsx
      - text: .
    - listitem: Save and see your changes instantly.
  - link "Vercel logomark Deploy now":
    - /url: https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
    - img "Vercel logomark"
    - text: Deploy now
  - link "Read our docs":
    - /url: https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
- contentinfo:
  - link "Learn":
    - /url: https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
  - link "Examples":
    - /url: https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
  - link "Go to nextjs.org →":
    - /url: https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
- alert
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test('homepage loads and shows Autopace branding', async ({ page }) => {
  4 |   await page.goto('/');
  5 |   await expect(page).toHaveTitle(/Autopace/);
> 6 |   await expect(page.getByText('Autopace Templates Marketplace')).toBeVisible();
    |                                                                  ^ Error: expect(locator).toBeVisible() failed
  7 |   await expect(page.getByRole('link', { name: 'Browse templates' })).toBeVisible();
  8 | });
  9 | 
```