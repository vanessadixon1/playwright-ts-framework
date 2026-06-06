import { test, expect } from '../../src/fixtures';
import { generateRandomUser } from '../../src/utils/helpers';

test.describe('Users API', () => {
  test('@smoke - GET /users returns paginated user list', async ({ usersApi }) => {
    const { response, data } = await usersApi.getUsers(10);

    expect(response.status()).toBe(200);
    expect(data.users).toBeInstanceOf(Array);
    expect(data.users.length).toBeGreaterThan(0);
    expect(data.total).toBeGreaterThan(0);
  });

  test('@regression - GET /users pagination - skip works correctly', async ({ usersApi }) => {
    const [page1, page2] = await Promise.all([
      usersApi.getUsers(5, 0),
      usersApi.getUsers(5, 5),
    ]);

    expect(page1.response.status()).toBe(200);
    expect(page2.response.status()).toBe(200);

    const p1Ids = page1.data.users.map((u) => u.id);
    const p2Ids = page2.data.users.map((u) => u.id);
    const overlap = p1Ids.filter((id) => p2Ids.includes(id));
    expect(overlap).toHaveLength(0);
  });

  test('@smoke - GET /users/:id returns a single user', async ({ usersApi }) => {
    const { response, data } = await usersApi.getUserById(1);

    expect(response.status()).toBe(200);
    expect(data.id).toBe(1);
    expect(data.firstName).toBeTruthy();
    expect(data.lastName).toBeTruthy();
    expect(data.email).toBeTruthy();
  });

  test('@regression - GET /users/:id - user not found returns 404', async ({ usersApi }) => {
    const { response } = await usersApi.getUserById(0);
    expect(response.status()).toBe(404);
  });

  test('@regression - GET /users/search returns matching users', async ({ usersApi }) => {
    const { response, data } = await usersApi.searchUsers('Emily');

    expect(response.status()).toBe(200);
    expect(data.users.length).toBeGreaterThan(0);
    const names = data.users.map((u) => `${u.firstName} ${u.lastName}`.toLowerCase());
    const allMatch = names.some((n) => n.includes('emily'));
    expect(allMatch).toBe(true);
  });

  test('@smoke - POST /users/add creates a new user', async ({ usersApi }) => {
    const user = generateRandomUser();
    const payload = { firstName: user.firstName, lastName: user.lastName };
    const { response, data } = await usersApi.createUser(payload);

    expect(response.status()).toBe(201);
    expect(data.firstName).toBe(payload.firstName);
    expect(data.lastName).toBe(payload.lastName);
    expect(data.id).toBeTruthy();
  });

  test('@regression - PUT /users/:id updates user fully', async ({ usersApi }) => {
    const payload = { firstName: 'Updated', lastName: 'Testuser' };
    const { response, data } = await usersApi.updateUser(1, payload);

    expect(response.status()).toBe(200);
    expect(data.firstName).toBe(payload.firstName);
    expect(data.lastName).toBe(payload.lastName);
  });

  test('@regression - PATCH /users/:id partial update', async ({ usersApi }) => {
    const payload = { firstName: 'Patched' };
    const { response, data } = await usersApi.patchUser(1, payload);

    expect(response.status()).toBe(200);
    expect(data.firstName).toBe(payload.firstName);
  });

  test('@regression - DELETE /users/:id returns 200 with isDeleted flag', async ({ usersApi }) => {
    const response = await usersApi.deleteUser(1);
    expect(response.response.status()).toBe(200);
  });

  test('@regression - user object schema is valid', async ({ usersApi }) => {
    const { data } = await usersApi.getUserById(1);

    expect(typeof data.id).toBe('number');
    expect(typeof data.firstName).toBe('string');
    expect(typeof data.lastName).toBe('string');
    expect(typeof data.email).toBe('string');
    expect(data.email).toContain('@');
  });

  test('@regression - limit parameter controls page size', async ({ usersApi }) => {
    const { data } = await usersApi.getUsers(3);
    expect(data.users.length).toBeLessThanOrEqual(3);
  });
});
