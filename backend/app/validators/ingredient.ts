import vine from '@vinejs/vine'

export const updateIngredientValidator = vine.compile(
  vine.object({
    name: vine.string(),
    calorific_value: vine.number().positive(),
    fk_recipe_id: vine.number().positive(),
    fk_product_id: vine.number().positive(),
  })
)
