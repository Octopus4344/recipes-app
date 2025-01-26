import { test } from '@japa/runner'

let token: string

test.group('Authentication tests', () => {
  test('test get content unauthenticated', async ({ client }) => {
    const recipesResponse = await client.get('/recipes')

    recipesResponse.assertStatus(401)
  })

  test('test get content authenticated', async ({ client }) => {
    await client.post('user/register').json({
      firstName: 'Tester',
      lastName: 'Tester',
      username: 'autentyfikator',
      email: 'autentyfikator@gmail.com',
      password: 'kochamautentyfikacje',
    })

    const loginResponse = await client.post('user/login').json({
      email: 'autentyfikator@gmail.com',
      password: 'kochamautentyfikacje',
    })

    const setCookieHeader = loginResponse.headers()['set-cookie']
    const tokenCookie = setCookieHeader ? setCookieHeader[0] : ''
    const tokenMatch = tokenCookie.match(/token=([^;]+)/)
    token = tokenMatch ? tokenMatch[1] : ''

    const recipesResponse = await client.get('/recipes').header('cookie', `token=${token}`)

    recipesResponse.assertStatus(200)
  })

  test('test get content wrong token', async ({ client }) => {
    const recipesResponse = await client
      .get('/recipes')
      .header('cookie', `token=fhudfhdfjsdfhusdgfhusdfyhusdfyu}`)

    recipesResponse.assertStatus(401)
  })

  test('test get not-permitted content, valid user token', async ({ client }) => {
    const recipesResponse = await client
      .get('/user/food_packages')
      .header('cookie', `token=${token}`)

    recipesResponse.assertStatus(404)
  })
})
