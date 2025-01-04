import type { HttpContext } from '@adonisjs/core/http'

import FoodPackage from '#models/food_package'

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
}
