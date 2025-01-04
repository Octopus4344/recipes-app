import User from '#models/user'
import { registerValidator } from '#validators/register'
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
    //const isPasswordValid = await hash.verify(user.password, password)
    const isPasswordValid = user.password === password

    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }
    await auth.use('jwt').generate(user)
    return response.ok(user)
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
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
