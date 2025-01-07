import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Review from '#models/review'
import NutritionalProfile from '#models/nutritional_profile'
import Recipe from '#models/recipe'

export default class Amator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare points: number

  @column({ columnName: 'fk_user_id' })
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

  @manyToMany(() => Recipe, {
    localKey: 'id',
    pivotForeignKey: 'fk_amator_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'fk_recipe_id',
    pivotTable: 'favourites',
    pivotTimestamps: true,
  })
  declare favourites: ManyToMany<typeof Recipe>

  @hasMany(() => NutritionalProfile)
  declare nutritionalProfiles: HasMany<typeof NutritionalProfile>
}
