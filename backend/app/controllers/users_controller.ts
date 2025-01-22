// import type { HttpContext } from '@adonisjs/core/http'

import Amator from '#models/amator'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async getUserFavourites({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const favourites = await amator.related('favourites').query()
    return favourites
  }

  async addRecipeToFavourites({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const payload = request.only(['recipeId'])
    if (
      await amator.related('favourites').query().where('fk_recipe_id', payload.recipeId).first()
    ) {
      return response.abort('Recipe already in favourites.')
    }
    await amator.related('favourites').attach([payload.recipeId])
    return { message: 'Recipe added to favourites.' }
  }

  async removeRecipeFromFavourites({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const payload = request.only(['recipeId'])
    await amator.related('favourites').detach([payload.recipeId])
  }
}
