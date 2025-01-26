import { test } from '@japa/runner'
import { foodProducerRegisterValidator } from '#validators/food_producer_register'

test.group('Food Producer Register Validator Tests', () => {
  test('validate valid food producer data', async ({ assert }) => {
    const producerData = {
      name: 'Best Farms',
      username: 'bestfarms',
      email: 'info@bestfarms.com',
      password: 'securePassword123',
    }

    assert.isNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data with short name', async ({ assert }) => {
    const producerData = {
      name: 'BF',
      username: 'bestfarms',
      email: 'info@bestfarms.com',
      password: 'securePassword123',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data with invalid email', async ({ assert }) => {
    const producerData = {
      name: 'Best Farms',
      username: 'bestfarms',
      email: 'invalid-email',
      password: 'securePassword123',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data with short password', async ({ assert }) => {
    const producerData = {
      name: 'Best Farms',
      username: 'bestfarms',
      email: 'info@bestfarms.com',
      password: '123',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data missing required fields', async ({ assert }) => {
    const producerData = {
      name: 'Best Farms',
      email: 'info@bestfarms.com',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data with max-length violations', async ({ assert }) => {
    const producerData = {
      name: 'A'.repeat(65), // Exceeds max length
      username: 'bestfarms',
      email: 'info@bestfarms.com',
      password: 'securePassword123',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })

  test('validate food producer data with optional fields as null', async ({ assert }) => {
    const producerData = {
      name: 'Best Farms',
      username: null,
      email: 'info@bestfarms.com',
      password: 'securePassword123',
    }

    assert.isNotNull((await foodProducerRegisterValidator.tryValidate(producerData))[0])
  })
})
