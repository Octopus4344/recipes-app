import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Recipe from '#models/recipe'

export default class Favourite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'fk_amator_id' })
  declare amatorId: number

  @column({ columnName: 'fk_recipe_id' })
  declare recipeId: number

  @belongsTo(() => User, {
    foreignKey: 'fk_amator_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Recipe)
  declare recipe: BelongsTo<typeof Recipe>
}
