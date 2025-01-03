import Recipe from '#models/recipe'
import { updateRecipeValidator } from '#validators/recipe'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecipesController {
  async index(_ctx: HttpContext) {
    return Recipe.query()
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(updateRecipeValidator)
    const recipe = await Recipe.create(payload)
    return { message: 'Recipe created.', recipe }
  }
}
