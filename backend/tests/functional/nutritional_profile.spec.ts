import { test } from '@japa/runner'

let token: string

test.group('Authentication', () => {
  test('register and login', async ({ client }) => {
    // Register and login (preconditions)
    await client.post('user/register').json({
      firstName: 'Paweł',
      lastName: 'Nutrition',
      username: 'nutritiontest',
      email: 'nutritiontest@gmail.com',
      password: 'ProfilZywieniowy123',
    })

    const loginResponse = await client.post('user/login').json({
      email: 'nutritiontest@gmail.com',
      password: 'ProfilZywieniowy123',
    })

    const setCookieHeader = loginResponse.headers()['set-cookie']
    const tokenCookie = setCookieHeader ? setCookieHeader[0] : ''
    const tokenMatch = tokenCookie.match(/token=([^;]+)/)
    token = tokenMatch ? tokenMatch[1] : ''

    if (!token) {
      throw new Error('Token not found in cookies')
    }
  })
})

test.group('Nutritional Profile', () => {

  test('set nutrirional profile | Precondition', async ({ client }) => {
    const setNutritionalProfileResponse = await client
      .post('/user/nutritional_profiles?categoryId=5')
      .header('cookie', `token=${token}`)

      setNutritionalProfileResponse.assertBodyContains({ "message" : 'Profile added to user' })
      setNutritionalProfileResponse.assertStatus(200)
  })


  test('get nutrirional profile | id: PT-Prof-1', async ({ client }) => {
    const getNutritionalProfileResponse = await client
      .get('/user/nutritional_profiles')
      .header('cookie', `token=${token}`)
      


      getNutritionalProfileResponse.assertBodyContains([{ id: 5, isAdded: true }])
      getNutritionalProfileResponse.assertStatus(200)
  })

  test('change nutrirional profile | id: PT-Prof-2', async ({ client }) => {

    const setNutritionalProfileResponse = await client
    .post('/user/nutritional_profiles?categoryId=6')
    .header('cookie', `token=${token}`)


    const removeNutritionalProfileResponse = await client
    .delete('/user/nutritional_profiles?categoryId=5')
    .header('cookie', `token=${token}`)

    const getNutritionalProfileResponse = await client
      .get('/user/nutritional_profiles')
      .header('cookie', `token=${token}`)
      

      removeNutritionalProfileResponse.assertBodyContains({ "message" : 'Profile deleted successfully.' })
      setNutritionalProfileResponse.assertBodyContains({ "message" : 'Profile added to user' })
      getNutritionalProfileResponse.assertBodyContains([{ id: 5, isAdded: false }, { id: 6, isAdded: true }])
      getNutritionalProfileResponse.assertStatus(200)
  })

  test('change nutrirional profile, wrong input', async ({ client }) => {

    const setResponse = await client
    .post('/user/nutritional_profiles')
    .header('cookie', `token=${token}`)

    setResponse.assertBodyContains({ message: 'No tags to add.' })

  })

})
