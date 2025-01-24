// import type { HttpContext } from '@adonisjs/core/http'

import Amator from '#models/amator'
import { HttpContext } from '@adonisjs/core/http'
import Category from "#models/category";

export default class UsersController {
  async getUserFavourites({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const favourites = await amator.related('favourites').query()
    const recipes = favourites.map((recipe) => ({
      ...recipe.serialize(),
      isFavourite: true,
    }))
    return recipes
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

  async getProfiles({ response, auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const amator = await Amator.findByOrFail('userId', userId)

    const related = await amator
      .related('nutritionalProfiles')
      .query()
      .where('type', 'type_of_diet')
      .select('id')
      .then((results) => results.map((item) => item.id))

    const allCategories = await Category.query()
    return await Promise.all(
      allCategories.map(async (category) => {
        return {
          ...category.serialize(),
          isAdded: related.includes(category.id),
        }
      })
    )
  }
  async addProfile({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const payload = request.only(['categoryId'])
    if (!payload.categoryId) {
      return { message: 'No tags to add.' }
    }
    await amator.related('nutritionalProfiles').create({
      categoryId: payload.categoryId,
    })

    return { message: 'Profile added to user' }
  }

  async removeProfile({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return response.abort('User not authenticated.')
    }
    const amator = await Amator.findByOrFail('userId', userId)
    const payload = request.only(['categoryId'])
    if (!payload.categoryId) {
      return { message: 'No tags to add.' }
    }
    const profile = await amator.related('nutritionalProfiles').query().where('fk_category_id', payload.categoryId).first()
    if (!profile) {
      return { message: 'No profile found' }
    }
    await profile.delete()
    return { message: 'Profile deleted successfully.' }
  }


}
