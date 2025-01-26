import { test } from '@japa/runner'
import { updateRecipeValidator } from '#validators/recipe'

test.group('Recipe validator tests', () => {
  test('validate valid recipe', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 'Pyszny deser z malinami',
      preparationTime: 60,
      difficultyLevel: 2,
      isProfessional: false,
      imageUrl:
        'https://mojewypieki.com/wp-content/uploads/2022/10/Brownie_najlepszy_przepis_1.jpg',
      userId: 4,
      isActive: true,
    }

    assert.isNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })

  test('validate recipe wrong level', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 'Pyszny deser z malinami',
      preparationTime: 60,
      difficultyLevel: 8,
      isProfessional: false,
      imageUrl: null,
      userId: 4,
      isActive: true,
    }

    assert.isNotNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })

  test('validate recipe missing information', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 'Pyszny deser z malinami',
      preparationTime: 60,
      imageUrl: null,
      userId: 4,
      isActive: true,
    }

    assert.isNotNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })

  test('validate recipe missing optional information', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 'Pyszny deser z malinami',
      preparationTime: 60,
      difficultyLevel: 2,
      isProfessional: false,
      isActive: true,
    }

    assert.isNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })

  test('validate recipe wrong datatypes', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 13,
      preparationTime: '20 minut',
      difficultyLevel: 2,
      isProfessional: false,
      imageUrl: null,
      userId: 4,
      isActive: true,
    }

    assert.isNotNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })

  test('validate recipe optionals are nulls', async ({ assert }) => {
    const recipe = {
      name: 'Tarta z malinami',
      description: 'Pyszny deser z malinami',
      preparationTime: 60,
      difficultyLevel: 2,
      isProfessional: false,
      imageUrl: null,
      userId: null,
      isActive: true,
    }

    assert.isNull((await updateRecipeValidator.tryValidate(recipe))[0])
  })
})
