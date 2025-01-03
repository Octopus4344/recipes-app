import vine from '@vinejs/vine'

const favouriteValidatorSchema = vine.object({
  amatorId: vine.number(),
  recipeId: vine.number(),
})

export const updateFavouriteValidator = vine.compile(favouriteValidatorSchema)
