import vine from '@vinejs/vine'

export const updateAmatorValidator = vine.compile(
  vine.object({
    first_name: vine.string(),
    last_name: vine.string(),
    points: vine.number().positive(),
    fk_user_id: vine.number(),
  })
)
