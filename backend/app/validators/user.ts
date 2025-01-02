import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
    allowNotifications: vine.boolean(),
  })
)
