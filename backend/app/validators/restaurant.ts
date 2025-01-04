import vine from '@vinejs/vine'

const notificationValidatorSchema = vine.object({
  name: vine.string(),
  website: vine.string().nullable(),
  city: vine.string(),
  street: vine.string().optional(),
  streetNumber: vine.string().optional(),
  userId: vine.number(),
  description: vine.string().nullable(),
})

export const updateNotificationValidator = vine.compile(notificationValidatorSchema)
