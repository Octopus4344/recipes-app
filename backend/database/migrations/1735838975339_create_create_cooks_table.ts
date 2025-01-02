import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCooks extends BaseSchema {
  protected tableName = 'cooks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.integer('fk_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('fk_restaurant_id')
        .unsigned()
        .references('id')
        .inTable('restaurants')
        .onDelete('SET NULL')
        .nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
