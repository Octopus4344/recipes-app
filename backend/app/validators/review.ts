import vine from '@vinejs/vine'

const reviewValidatorSchema = vine.object({
  grade: vine.number().in([1, 2, 3, 4, 5]),
  review: vine.string().optional(),
  amatorId: vine.number(),
  recipeId: vine.number(),
})

export const updateReviewValidator = vine.compile(reviewValidatorSchema)
