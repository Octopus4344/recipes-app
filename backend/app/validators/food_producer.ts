import vine from '@vinejs/vine'

export const updateFoodProducerValidator = vine.compile(
  vine.object({
    name: vine.string(),
    fk_user_id: vine.number().positive(),
  })
)
