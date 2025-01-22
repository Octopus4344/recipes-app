import Recipe from '#models/recipe'
import { updateRecipeValidator } from '#validators/recipe'
import type { HttpContext } from '@adonisjs/core/http'
import Amator from '#models/amator'

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

  async addTagsToRecipe({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = request.only(['categories'])
    if (payload.categories.length === 0) {
      return { message: 'No tags to add.' }
    }
    if (payload.categories.length > 1) {
      const categoriesToAttach = payload.categories.map((category: string) =>
        Number.parseInt(category)
      )
      await recipe.related('tags').attach([...categoriesToAttach])
    } else {
      await recipe.related('tags').attach([payload.categories])
    }
    return { message: 'Tags added to recipe.' }
  }
  async destroyTagsFromRecipe({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = request.only(['categories'])
    if (payload.categories.length === 0) {
      return { message: 'No tags to remove.' }
    }
    if (payload.categories.length > 1) {
      const categoriesToDetach = payload.categories.map((category: string) =>
        Number.parseInt(category)
      )
      await recipe.related('tags').detach([...categoriesToDetach])
    } else {
      await recipe.related('tags').detach([payload.categories])
    }
    return { message: 'Tags removed from recipe.' }
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

  async getUserRecipes({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const recipes = await Recipe.query().where('userId', userId)
    return recipes
  }

  async getRecipes({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }

    const amator = await Amator.query()
      .where('userId', userId)
      .preload('nutritionalProfiles', (query) => {
        query.preload('category', (subQuery) => {
          subQuery.where('type', 'type_of_diet')
        })
      })
      .first()

    if (!amator) {
      return Recipe.query()
    }

    const profileCategoryIds = amator.nutritionalProfiles.map((profile) => profile.categoryId)

    if (profileCategoryIds.length === 0) {
      return Recipe.query()
    }

    const recipes = await Recipe.query()
      .whereHas('tags', (query) => {
        query.whereIn('id', profileCategoryIds)
      })
      .groupBy('recipes.id')
      .havingRaw(
        `(SELECT COUNT(*) FROM categories INNER JOIN tags ON categories.id = tags.fk_category_id WHERE recipes.id = tags.fk_recipe_id AND categories.id IN (${profileCategoryIds.join(',')})) = ?`,
        [profileCategoryIds.length]
      )

    return recipes
  }
}
