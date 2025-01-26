import { test } from '@japa/runner'


let token: string
let amatorId: number
let recipeId: number = 9

test.group('Authentication', () => {
  test('register and login', async ({ client }) => {
    const registerResponse = await client.post('user/register').json({
      firstName: 'Paweł',
      lastName: 'Reviews',
      username: 'reviewstest',
      email: 'reviewstest@gmail.com',
      password: 'Przepisy123',
    })

    const amatorData = registerResponse.body().amator
    amatorId = amatorData.id

    const loginResponse = await client.post('user/login').json({
      email: 'reviewstest@gmail.com',
      password: 'Przepisy123',
    })

    const setCookieHeader = loginResponse.headers()['set-cookie']
    const tokenCookie = setCookieHeader ? setCookieHeader[0] : ''
    const tokenMatch = tokenCookie.match(/token=([^;]+)/)
    token = tokenMatch ? tokenMatch[1] : ''

    if (!token) {
      throw new Error('Token not found in cookies')
    }      
  })

  test('create sample recipe', async ({ client }) => {
    const registerResponse = await client.post('user/register').json({
      firstName: 'Paweł',
      lastName: 'SampleRecipe',
      username: 'reviewsrecpier',
      email: 'reviewsrecpier@gmail.com',
      password: 'Przepisy123',
    })



    const loginResponse = await client.post('user/login').json({
      email: 'reviewsrecpier@gmail.com',
      password: 'Przepisy123',
    })

    const setCookieHeader = loginResponse.headers()['set-cookie']
    const tokenCookie = setCookieHeader ? setCookieHeader[0] : ''
    const tokenMatch = tokenCookie.match(/token=([^;]+)/)
    const tempToken = tokenMatch ? tokenMatch[1] : ''

    if (!tempToken) {
      throw new Error('Token not found in cookies')
    }

    const amatorData = registerResponse.body().amator
    const authorId = amatorData.id

    const recipeData = {
      name: 'My Test Recipe2',
      description: 'A simple test recipe description',
      preparationTime: 30,
      difficultyLevel: 3,
      isProfessional: false,
      isActive: true,
      imageUrl: 'https://example.com/image.jpg',
      userId: authorId
    }

    const response = await client
      .post('/recipes')
      .header('cookie', `token=${tempToken}`)
      .json(recipeData)

    const body = response.body()
    recipeId = body.recipe.id
      
  })
})
  
  test.group('Reviews', () => {
  
    test('test counting average | id:PT-Rev-1', async ({ assert, client }) => {
      const response = await client
        .get('/recipes/1')
        .header('cookie', `token=${token}`)
      
      const responseText = response.response.text
      const responseObject = JSON.parse(responseText)
      const averageRating = responseObject.averageRating

      assert.equal(averageRating, 4.5)      
    })

    test('test counting average, no reviews | id:PT-Rev-2', async ({ assert, client }) => {
      const response = await client
        .get('/recipes/9')
        .header('cookie', `token=${token}`)
      
      const responseText = response.response.text
      const responseObject = JSON.parse(responseText)
      const averageRating = responseObject.averageRating


      assert.equal(averageRating, 0.0)      
    })

    test('add review | id: PT-Rev-3', async ({ client }) => {
      const response = await client
        .post('/reviews')
        .header('cookie', `token=${token}`)
        .json({
          grade: 5,
          review: 'Pyszne!',
          amatorId: amatorId,       
          recipeId: recipeId,      
        })
  
      response.assertStatus(200)
      response.assertBodyContains({
        message: 'Review created.',
        review: {
          grade: 5,
          review: 'Pyszne!',
          amatorId: amatorId,
          recipeId: recipeId,
        },
      })
    })

    test('add review - no text review | id:PT-Rev-4', async ({ client }) => {
      const response = await client
        .post('/reviews')
        .header('cookie', `token=${token}`)
        .json({
          grade: 5,
          amatorId: amatorId,       
          recipeId: recipeId,      
        })

  
      response.assertStatus(200)
      response.assertBodyContains({
        message: 'Review created.',
        review: {
          grade: 5,
          amatorId: amatorId,
          recipeId: recipeId,
        },
      })
    })



  
    test('store review fails if grade is missing | id:PT-Rev-5', async ({ client }) => {
      const response = await client
        .post('/reviews')
        .header('cookie', `token=${token}`)
        .json({
          // Missing 'grade'
          review: 'No grade provided',
          amatorId: amatorId,
          recipeId: recipeId,
        })
  
      // The Vine validator should reject this (grade is required in the schema)
      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            field: 'grade',
            // message depends on how Vine outputs the error
          },
        ],
      })
    })
  
    test('store review fails if grade is out of range | id:PT-Rev-6', async ({ client }) => {
      const response = await client
        .post('/reviews')
        .header('cookie', `token=${token}`)
        .json({
          grade: 6,
          review: 'Review too high!',
          amatorId,
          recipeId,
        })
  
      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            field: 'grade',
          },
        ],
      })
    })

  

    test('store review amator cant get information | id: PT-Rev-7', async ({ client }) => {
      const response = await client
        .post('/reviews')
        .header('cookie', `token=${token}`)
        .json({
          grade: 3,
          review: 'Testing invalid IDs',
          amatorId: 9999,
          recipeId: recipeId,
        })
  
      response.assertStatus(200)
      response.assertBodyContains({
        message: 'Invalid amator or recipe id.',
      })
    })
  })
  