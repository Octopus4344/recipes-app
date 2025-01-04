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
import router from '@adonisjs/core/services/router'

router.get('/recipes', [RecipesController, 'index'])
router.post('/recipes', [RecipesController, 'store'])
router.get('/recipes/:id', [RecipesController, 'show'])
router.put('/recipes/:id', [RecipesController, 'update'])
router.delete('/recipes/:id', [RecipesController, 'destroy'])

router.get('/food_packages_products/:id', [FoodPackagesProductsController, 'index'])
