import vine from '@vinejs/vine'

const cookValidatorSchema = vine.object({
  firstName: vine.string(),
  lastName: vine.string(),
  userId: vine.number(),
  restaurantId: vine.number().optional(),
})

export const updateCategoryValidator = vine.compile(cookValidatorSchema)
