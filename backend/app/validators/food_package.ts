import vine from '@vinejs/vine'

const foodPackageValidatorSchema = vine.object({
  name: vine.string(),
  producerId: vine.number(),
})

export const updateFoodPackageValidator = vine.compile(foodPackageValidatorSchema)