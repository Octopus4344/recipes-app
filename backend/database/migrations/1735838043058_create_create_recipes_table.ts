import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Recipes extends BaseSchema {
  protected tableName = 'recipes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.integer('preparation_time').notNullable()
      table.integer('difficulty_level').notNullable()
      table.boolean('is_professional').notNullable()
      table.string('image_url')
      table.integer('fk_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('is_active').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
