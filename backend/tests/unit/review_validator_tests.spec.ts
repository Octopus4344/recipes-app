import { test } from '@japa/runner'
import { updateReviewValidator } from '#validators/review'

test.group('Review validator tests', () => {
  test('validate valid review', async ({ assert }) => {
    const review = {
      grade: 4,
      review: 'Pyszne!',
      amatorId: 1,
      recipeId: 2,
    }

    assert.isNull((await updateReviewValidator.tryValidate(review))[0])
  })

  test('validate review with invalid grade', async ({ assert }) => {
    const review = {
      grade: 6, // Invalid grade
      amatorId: 1,
      recipeId: 2,
    }

    assert.isNotNull((await updateReviewValidator.tryValidate(review))[0])
  })

  test('validate review missing optional review field', async ({ assert }) => {
    const review = {
      grade: 3,
      amatorId: 1,
      recipeId: 2,
    }

    assert.isNull((await updateReviewValidator.tryValidate(review))[0])
  })

  test('validate review missing required fields', async ({ assert }) => {
    const review = {
      grade: 3,
    }

    assert.isNotNull((await updateReviewValidator.tryValidate(review))[0])
  })

  test('validate review with wrong types', async ({ assert }) => {
    const review = {
      grade: 'very good',
      review: 'Pyszne!',
      amatorId: 1,
      recipeId: 2,
    }

    assert.isNotNull((await updateReviewValidator.tryValidate(review))[0])
  })

  test('validate review with wrong, but castable types', async ({ assert }) => {
    const review = {
      grade: '4',
      review: 'Pyszne!',
      amatorId: '1',
      recipeId: '2',
    }

    assert.isNull((await updateReviewValidator.tryValidate(review))[0])
  })
})
