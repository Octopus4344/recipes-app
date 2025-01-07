import vine from '@vinejs/vine'

export const foodProducerRegisterValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(64),
    username: vine.string().minLength(3).maxLength(64),
    email: vine.string().email(),
    password: vine.string().minLength(5).maxLength(512),
  })
)
