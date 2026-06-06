import { test, expect } from '../../src/fixtures';
import { API_USERS } from '../../src/data/users';

test.describe('Authentication API', () => {
  test('@smoke - POST /auth/login returns token for valid credentials', async ({ authApi }) => {
    const { response, data } = await authApi.login({
      username: API_USERS.validLogin.username,
      password: API_USERS.validLogin.password,
    });
     
    expect(response.status()).toBe(200);
    expect(data.accessToken).toBeTruthy();
    expect(typeof data.accessToken).toBe('string');
    expect(data.accessToken.length).toBeGreaterThan(0);
  });

  test('@smoke - login response includes user details', async ({ authApi }) => {
    const { response, data } = await authApi.login({
      username: API_USERS.validLogin.username,
      password: API_USERS.validLogin.password,
    });

    expect(response.status()).toBe(200);
    expect(data.id).toBeTruthy();
    expect(data.username).toBe(API_USERS.validLogin.username);
    expect(data.email).toBeTruthy();
    expect(data.firstName).toBeTruthy();
    expect(data.lastName).toBeTruthy();
  });

  test('@regression - login with invalid credentials returns 400', async ({ authApi }) => {
    const { response } = await authApi.login({
      username: API_USERS.invalidLogin.username,
      password: API_USERS.invalidLogin.password,
    });

    expect(response.status()).toBe(400);
  });

  test('@regression - login response includes refresh token', async ({ authApi }) => {
    const { response, data } = await authApi.login({
      username: API_USERS.validLogin.username,
      password: API_USERS.validLogin.password,
    });

    expect(response.status()).toBe(200);
    expect(data.refreshToken).toBeTruthy();
  });

  test('@regression - login response headers include content-type json', async ({ authApi }) => {
    const { response } = await authApi.login({
      username: API_USERS.validLogin.username,
      password: API_USERS.validLogin.password,
    });

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('@regression - token from login can authenticate subsequent request', async ({ authApi }) => {
    const { data: authData } = await authApi.login({
      username: API_USERS.validLogin.username,
      password: API_USERS.validLogin.password,
    });

    expect(authData.accessToken).toBeTruthy();

    const { response, data } = await authApi.getCurrentUser(authData.accessToken);
    expect(response.status()).toBe(200);
    expect(data.username).toBe(API_USERS.validLogin.username);
  });

  test('@regression - login with custom token expiry', async ({ authApi }) => {
    const { response, data } = await authApi.loginWithExpiry(
      {
        username: API_USERS.validLogin.username,
        password: API_USERS.validLogin.password,
      },
      60
    );

    expect(response.status()).toBe(200);
    expect(data.accessToken).toBeTruthy();
  });
});
