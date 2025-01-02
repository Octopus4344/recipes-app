import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Cook from '#models/cook'

export default class Restaurant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare website: string | null

  @column()
  declare city: string

  @column()
  declare street: string

  @column()
  declare street_number: number

  @column()
  declare fk_user_id: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Cook)
  declare cooks: HasMany<typeof Cook>
}
