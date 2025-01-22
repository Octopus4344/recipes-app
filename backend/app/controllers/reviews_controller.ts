import type { HttpContext } from '@adonisjs/core/http'
import Review from '#models/review'
import { updateReviewValidator } from '#validators/review'
import Recipe from '#models/recipe'
import Amator from '#models/amator'
import Notification from '#models/notification'

export default class ReviewsController {
  async index(_ctx: HttpContext) {
    return Review.query()
  }
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(updateReviewValidator)
    if (!(await Amator.find(payload.amatorId)) || !(await Recipe.find(payload.recipeId))) {
      return { message: 'Invalid amator or recipe id.' }
    }
    const review = await Review.create(payload)
    const recipeAuthor = await Recipe.query().where('id', payload.recipeId).preload('user').first()
    await Notification.create({
      content: `You have a new review on ${recipeAuthor?.name}`,
      userId: recipeAuthor?.user.id,
    })

    return { message: 'Review created.', review }
  }
  async recipeReviews({ params }: HttpContext) {
    return Review.query().where('recipeId', params.id).preload('user')
  }
}
