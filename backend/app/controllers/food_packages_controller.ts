import type { HttpContext } from '@adonisjs/core/http'

import FoodPackage from '#models/food_package'
import FoodProducer from '#models/food_producer'

export default class FoodPackagesController {
  async getUserFoodPackages({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    const foodPackages = await FoodPackage.query()
      .where('producerId', foodProducer.id)
      .preload('products')
    return foodPackages
  }

  async show({ params }: HttpContext) {
    const foodPackageId = params.id
    const foodPackage = await FoodPackage.query().where('id', foodPackageId)
    return foodPackage
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const payload = request.only(['name'])
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    const foodPackage = await FoodPackage.create({
      ...payload,
      producerId: foodProducer.id,
    })
    return foodPackage
  }

  async destroy({ params, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const foodPackageId = params.id
    const foodPackage = await FoodPackage.findOrFail(foodPackageId)
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    if (foodPackage.producerId !== foodProducer.id) {
      return response.abort('You are not the producer of this food package.')
    }
    return foodPackage.delete()
  }

  async update({ params, request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const foodPackageId = params.id
    const payload = request.only(['name'])
    const foodPackage = await FoodPackage.findOrFail(foodPackageId)
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    if (foodPackage.producerId !== foodProducer.id) {
      return response.abort('You are not the producer of this food package.')
    }
    foodPackage.merge(payload)
    await foodPackage.save()
    return foodPackage
  }
}
