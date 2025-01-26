import { test } from '@japa/runner'

let token: string
let recipeId: number

test.group('Authentication', () => {
  test('register and login', async ({ client }) => {
    // Register and login (preconditions)
    await client.post('user/register').json({
      firstName: 'Restaurant',
      lastName: 'Restaurant',
      username: 'restauranttest',
      email: 'restauranttest@gmail.com',
      password: 'Restauracja123',
    })

    const loginResponse = await client.post('user/login').json({
      email: 'restauranttest@gmail.com',
      password: 'Restauracja123',
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

test.group('Professional Recipes', () => {
  test('create recipe | id: PT-ProfRec-1', async ({ client, assert }) => {
    // Create a new recipe
    const recipeData = {
      name: 'Przepis Profesjonalny',
      description: 'Opis przepisu',
      preparationTime: 60,
      difficultyLevel: 3,
      isProfessional: true,
      isActive: true,
    }

    const recipeResponse = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(recipeData)

    recipeResponse.assertStatus(200)
    recipeId = recipeResponse.body().recipe.id

    const payload = { categories: [3, 7] }
    const response = await client
      .post(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(payload)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Tags added to recipe.' })

    const getTagsResponse = await client
      .get(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)

    getTagsResponse.assertStatus(200)
    const body = getTagsResponse.body()
    const addedTagIds = body.tags.map((tag: any) => tag.id)
    assert.deepInclude(addedTagIds, 3)
    assert.deepInclude(addedTagIds, 7)
  })

  test('add ingredient to professional recipe | id: PT-ProfRec-1', async ({ client, assert }) => {
    // Create a new recipe
    const recipeData = {
      name: 'Przepis ze składnikami',
      description: 'Opis przepisu ze składnikami',
      preparationTime: 20,
      difficultyLevel: 1,
      isProfessional: false,
      isActive: true,
    }

    const recipeResponse = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(recipeData)

    recipeResponse.assertStatus(200)
    recipeId = recipeResponse.body().recipe.id

    // Add ingredient
    const ingredientData = {
      name: 'Jajka',
      calorific_value: 100,
    }
    const response = await client
      .post(`/recipe_ingredients/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(ingredientData)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Ingredient added to recipe.' })

    const body = response.body()
    assert.equal(body.ingredient.name, ingredientData.name)
  })

  test('create a professional recipe (missing data) | id: PT-ProfRec-2', async ({ client }) => {
    const invalidData = {
      description: 'opis przepisu',
      isProfessional: true,
      isActive: true,
    }

    const response = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(invalidData)

    response.assertStatus(422)
  })

  test('get a created recipe | Additional functional test', async ({ client, assert }) => {
    const response = await client.get(`/recipes/${recipeId}`).header('cookie', `token=${token}`)

    response.assertStatus(200)

    const body = response.body()
    assert.equal(body.id, recipeId)
    assert.exists(body.name)
    assert.exists(body.description)
    assert.exists(body.preparationTime)
    assert.exists(body.difficultyLevel)
  })

  test('update a recipe | id: PT-ProfRec-3', async ({ client, assert }) => {
    const updatedData = {
      name: 'Edytowany przepis profsjonalny',
      description: 'Edytowany opis',
      preparationTime: 45,
      difficultyLevel: 5,
      isProfessional: true,
      isActive: true,
      imageUrl: 'https://example.com/new-image.jpg',
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Recipe updated.' })

    const body = response.body()
    assert.equal(body.recipe.name, updatedData.name)
    assert.equal(body.recipe.description, updatedData.description)
    assert.equal(body.recipe.preparationTime, updatedData.preparationTime)
    assert.equal(body.recipe.difficultyLevel, updatedData.difficultyLevel)
    assert.equal(body.recipe.isProfessional, updatedData.isProfessional)
    assert.equal(body.recipe.isActive, updatedData.isActive)
    assert.equal(body.recipe.imageUrl, updatedData.imageUrl)

    const payload = { categories: [6] }
    const tagsResponse = await client
      .post(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(payload)

    tagsResponse.assertStatus(200)
    tagsResponse.assertBodyContains({ message: 'Tags added to recipe.' })

    const getTagsResponse = await client
      .get(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)

    getTagsResponse.assertStatus(200)
    const tagBody = getTagsResponse.body()
    const addedTagIds = tagBody.tags.map((tag: any) => tag.id)
    assert.deepInclude(addedTagIds, 6)
  })

  test('update a recipe no categories change | id: PT-ProfRec-4', async ({ client, assert }) => {
    const updatedData = {
      name: 'Edytowany przepis profesjonalny2',
      description: 'Opis przepisu2',
      preparationTime: 50,
      difficultyLevel: 5,
      isProfessional: true,
      isActive: true,
      imageUrl: 'https://example.com/new-image.jpg',
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Recipe updated.' })

    const body = response.body()
    assert.equal(body.recipe.name, updatedData.name)
    assert.equal(body.recipe.description, updatedData.description)
    assert.equal(body.recipe.preparationTime, updatedData.preparationTime)
    assert.equal(body.recipe.difficultyLevel, updatedData.difficultyLevel)
    assert.equal(body.recipe.isProfessional, updatedData.isProfessional)
    assert.equal(body.recipe.isActive, updatedData.isActive)
    assert.equal(body.recipe.imageUrl, updatedData.imageUrl)
  })

  test('update a recipe (lacking data) | id: PT-ProfRec-5', async ({ client }) => {
    const updatedData = {
      name: null,
      isProfessional: true,
      isActive: true,
      imageUrl: 'https://example.com/new-image.jpg',
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(422)
  })

  test('desactivate recipe | id: PT-ProfRec-6', async ({ client, assert }) => {
    const getResponse = await client.get(`/recipes/${recipeId}`).header('cookie', `token=${token}`)

    const body = getResponse.body()
    assert.equal(body.id, recipeId)
    assert.exists(body.name)
    assert.exists(body.description)
    assert.exists(body.preparationTime)
    assert.exists(body.difficultyLevel)

    const updatedData = {
      name: body.name,
      description: body.description,
      preparationTime: body.preparationTime,
      difficultyLevel: body.difficultyLevel,
      isProfessional: true,
      isActive: false,
      imageUrl: body.imageUrl,
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(200)
  })

  test('resactivate recipe | id: PT-ProfRec-7', async ({ client, assert }) => {
    const getResponse = await client.get(`/recipes/${recipeId}`).header('cookie', `token=${token}`)

    const body = getResponse.body()
    assert.equal(body.id, recipeId)
    assert.exists(body.name)
    assert.exists(body.description)
    assert.exists(body.preparationTime)
    assert.exists(body.difficultyLevel)

    const updatedData = {
      name: body.name,
      description: body.description,
      preparationTime: body.preparationTime,
      difficultyLevel: body.difficultyLevel,
      isProfessional: true,
      isActive: true,
      imageUrl: body.imageUrl,
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(200)
  })

  test('remove categories from professional recipe | Additional functional tests', async ({
    client,
    assert,
  }) => {
    // Create a new recipe
    const recipeData = {
      name: 'Przepis z kategoriami',
      description: 'Opis przepisu z kategoriami',
      preparationTime: 25,
      difficultyLevel: 2,
      isProfessional: true,
      isActive: true,
    }

    const recipeResponse = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(recipeData)

    recipeResponse.assertStatus(200)
    recipeId = recipeResponse.body().recipe.id

    // Add categories
    const addPayload = { categories: [3, 4] }
    await client
      .post(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(addPayload)

    // Remove one category
    const removePayload = { categories: [4] }
    const response = await client
      .delete(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(removePayload)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Tags removed from recipe.' })

    // Verify remaining categories
    const getTagsResponse = await client
      .get(`/recipes_tags/${recipeId}`)
      .header('cookie', `token=${token}`)

    getTagsResponse.assertStatus(200)
    const body = getTagsResponse.body()
    const remainingTagIds = body.tags.map((tag: any) => tag.id)
    assert.deepInclude(remainingTagIds, 3, 'Category 3 should remain')
    assert.notDeepInclude(remainingTagIds, 4, 'Category 4 should be removed')
  })
})
