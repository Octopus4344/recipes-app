import vine from '@vinejs/vine'

const notificationValidatorSchema = vine.object({
  content: vine.string(),
  userId: vine.number(),
})

export const updateNotificationValidator = vine.compile(notificationValidatorSchema)
