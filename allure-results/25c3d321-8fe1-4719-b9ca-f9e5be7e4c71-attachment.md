# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke/login-ui.smoke.spec.ts >> OrangeHRM - Login Page UI Verification >> копирайт в футере должен содержать актуальную информацию
- Location: tests/smoke/login-ui.smoke.spec.ts:46:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.orangehrm-copyright-wrapper')
Expected substring: "OrangeHRM OS 5.7"
Received string:    "OrangeHRM OS 5.8© 2005 - 2026 OrangeHRM, Inc. All rights reserved."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.orangehrm-copyright-wrapper')
    9 × locator resolved to <div class="orangehrm-copyright-wrapper">…</div>
      - unexpected value "OrangeHRM OS 5.8© 2005 - 2026 OrangeHRM, Inc. All rights reserved."

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - img "company-branding" [ref=e8]
    - generic [ref=e9]:
      - heading "Login" [level=5] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e13]:
          - paragraph [ref=e14]: "Username : Admin"
          - paragraph [ref=e15]: "Password : admin123"
        - generic [ref=e16]:
          - generic [ref=e18]:
            - generic [ref=e19]:
              - generic [ref=e20]: 
              - generic [ref=e21]: Username
            - textbox "Username" [active] [ref=e23]
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: 
              - generic [ref=e28]: Password
            - textbox "Password" [ref=e30]
          - button "Login" [ref=e32] [cursor=pointer]
          - paragraph [ref=e34] [cursor=pointer]: Forgot your password?
      - generic [ref=e35]:
        - generic [ref=e36]:
          - link [ref=e37] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e40] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e43] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e46] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e49]:
          - paragraph [ref=e50]: OrangeHRM OS 5.8
          - paragraph [ref=e51]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e52] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - img "orangehrm-logo" [ref=e54]
```

# Test source

```ts
  1  | import { test, expect } from '../../src/fixtures';
  2  | 
  3  | test.describe('OrangeHRM - Login Page UI Verification', () => {
  4  |   test.beforeEach(async ({ loginPage }) => {
  5  |     await loginPage.navigate();
  6  |   });
  7  | 
  8  |   test('логотип компании должен быть видимым', async ({ page }) => {
  9  |     const logo = page.locator('.orangehrm-login-branding img');
  10 |     await expect(logo).toBeVisible();
  11 |   });
  12 | 
  13 |   test('поле ввода Username должно быть доступно и иметь правильный плейсхолдер', async ({ page }) => {
  14 |     const usernameInput = page.locator('input[name="username"]');
  15 |     await expect(usernameInput).toBeVisible();
  16 |     await expect(usernameInput).toBeEnabled();
  17 |     await expect(usernameInput).toHaveAttribute('placeholder', 'Username');
  18 |   });
  19 | 
  20 |   test('поле ввода Password должно быть доступно и иметь тип "password"', async ({ page }) => {
  21 |     const passwordInput = page.locator('input[name="password"]');
  22 |     await expect(passwordInput).toBeVisible();
  23 |     await expect(passwordInput).toBeEnabled();
  24 |     await expect(passwordInput).toHaveAttribute('type', 'password');
  25 |     await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
  26 |   });
  27 | 
  28 |   test('кнопка Login должна быть видимой и иметь правильный цвет (Orange)', async ({ page }) => {
  29 |     const loginBtn = page.locator('button[type="submit"]');
  30 |     await expect(loginBtn).toBeVisible();
  31 |     await expect(loginBtn).toHaveCSS('background-color', 'rgb(255, 123, 29)');
  32 |     await expect(loginBtn).toHaveCSS('color', 'rgb(255, 255, 255)');
  33 |   });
  34 | 
  35 |   test('ссылка Forgot your password? должна быть кликабельной', async ({ page }) => {
  36 |     const forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
  37 |     await expect(forgotPasswordLink).toBeVisible();
  38 |     await expect(forgotPasswordLink).toContainText('Forgot your password?');
  39 |   });
  40 | 
  41 |   test('иконки социальных сетей в футере должны быть отображены', async ({ page }) => {
  42 |     const socialIcons = page.locator('.orangehrm-login-footer-sm a');
  43 |     await expect(socialIcons).toHaveCount(4);
  44 |   });
  45 | 
  46 |   test('копирайт в футере должен содержать актуальную информацию', async ({ page }) => {
  47 |     const copyright = page.locator('.orangehrm-copyright-wrapper');
  48 |     await expect(copyright).toBeVisible();
> 49 |     await expect(copyright).toContainText('OrangeHRM OS 5.7');
     |                             ^ Error: expect(locator).toContainText(expected) failed
  50 |   });
  51 | });
  52 | 
```