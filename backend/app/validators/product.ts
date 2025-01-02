import vine from '@vinejs/vine'

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    image_url: vine.string(),
    fk_producer_id: vine.number().positive(),
  })
)