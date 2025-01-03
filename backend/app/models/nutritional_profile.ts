import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Category from '#models/category'

export default class NutritionalProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'fk_amator_id' })
  declare amatorId: number

  @column({ columnName: 'fk_category_id' })
  declare categoryId: number

  @belongsTo(() => User, {
    foreignKey: 'fk_amator_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
