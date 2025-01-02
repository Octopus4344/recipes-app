import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'
import Recipe from '#models/recipe'

export default class Ingredient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare calorific_value: number

  @column()
  declare fk_recipe_id: number

  @column()
  declare fk_product_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Recipe)
  declare recipe: BelongsTo<typeof Recipe>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
