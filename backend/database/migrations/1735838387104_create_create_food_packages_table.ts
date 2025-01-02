import { BaseSchema } from '@adonisjs/lucid/schema'
export default class FoodPackages extends BaseSchema {
  protected tableName = 'food_packages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('fk_producer_id')
        .unsigned()
        .references('id')
        .inTable('food_producers')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
