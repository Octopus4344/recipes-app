import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRestaurants extends BaseSchema {
  protected tableName = 'restaurants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('website')
      table.string('city').notNullable()
      table.string('street')
      table.integer('street_number')
      table.integer('fk_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
