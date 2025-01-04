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

  async show({ params }: HttpContext) {
    return Recipe.findOrFail(params.id)
  }

  async update({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = await request.validateUsing(updateRecipeValidator)
    recipe.merge(payload)
    await recipe.save()
    return { message: 'Recipe updated.', recipe }
  }

  async destroy({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.delete()
    return { message: 'Recipe deleted.' }
  }
}
