import vine from '@vinejs/vine'

export const updateRecipeValidator = vine.compile(
    vine.object({
      name: vine.string(),
      description: vine.string(),
      preparation_time: vine.number(),
      difficulty_level: vine.number().decimal([1, 5]), //how many levels do we have?
      //isProffessional: vine.boolean(),
      image_url: vine.string(),
      fk_user_id: vine.number().positive(),
      //isActive: vine.boolean(),
    })

  )