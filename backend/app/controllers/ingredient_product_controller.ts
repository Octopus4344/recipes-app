import Ingredient from '#models/ingredient'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class IngredientProductController {
  async addProductToIngredient({ params, request }: HttpContext) {
    const ingredientId = await params.id
    const ingredient = await Ingredient.findOrFail(ingredientId)
    const payload = request.only(['productId'])
    const product = await Product.findOrFail(payload.productId)
    ingredient.productId = product.id
    await ingredient.save()
    return { message: 'Product added to ingredient.' }
  }

  async removeProductFromIngredient({ params, request }: HttpContext) {
    const ingredientId = await params.id
    const ingredient = await Ingredient.findOrFail(ingredientId)
    const payload = request.only(['productId'])
    const product = await Product.findOrFail(payload.productId)
    ingredient.productId = null as unknown as number
    await ingredient.save()
    return { message: 'Product removed from' }
  }
}
