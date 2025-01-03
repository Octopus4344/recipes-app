import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import FoodPackage from '#models/food_package'
import User from '#models/user'

export default class FoodProducer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => FoodPackage)
  declare foodPackages: HasMany<typeof FoodPackage>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
