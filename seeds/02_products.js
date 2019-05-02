exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('products').insert([
        { title: 'lamp', description: 'let there be light', inventory: 10, price: 49.99 },
        { title: 'drevleauge painting', description: 'smells a little funny', inventory: 2, price: 500.01 },
        { title: 'broken dongle', description: 'worse than useless', inventory: 250, price: 10.0 },
      ]);
    });
};
