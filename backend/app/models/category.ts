import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: 'type_of_diet' | 'type_of_meal' | 'other'
}
