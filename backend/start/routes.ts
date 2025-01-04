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

router.get('/recipes', [RecipesController, 'index']).use(middleware.ourAuth())
router.post('/recipes', [RecipesController, 'store'])
router.get('/recipes/:id', [RecipesController, 'show'])
router.put('/recipes/:id', [RecipesController, 'update'])
router.delete('/recipes/:id', [RecipesController, 'destroy'])

router.get('/food_packages_products/:id', [FoodPackagesProductsController, 'index'])

router.post('user/login', [AuthController, 'store']).use(middleware.guest())
router.post('user/register', [AuthController, 'register']).use(middleware.guest())
router.delete('user/logout', [AuthController, 'destroy']).use(middleware.ourAuth())
