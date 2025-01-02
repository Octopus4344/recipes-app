import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class FoodPackage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @manyToMany(() => Product, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
    pivotTable: 'food_packages_products',
    pivotTimestamps: true,
  })
  declare groups: ManyToMany<typeof Product>

  @column()
  declare fk_producer_id: number
}
