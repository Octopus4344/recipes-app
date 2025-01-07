import type { HttpContext } from '@adonisjs/core/http'

import FoodPackage from '#models/food_package'
import FoodProducer from '#models/food_producer'

export default class FoodPackagesProductsController {
  //Get products of a food package
  async index({ params }: HttpContext) {
    const foodPackageId = params.id

    const foodPackage = await FoodPackage.query()
      .where('id', foodPackageId)
      .preload('products')
      .firstOrFail()

    return foodPackage.products
  }

  async addProductToPackage({ params, request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const foodPackageId = params.id
    const payload = request.only(['productId'])
    const foodPackage = await FoodPackage.findOrFail(foodPackageId)
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    if (foodPackage.producerId !== foodProducer.id) {
      return response.abort('You are not the producer of this food package.')
    }
    await foodPackage.related('products').attach([payload.productId])
    return foodPackage
  }

  async destroy({ params, request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const foodPackageId = params.id
    const payload = request.only(['productId'])
    const foodPackage = await FoodPackage.findOrFail(foodPackageId)
    const foodProducer = await FoodProducer.findByOrFail('userId', userId)
    if (foodPackage.producerId !== foodProducer.id) {
      return response.abort('You are not the producer of this food package.')
    }
    return foodPackage.related('products').detach([payload.productId])
  }
}
