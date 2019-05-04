exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        { email: 'pbj@gmail.com', password: 'peanutbutta' },
        { email: 'brett@yahoo.com', password: '1QAZ' },
        { email: 'brett@hotmail.com', password: '1qaz' },
      ]);
    });
};
