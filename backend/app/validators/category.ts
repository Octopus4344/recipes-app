import vine from '@vinejs/vine'

export const updateCategoryValidator = vine.compile(
  vine.object({
    name: vine.string(),
    type: vine.enum(['type_of_diet', 'type_of_meal', 'other']),
  })
)
