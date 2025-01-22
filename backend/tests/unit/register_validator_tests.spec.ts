import { test } from '@japa/runner'
import { registerValidator } from '#validators/register'

test.group('Register validator tests', () => {
  test('validate valid register data', async ({ assert }) => {
    const registerData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };

    assert.isNull((await registerValidator.tryValidate(registerData))[0]);
  });

  test('validate register data with short password', async ({ assert }) => {
    const registerData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: '123',
    };

    assert.isNotNull((await registerValidator.tryValidate(registerData))[0]);
  });

  test('validate register data missing required fields', async ({ assert }) => {
    const registerData = {
      firstName: 'John',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };

    assert.isNotNull((await registerValidator.tryValidate(registerData))[0]);
  });

  test('validate register data with invalid email', async ({ assert }) => {
    const registerData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'invalid-email',
      password: 'securePassword123',
    };

    assert.isNotNull((await registerValidator.tryValidate(registerData))[0]);
  });
});