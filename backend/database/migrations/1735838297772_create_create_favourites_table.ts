import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Favourites extends BaseSchema {
  protected tableName = 'favourites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('fk_amator_id')
        .unsigned()
        .references('id')
        .inTable('amators')
        .onDelete('CASCADE')
      table
        .integer('fk_recipe_id')
        .unsigned()
        .references('id')
        .inTable('recipes')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
