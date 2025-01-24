/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RecipesController = () => import('#controllers/recipes_controller')
const FoodPackagesProductsController = () =>
  import('#controllers/food_packages_products_controller')
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const IngredientProductController = () => import('#controllers/ingredient_product_controller')
const ReviewsController = () => import('#controllers/reviews_controller')
const UsersController = () => import('#controllers/users_controller')
const FoodPackagesController = () => import('#controllers/food_packages_controller')

//Recipes
router.get('/recipes', [RecipesController, 'getRecipes']).use(middleware.ourAuth())
router.post('/recipes', [RecipesController, 'store'])
router.get('/recipes/:id', [RecipesController, 'show']).use(middleware.ourAuth())
router.put('/recipes/:id', [RecipesController, 'update'])
router.delete('/recipes/:id', [RecipesController, 'destroy'])
router.get('/user/recipes', [RecipesController, 'getUserRecipes']).use(middleware.ourAuth())
//Get user favourites
router.get('/user/favourite', [UsersController, 'getUserFavourites']).use(middleware.ourAuth())
//Add recipe to favourites
router.post('/user/favourite', [UsersController, 'addRecipeToFavourites']).use(middleware.ourAuth())
//Remove recipe from favourites
router
  .delete('/user/favourite', [UsersController, 'removeRecipeFromFavourites'])
  .use(middleware.ourAuth())

//Get products of a food package, add product to package and delete product from package
router.get('/food_packages_products/:id', [FoodPackagesProductsController, 'index'])
router
  .post('/food_packages_products/:id', [FoodPackagesProductsController, 'addProductToPackage'])
  .use(middleware.ourAuth())
router
  .delete('/food_packages_products/:id', [FoodPackagesProductsController, 'destroy'])
  .use(middleware.ourAuth())

//Get user packages, store, delete and update
router
  .get('/user/food_packages', [FoodPackagesController, 'getUserFoodPackages'])
  .use(middleware.ourAuth())
router.post('/food_packages', [FoodPackagesController, 'store']).use(middleware.ourAuth())
router.delete('/food_packages/:id', [FoodPackagesController, 'destroy']).use(middleware.ourAuth())
router.put('/food_packages/:id', [FoodPackagesController, 'update']).use(middleware.ourAuth())

//User interactions
router.post('user/login', [AuthController, 'store']).use(middleware.guest())
router.post('user/register', [AuthController, 'register']).use(middleware.guest())
router
  .post('food_producer/register', [AuthController, 'registerFoodProducer'])
  .use(middleware.guest())
router.delete('user/logout', [AuthController, 'destroy']).use(middleware.ourAuth())

//Review
router.get('/reviews', [ReviewsController, 'index'])
router.post('/reviews', [ReviewsController, 'store'])
router.get('/recipe_reviews/:id', [ReviewsController, 'recipeReviews'])
router.post('/recipes_tags/:id', [RecipesController, 'addTagsToRecipe'])
router.delete('/recipes_tags/:id', [RecipesController, 'destroyTagsFromRecipe'])
router.get('/recipes_tags/:id', [RecipesController, 'getRecipeTags'])
router.get('/recipes_tags/categories/:id', [RecipesController, 'getTags'])

//Ingredient recipe
router.get('/recipe_ingredients/:id', [RecipesController, 'getRecipeIngredients'])
router.post('/recipe_ingredients/:id', [RecipesController, 'addIngredientToRecipe'])
router.delete('/recipe_ingredients/:id', [RecipesController, 'removeIngredientFromRecipe'])
//Ingredient product
router.post('/ingredient_products/:id', [IngredientProductController, 'addProductToIngredient'])
router.delete('/ingredient_products/:id', [
  IngredientProductController,
  'removeProductFromIngredient',
])
