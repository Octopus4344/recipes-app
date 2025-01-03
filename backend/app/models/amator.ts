import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Review from '#models/message'
import Favourite from '#models/favourite'
import NutritionalProfile from '#models/nutritional_profile'

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

  @hasMany(() => Favourite)
  declare favourites: HasMany<typeof Favourite>

  @hasMany(() => NutritionalProfile)
  declare nutritionalProfiles: HasMany<typeof NutritionalProfile>
}
