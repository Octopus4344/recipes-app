import vine from '@vinejs/vine'

const userValidatorSchema = vine.object({
  username: vine.string(),
  password: vine.string(),
  //no longer in model?
 // allowNotifications: vine.boolean(),
})

export const updateUserValidator = vine.compile(userValidatorSchema)
