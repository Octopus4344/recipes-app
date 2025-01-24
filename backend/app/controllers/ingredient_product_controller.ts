import Ingredient from '#models/ingredient'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import Recipe from '#models/recipe'

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
    await Product.findOrFail(payload.productId)
    ingredient.productId = null as unknown as number
    await ingredient.save()
    return { message: 'Product removed from' }
  }

  async getAllProducts() {
    return Product.query()
  }

  async getRecipeIngredients({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const ingredients = await Ingredient.query().where('recipeId', recipe.id).preload('product')
    return ingredients
  }
}
