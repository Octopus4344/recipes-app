import vine from '@vinejs/vine'

const foodProducerSchema = vine.object({
  name: vine.string(),
  userId: vine.number(),
})

export const updateFoodProducerValidator = vine.compile(foodProducerSchema)
