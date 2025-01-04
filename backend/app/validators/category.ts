import vine from '@vinejs/vine'

const categoryValidatorSchema = vine.object({
  name: vine.string(),
  type: vine.enum(['type_of_diet', 'type_of_meal', 'other']),
})

export const updateCategoryValidator = vine.compile(categoryValidatorSchema)
