import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Amator from '#models/amator'
import Recipe from '#models/recipe'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare grade: number

  @column()
  declare review: string

  @column({ columnName: 'fk_amator_id' })
  declare amatorId: number

  @column({ columnName: 'fk_recipe_id' })
  declare recipeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Amator)
  declare user: BelongsTo<typeof Amator>

  @belongsTo(() => Recipe)
  declare recipe: BelongsTo<typeof Recipe>
}
