import { test } from '@japa/runner'

let token: string
let createdPackageId: number

test.group('Food Packages', () => {
  test('register food producer and login (setup)', async ({ client }) => {
    const registerResponse = await client.post('/food_producer/register').json({
      name: 'Tasty Foods Inc.',
      username: 'tastyfoods',
      email: 'tasty@example.com',
      password: 'foodproducer123',
    })
    registerResponse.assertStatus(201)

    const loginResponse = await client.post('user/login').json({
      email: 'tasty@example.com',
      password: 'foodproducer123',
    })

    loginResponse.assertStatus(200)

    const setCookieHeader = loginResponse.headers()['set-cookie']
    const tokenCookie = setCookieHeader ? setCookieHeader[0] : ''
    const tokenMatch = tokenCookie.match(/token=([^;]+)/)
    token = tokenMatch ? tokenMatch[1] : ''

    if (!token) {
      throw new Error('Token not found in cookies')
    }
  })

  test('create a new food package | id: PT-Pckg-1', async ({ client }) => {
    const response = await client.post('/food_packages').header('cookie', `token=${token}`).json({
      name: 'Paczka Testowa',
      recipeId: 1,
    })

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Paczka Testowa' })

    createdPackageId = response.body().id
  })

  test('fail to create a new food package with invalid data | id: PT-Pckg-2', async ({
    assert,
    client,
  }) => {
    try {
      await client.post('/food_packages').header('cookie', `token=${token}`).json({})

      assert.fail
    } catch {
      assert.ok
    }
  })

  test('get user food packages', async ({ client }) => {
    const response = await client.get('/user/food_packages').header('cookie', `token=${token}`)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: createdPackageId,
        name: 'Paczka Testowa',
      },
    ])
  })

  test('update an existing food package | id: PT-Pckg-3', async ({ client }) => {
    const response = await client
      .put(`/food_packages/${createdPackageId}`)
      .header('cookie', `token=${token}`)
      .json({ name: 'Edytowana Paczka Testowa' })

    response.assertStatus(200)
    response.assertBodyContains({
      id: createdPackageId,
      name: 'Edytowana Paczka Testowa',
    })
  })

  test('add product to food package | id: PT-Pckg-3', async ({ client }) => {
    const response = await client
      .post(`/food_packages_products/${createdPackageId}`)
      .header('cookie', `token=${token}`)
      .json({ productId: 1 })

    response.assertStatus(200)
    response.assertBodyContains({ id: createdPackageId })
  })

  test('add another product to food package | id: PT-Pckg-3', async ({ client }) => {
    const response = await client
      .post(`/food_packages_products/${createdPackageId}`)
      .header('cookie', `token=${token}`)
      .json({ productId: 2 })

    response.assertStatus(200)
    response.assertBodyContains({ id: createdPackageId })
  })

  test('get products of the food package | id: PT-Pckg-3 Additional Checks', async ({ client }) => {
    const response = await client
      .get(`/food_packages_products/${createdPackageId}`)
      .header('cookie', `token=${token}`)

    response.assertStatus(200)
    response.assertBodyContains([{ id: 1 }, { id: 2 }])

    const updatedResponse = await client
      .get('/user/food_packages')
      .header('cookie', `token=${token}`)

    updatedResponse.assertBodyContains([{ id: createdPackageId, name: 'Edytowana Paczka Testowa' }])
  })

  test('remove a product from the food package | id: PT-Pckg-4', async ({ client }) => {
    const response = await client
      .delete(`/food_packages_products/${createdPackageId}`)
      .header('cookie', `token=${token}`)
      .json({ productId: 1 })

    response.assertStatus(200)

    const getResponse = await client
      .get(`/food_packages_products/${createdPackageId}`)
      .header('cookie', `token=${token}`)

    getResponse.assertStatus(200)
    getResponse.assertBodyNotContains([{ id: 1 }])
  })

  test('delete the food package | id: PT-Pckg-5', async ({ client }) => {
    await client.delete(`/food_packages/${createdPackageId}`).header('cookie', `token=${token}`)

    const getResponse = await client.get('/user/food_packages').header('cookie', `token=${token}`)

    getResponse.assertBodyNotContains({
      id: createdPackageId,
      name: 'Paczka Testowa',
    })
  })
})
