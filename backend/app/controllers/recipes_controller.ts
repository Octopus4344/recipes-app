import Recipe from '#models/recipe'
import { updateRecipeValidator } from '#validators/recipe'
import type { HttpContext } from '@adonisjs/core/http'
import Amator from '#models/amator'
import Notification from '#models/notification'
import Ingredient from '#models/ingredient'
import Category from '#models/category'
import Product from '#models/product'
import FoodProducer from '#models/food_producer'

export default class RecipesController {
  async index(_ctx: HttpContext) {
    return Recipe.query()
  }

  /**
   * Creates and saves new recipe, before that checks  if the data is correct.
   *
   * @param request contains the payload with all the new recipe data
   * @returns the new recipe data and appropriate message or validate error.
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(updateRecipeValidator)
    const recipe = await Recipe.create(payload)
    return { message: 'Recipe created.', recipe }
  }

  /**
   * Shows data of a chosen recipe.
   *
   * @param params contains the recipe id
   * @param auth contains the user's token
   * @returns data of a chosen recipe.
   */
  async show({ params, auth }: HttpContext) {
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

    const recipe = await Recipe.query()
      .where('id', params.id)
      .preload('tags')
      .preload('reviews')
      .firstOrFail()

    const reviews = await recipe.related('reviews').query()
    const avg = reviews.length
      ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
      : 0

    const ingredients = await Ingredient.query().where('recipeId', recipe.id)
    const products = []
    for (const ingredient of ingredients) {
      const product = await ingredient.related('product').query().first()
      if (product?.producerId) {
        const productProducer = await FoodProducer.query().where('id', product?.producerId).first()
        if (product) {
          products.push({ ...product.serialize(), producer: productProducer })
        }
      }
    }

    if (!amator) {
      const recipeWithDetails = {
        ...recipe.serialize(),
        ingredients: ingredients.map((ingredient) => ingredient.serialize()),
        averageRating: avg || 0,
        products: products,
      }
      return recipeWithDetails
    }

    const favouriteRecipesIds = await amator
      .related('favourites')
      .query()
      .select('id')
      .then((results) => results.map((fav) => fav.id))

    const recipeWithDetails = {
      ...recipe.serialize(),
      isFavourite: favouriteRecipesIds.includes(recipe.id),
      ingredients: ingredients.map((ingredient) => ingredient.serialize()),
      averageRating: avg || 0,
      products: products,
    }
    return recipeWithDetails
  }

