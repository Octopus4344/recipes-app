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
    pivotForeignKey: 'fk_package_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'fk_product_id',
    pivotTable: 'food_packages_products',
    pivotTimestamps: true,
  })
  declare products: ManyToMany<typeof Product>

  @column({ columnName: 'fk_producer_id' })
  declare producerId: number
}
