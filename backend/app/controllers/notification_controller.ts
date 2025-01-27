import type { HttpContext } from '@adonisjs/core/http'

import Notification from '#models/notification'

export default class NotificationController {
  async getUserNotifications({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const userNotifications = await Notification.query().where('userId', userId)
    return userNotifications
  }
}
