import vine from '@vinejs/vine'

const productSchema = vine.object({
  name: vine.string(),
  imageUrl: vine.string().optional(),
  producerId: vine.number().positive(),
  isActive: vine.boolean(),
})

export const updateProductValidator = vine.compile(productSchema)
