import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum CategoryType {
  TYPE_OF_DIET = 'type_of_diet',
  TYPE_OF_MEAL = 'type_of_meal',
  OTHER = 'other',
}

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: CategoryType
}