  /**
   * Shows tags of a chosen recipe.
   *
   * @param params contains the recipe id
   * @returns tags of a chosen recipe.
   */
  async getRecipeTags({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    return { tags: await recipe.related('tags').query(), recipe }
  }

  /**
   * Shows all categories with a flag isAdded, that informs if a category is connected with chosen recipe.
   *
   * @param params contains the recipe id
   * @returns all of the categories.
   */
  async getTags({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const related = await recipe
      .related('tags')
      .query()
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

  /**
   * Creates a connection between a category and a recipe.
   *
   * @param params contains the recipe id
   * @param request contains the payload with tag id.
   * @returns the message informing about an error or success.
   */
  async addTagsToRecipe({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = request.only(['categories'])
    if (payload.categories.length === 0) {
      return { message: 'No tags to add.' }
    }
    if (Array.isArray(payload.categories)) {
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
    if (Array.isArray(payload.categories)) {
      const categoriesToDetach = payload.categories.map((category: string) =>
        Number.parseInt(category)
      )
      await recipe.related('tags').detach([...categoriesToDetach])
    } else {
      await recipe.related('tags').detach([payload.categories])
    }
    const amatorsWhoLikeThisRecipe = await recipe.related('favourites').query()
    for (const amator of amatorsWhoLikeThisRecipe) {
      const user = await Amator.find(amator.amatorId)
      if (user) {
        const userNutritionalProfiles = await user.related('nutritionalProfiles').query()
        const userCategories = userNutritionalProfiles.map((profile) => profile.categoryId)
        const intPayloadCategories = Array.isArray(payload.categories)
          ? payload.categories.map((category: string) => Number.parseInt(category))
          : [Number.parseInt(payload.categories)]
        for (const category of intPayloadCategories) {
          if (userCategories.includes(category)) {
            await Notification.create({
              content: `Tags for recipe ${recipe.name} have been updated.`,
              userId: user?.userId,
            })
            break
          }
        }
      }
    }
    return { message: 'Tags removed from recipe.' }
  }

  /**
   * Updates data of a chosen recipe.
   *
   * @param params contains the recipe id
   * @param request contains new data.
   * @returns the message informing about error or success, on success also new data.
   */
  async update({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = await request.validateUsing(updateRecipeValidator)
    if (recipe.isActive !== payload.isActive) {
      const amatorsWhoLikeThisRecipe = await recipe.related('favourites').query()
      for (const amator of amatorsWhoLikeThisRecipe) {
        const user = await Amator.find(amator.amatorId)
        if (user) {
          await Notification.create({
            content: `Recipe ${recipe.name} has been ${payload.isActive ? 'activated' : 'deactivated'}.`,
            userId: user?.userId,
          })
        }
      }
    }
    recipe.merge(payload)
    await recipe.save()
    return { message: 'Recipe updated.', recipe }
  }

  async destroy({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    await recipe.delete()
    return { message: 'Recipe deleted.' }
  }

  /**
   * Shows all user's recipes
   *
   * @param auth contains the user's token
   * @returns the message informing about error or success, on success also recipes data.
   */
  async getUserRecipes({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (userId === undefined) {
      return { message: 'User not authenticated.' }
    }
    const recipes = await Recipe.query().where('userId', userId).preload('tags')
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        const reviews = await recipe.related('reviews').query()
        const avg = reviews.length
          ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
          : 0
        return {
          ...recipe.serialize(),
          averageRating: avg || 0,
        }
      })
    )
    return recipesWithDetails
  }
  /**
   * Shows recipes, if user role is amator filtered based on the user's nutritional profile
   *
   * @param auth contains the user's token
   * @returns the message informing about error or success, on success also recipes data.
   */
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
      const recipes = await Recipe.query()
      return await Promise.all(
        recipes.map(async (recipe) => {
          const reviews = await recipe.related('reviews').query()
          const avg = reviews.length
            ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
            : 0
          return {
            ...recipe.serialize(),
            averageRating: avg || 0,
          }
        })
      )
    }

    const profileCategoryIds = amator.nutritionalProfiles.map((profile) => profile.categoryId)

    if (profileCategoryIds.length === 0) {
      const recipes = await Recipe.query()
      const favouriteRecipesIds = await amator
        .related('favourites')
        .query()
        .select('id')
        .then((results) => results.map((fav) => fav.id))

      const recipesWithFavouriteFlag = await Promise.all(
        recipes.map(async (recipe) => {
          const reviews = await recipe.related('reviews').query()
          const avg = reviews.length
            ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
            : 0
          return {
            ...recipe.serialize(),
            isFavourite: favouriteRecipesIds.includes(recipe.id),
            averageRating: avg || 0,
          }
        })
      )

      return recipesWithFavouriteFlag.sort((a, b) => b.averageRating - a.averageRating)
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

    const favouriteRecipesIds = await amator
      .related('favourites')
      .query()
      .select('id')
      .then((results) => results.map((fav) => fav.id))

    const recipesWithFavouriteFlag = await Promise.all(
      recipes.map(async (recipe) => {
        const reviews = await recipe.related('reviews').query()
        const avg = reviews.length
          ? reviews.reduce((sum, review) => sum + review.grade, 0) / reviews.length
          : 0
        return {
          ...recipe.serialize(),
          isFavourite: favouriteRecipesIds.includes(recipe.id),
          averageRating: avg || 0,
        }
      })
    )

    return recipesWithFavouriteFlag.sort((a, b) => b.averageRating - a.averageRating)
  }
  /**
   * Adds an ingredient to a chosen recipes.
   *
   @param params contains the recipe id
   @param request contains the payload with ingredient data.
   * @returns the message informing about error or success.
   */
  async addIngredientToRecipe({ request, params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const payload = request.only(['name', 'calorific_value'])
    const ingredient = await Ingredient.create({ ...payload, recipeId: recipe.id })
    return { message: 'Ingredient added to recipe.', ingredient }
  }
  /**
   * Deletes a connection between chosen ingredient and its recipe.
   *
   @param params contains the ingredient id
   * @returns the message informing about error or success.
   */
  async removeIngredientFromRecipe({ params }: HttpContext) {
    const ingredient = await Ingredient.findOrFail(params.id)
    await ingredient.delete()
    return { message: 'Ingredient removed from recipe.' }
  }
  /**
   * Shows all the recipe's ingredients.
   *
   @param params contains the recipe id
   * @returns the message informing about error or data.
   */
  async getRecipeIngredients({ params }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)
    const ingredients = await Ingredient.query().where('recipeId', recipe.id)
    return ingredients
  }
}
