import vine from '@vinejs/vine'

const restaurantValidatorSchema = vine.object({
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  name: vine.string(),
  city: vine.string(),
  street: vine.string().optional(),
  streetNumber: vine.string().optional(),
})

export const updateRestaurantValidator = vine.compile(restaurantValidatorSchema)
