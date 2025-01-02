import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import FoodProducer from '#models/food_producer'
import Ingredient from '#models/ingredient'
import FoodPackage from '#models/food_package'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image_url: string

  @column()
  declare fk_producer_id: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => FoodProducer)
  declare foodProducer: BelongsTo<typeof FoodProducer>

  @hasMany(() => Ingredient)
  declare ingredients: HasMany<typeof Ingredient>

  @hasMany(() => FoodPackage)
  declare foodPackages: HasMany<typeof FoodPackage>
}
