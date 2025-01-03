import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Review from '#models/message'
import Favourite from '#models/favourite'
import Category from '#models/category'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare preparationTime: number

  @column()
  declare difficultyLevel: number

  @column()
  declare isProfessional: boolean

  @column()
  declare imageUrl: string | null

  @column()
  declare userId: number | null

  @column()
  declare isActive: boolean

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

  @manyToMany(() => Category, {
    localKey: 'id',
    pivotForeignKey: 'category_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'category_id',
    pivotTable: 'tags',
    pivotTimestamps: true,
  })
  declare groups: ManyToMany<typeof Category>
}
