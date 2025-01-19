import { test } from '@japa/runner'
import { updateUserValidator } from '#validators/user'

test.group('User validator tests', () => {
  test('validate valid user', async ({ assert }) => {
    const user = {
      username: 'validUsername',
      email: 'user@example.com',
      password: 'securePassword123',
    };

    assert.isNull((await updateUserValidator.tryValidate(user))[0]);
  });

  test('validate user with invalid email', async ({ assert }) => {
    const user = {
      username: 'validUsername',
      email: 'invalid-email',
      password: 'securePassword123',
    };

    assert.isNotNull((await updateUserValidator.tryValidate(user))[0]);
  });

  test('validate user missing password', async ({ assert }) => {
    const user = {
      username: 'validUsername',
      email: 'user@example.com',
    };

    assert.isNotNull((await updateUserValidator.tryValidate(user))[0]);
  });

});