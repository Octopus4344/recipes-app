import Amator from '#models/amator'
import FoodProducer from '#models/food_producer'
import Restaurant from '#models/restaurant'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { foodProducerRegisterValidator } from '#validators/food_producer_register'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import assert from 'node:assert'

export default class AuthController {
  async store({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
      return response.abort('Invalid credentials')
    }
    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }
    await auth.use('jwt').generate(user)
    let userResponse = user.serialize()
    const isAmator = (await Amator.findBy('userId', user.id)) !== null
    if (isAmator) {
      const amatorData = await Amator.findBy('userId', user.id)
      return response.ok({ ...userResponse, amatorData: amatorData?.serialize(), role: 'amator' })
    }
    const isRestaurant = (await Restaurant.findBy('userId', user.id)) !== null
    if (isRestaurant) {
      const restaurantData = await Restaurant.findBy('userId', user.id)
      return response.ok({
        ...userResponse,
        restaurantData: restaurantData?.serialize(),
        role: 'restaurant',
      })
    }
    const isFoodProducer = (await FoodProducer.findBy('userId', user.id)) !== null
    if (isFoodProducer) {
      const foodProducerData = await FoodProducer.findBy('userId', user.id)
      return response.ok({
        ...userResponse,
        foodProducerData: foodProducerData?.serialize(),
        role: 'food_producer',
      })
    }
    return response.ok(userResponse)
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const hashedPassword = await hash.make(payload.password)
    const userToCreate = {
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
    }
    const user = await User.create(userToCreate)
    const amator = await Amator.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      points: 0,
      userId: user.id,
    })

    return response.created({ user, amator })
  }

  async registerFoodProducer({ request, response }: HttpContext) {
    const payload = await request.validateUsing(foodProducerRegisterValidator)
    const hashedPassword = await hash.make(payload.password)
    const userToCreate = {
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
    }
    const user = await User.create(userToCreate)
    const foodProducer = await FoodProducer.create({
      name: payload.name,
      userId: user.id,
    })

    return response.created({ user, foodProducer })
  }

  async destroy({ response }: HttpContext) {
    try {
      response.clearCookie('token')

      return response.ok({ message: 'Successfully logged out' })
    } catch (error) {
      assert(error instanceof Error)
      return response.internalServerError({
        message: 'Logout failed',
        error: error.message,
      })
    }
  }
}
