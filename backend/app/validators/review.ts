import vine from '@vinejs/vine'

export const updateReviewValidator = vine.compile(
  vine.object({
    grade: vine.number().decimal([1, 5]),
    review: vine.string(),
    fk_amator_id: vine.number().positive(),
    fk_recipe_id: vine.number().positive(),
  })
)
