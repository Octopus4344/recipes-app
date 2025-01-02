import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FoodPackagesProducts extends BaseSchema {
  protected tableName = 'food_packages_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('fk_product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('fk_package_id')
        .unsigned()
        .references('id')
        .inTable('food_packages')
        .onDelete('CASCADE')
      table.primary(['fk_product_id', 'fk_package_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
