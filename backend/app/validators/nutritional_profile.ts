import vine from '@vinejs/vine'

const nutritionalProfileValidatorSchema = vine.object({
  amatorId: vine.number(),
  categoryId: vine.number(),
})

export const updateNutritionalProfileValidator = vine.compile(nutritionalProfileValidatorSchema)
