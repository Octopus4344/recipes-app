import vine from '@vinejs/vine'

const recipeSchema = vine.object({
  name: vine.string(),
  description: vine.string(),
  preparationTime: vine.number(),
  difficultyLevel: vine.number().in([1, 2, 3, 4, 5]),
  isProfessional: vine.boolean(),
  isActive: vine.boolean(),
  imageUrl: vine.string().optional(),
  userId: vine.number().optional(),
})

export const updateRecipeValidator = vine.compile(recipeSchema)
