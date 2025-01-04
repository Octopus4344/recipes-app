import vine from '@vinejs/vine'

const userValidatorSchema = vine.object({
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
})

export const updateUserValidator = vine.compile(userValidatorSchema)
