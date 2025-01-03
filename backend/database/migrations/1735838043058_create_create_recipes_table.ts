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
      table.boolean('isProffessional').notNullable() //typo: isProfessional (but i am not messing with that)
      table.string('image_url').notNullable()
      table.integer('fk_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('isActive').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
