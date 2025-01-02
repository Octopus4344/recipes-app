import { BaseSchema } from '@adonisjs/lucid/schema'
export default class NutritionalProfiles extends BaseSchema {
  protected tableName = 'nutritional_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('fk_amator_id')
        .unsigned()
        .references('id')
        .inTable('amators')
        .onDelete('CASCADE')
      table
        .integer('fk_category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.primary(['fk_amator_id', 'fk_category_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
