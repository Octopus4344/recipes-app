import { test } from '@japa/runner'
import { updateRestaurantValidator } from '#validators/restaurant'

test.group('Restaurant validator tests', () => {
  test('validate valid restaurant data', async ({ assert }) => {
    const restaurant = {
      name: 'Restauracja Pod Różą',
      website: 'https://restauracja-pod-roza.pl',
      city: 'Warszawa',
      street: 'Krakowskie Przedmieście',
      streetNumber: '12A',
      userId: 1,
      description: 'Klimatyczna restauracja z tradycyjną kuchnią polską.',
    }

    assert.isNull((await updateRestaurantValidator.tryValidate(restaurant))[0])
  })

  test('validate data without optional fields', async ({ assert }) => {
    const restaurant = {
      name: 'Restauracja Pod Lipami',
      website: null,
      city: 'Kraków',
      userId: 2,
      description: null,
    }

    assert.isNull((await updateRestaurantValidator.tryValidate(restaurant))[0])
  })

  test('validate data missing required fields', async ({ assert }) => {
    const restaurant = {
      website: 'https://example.com',
      street: 'Nowy Świat',
      userId: 3,
    }

    assert.isNotNull((await updateRestaurantValidator.tryValidate(restaurant))[0])
  })

  test('validate data with invalid field types', async ({ assert }) => {
    const restaurant = {
      name: 'Restauracja na Wzgórzu',
      website: 'https://example.com',
      city: 12345, // Invalid type
      street: 'Krakowskie Przedmieście',
      streetNumber: true, // Invalid type
      userId: 'user', // Invalid type
      description: null,
    }

    assert.isNotNull((await updateRestaurantValidator.tryValidate(restaurant))[0])
  })

  test('validate data with optional fields as null', async ({ assert }) => {
    const restaurant = {
      name: 'Restauracja Zielony Gaj',
      website: null,
      city: 'Poznań',
      street: null,
      streetNumber: null,
      userId: 6,
      description: null,
    }

    assert.isNull((await updateRestaurantValidator.tryValidate(restaurant))[0])
  })
})
