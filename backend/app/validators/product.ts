import vine from '@vinejs/vine'

const productSchema = vine.object({
  name: vine.string(),
  imageUrl: vine.string(),
  producerId: vine.number(),
  isActive: vine.boolean(),
})

export const updateProductValidator = vine.compile(productSchema)
