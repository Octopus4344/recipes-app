import vine from '@vinejs/vine'

const amatorSchema = vine.object({
  firstName: vine.string(),
  lastName: vine.string(),
  points: vine.number().positive(),
  userId: vine.number(),
})

export const updateAmatorValidator = vine.compile(amatorSchema)
