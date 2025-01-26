import { test } from '@japa/runner'

let token: string
let recipeId: number
let ingredientId: number

test.group('Authentication', () => {
  test('register and login', async ({ client }) => {
    await client.post('user/register').json({
      firstName: 'Paweł',
      lastName: 'Recipes',
      username: 'recipestest',
      email: 'recipestest@gmail.com',
      password: 'Przepisy123',
    })

    const loginResponse = await client.post('user/login').json({
      email: 'recipestest@gmail.com',
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
})

test.group('Recipes', () => {
  test('create recipe | id: PT-Rec-1', async ({ client, assert }) => {
    // Create a new recipe
    const recipeData = {
      name: 'Przepis',
      description: 'Opis przepisu',
      preparationTime: 25,
      difficultyLevel: 2,
      isProfessional: false,
      isActive: true,
    }

    const recipeResponse = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(recipeData)

    recipeResponse.assertStatus(200)
    recipeId = recipeResponse.body().recipe.id

    const payload = { categories: [1, 5] }
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
    assert.deepInclude(addedTagIds, 1)
    assert.deepInclude(addedTagIds, 5)
  })

  test('add ingredient to recipe | id: PT-Rec-1', async ({ client, assert }) => {
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
      name: 'Pesto',
      calorific_value: 50,
    }
    const response = await client
      .post(`/recipe_ingredients/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(ingredientData)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Ingredient added to recipe.' })

    const body = response.body()
    ingredientId = body.ingredient.id
    assert.equal(body.ingredient.name, ingredientData.name)
  })

  test('add product to ingredient | id: PT-Rec-1', async ({ client }) => {
    // Add product to existing ingredient
    const response = await client
      .post(`/ingredient_products/${ingredientId}`)
      .header('cookie', `token=${token}`)
      .json({ productId: 1 })

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Product added to ingredient.' })
  })

  test('create a recipe (missing data) | id: PT-Rec-2', async ({ client }) => {
    const invalidData = {
      description: 'opis',
      isProfessional: true,
      isActive: true,
    }

    const response = await client
      .post('/recipes')
      .header('cookie', `token=${token}`)
      .json(invalidData)

    response.assertStatus(422)
  })

  test('get a created recipe', async ({ client, assert }) => {
    const response = await client.get(`/recipes/${recipeId}`).header('cookie', `token=${token}`)

    response.assertStatus(200)

    const body = response.body()
    assert.equal(body.id, recipeId)
    assert.exists(body.name)
    assert.exists(body.description)
    assert.exists(body.preparationTime)
    assert.exists(body.difficultyLevel)
  })

  test('update a recipe | id: PT-Rec-4', async ({ client, assert }) => {
    const updatedData = {
      name: 'Edytowany przepis',
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

  test('update a recipe no categories change | id: PT-Rec-5', async ({ client, assert }) => {
    const updatedData = {
      name: 'Edytowany przepis2',
      description: 'Edytowany opis2',
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
  })

  test('update a recipe (lacking data) | id: PT-Rec-6', async ({ client }) => {
    const updatedData = {
      name: null,
      isProfessional: false,
      isActive: true,
      imageUrl: 'https://example.com/new-image.jpg',
    }

    const response = await client
      .put(`/recipes/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(updatedData)

    response.assertStatus(422)
  })

  test('remove categories from recipe | Additional functional tests', async ({
    client,
    assert,
  }) => {
    // Create a new recipe
    const recipeData = {
      name: 'Przepis z kategoriami',
      description: 'Opis przepisu z kategoriami',
      preparationTime: 25,
      difficultyLevel: 2,
      isProfessional: false,
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

  test('get recipe ingredients (and check product inside) | Additional functional tests', async ({
    client,
    assert,
  }) => {
    // Create a new ingredient with a product
    const ingredientData = {
      name: 'Inny składnik',
      calorific_value: 100,
    }

    const createResponse = await client
      .post(`/recipe_ingredients/${recipeId}`)
      .header('cookie', `token=${token}`)
      .json(ingredientData)
    createResponse.assertStatus(200)

    const newIngredientId = createResponse.body().ingredient.id

    await client
      .post(`/ingredient_products/${newIngredientId}`)
      .header('cookie', `token=${token}`)
      .json({ productId: 1 })

    // Get all ingredients and verify
    const getIngredientsResponse = await client
      .get(`/ingredient_products/${recipeId}`)
      .header('cookie', `token=${token}`)

    getIngredientsResponse.assertStatus(200)
    const ingredientsBody = getIngredientsResponse.body()
    assert.isArray(ingredientsBody)

    const found = ingredientsBody.find((ing: any) => ing.id === newIngredientId)
    assert.exists(found, 'Ingredient should exist in the recipe list')
    assert.equal(found.productId, 1, 'Ingredient should have productId=1')
  })
})
