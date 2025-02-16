import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(3).maxLength(64),
    lastName: vine.string().minLength(3).maxLength(64),
    username: vine.string().minLength(3).maxLength(64),
    email: vine.string().email(),
    password: vine.string().minLength(5).maxLength(512),
  })
)
