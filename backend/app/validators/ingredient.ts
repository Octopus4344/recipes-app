import vine from '@vinejs/vine'


const ingredientValidatorSchema =   vine.object({
  name: vine.string(),
  calorificValue: vine.number(),
  recipeId: vine.number(),
  productId: vine.number().optional(),
})

export const updateIngredientValidator = vine.compile(ingredientValidatorSchema)
