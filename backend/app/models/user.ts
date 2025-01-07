import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Cook from '#models/cook'
import Amator from '#models/amator'
import Restaurant from '#models/restaurant'
import FoodProducer from '#models/food_producer'
import Notification from '#models/notification'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Cook)
  declare cook: HasOne<typeof Cook>

  @hasOne(() => Amator)
  declare amator: HasOne<typeof Amator>

  @hasOne(() => Restaurant)
  declare restaurant: HasOne<typeof Restaurant>

  @hasOne(() => FoodProducer)
  declare foodProducer: HasOne<typeof FoodProducer>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  public getId() {
    return this.id
  }
  public getOriginal() {
    return this
  }
}
