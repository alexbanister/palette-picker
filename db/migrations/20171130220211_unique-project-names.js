
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('projects', (table) => {
      table.unique('name');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('projects', (table) => {
      table.dropUnique('name');
    })
  ]);
};
