import { test, expect } from '@/fixtures';
import { ApiEndpoints } from '@/constants/api-endpoints';
import { config } from '@/config/env.config';

test.describe('Login - Negative Scenarios', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('неверный пароль показывает сообщение об ошибке', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.loginWithCredentials(config.ADMIN_USERNAME, 'wrong_password_123');
    await loginPage.assertInvalidCredentialsShown();
  });

  test('несуществующий пользователь показывает сообщение об ошибке', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.loginWithCredentials('nonexistent_user_xyz', 'any_password');
    await loginPage.assertInvalidCredentialsShown();
  });

  test('API возвращает 401 при неверных credentials', async ({ request }) => {
    const response = await request.post(`${config.BASE_URL}${ApiEndpoints.auth.generate}`, {
      data: {
        clientId: 'api_oauth_id',
        clientSecret: 'oauth_secret',
        username: 'wrong_user',
        password: 'wrong_pass',
        grant_type: 'password',
      },
    });

    expect(response.status()).toBe(401);
  });
});
