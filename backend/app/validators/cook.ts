import vine from '@vinejs/vine'

export const updateCategoryValidator = vine.compile(
  vine.object({
    first_name: vine.string(),
    last_name: vine.string(),
    fk_user_id: vine.number().positive(),
    fk_restaurant_id: vine.number().positive(),
  })
)
