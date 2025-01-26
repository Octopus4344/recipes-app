import { test } from '@japa/runner'

let token: string


test.group('Register and login', () => {
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
})

test.group('Professional recipes', () => {
  test('example test', async ({ }) => {
  })
})