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
  declare streetNumber: number

  @column({ columnName: 'fk_user_id' }) 
  declare userId: number

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Cook)
  declare cooks: HasMany<typeof Cook>
}
