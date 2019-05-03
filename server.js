'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });
const PORT = 3000;

const users = require('./routes/users.js');
const products = require('./routes/products.js');
const carts = require('./routes/carts.js');

app.use('/users', urlParser, users);
app.use('/products', urlParser, products);
app.use('/carts', urlParser, carts);

// knex
//   .select()
//   .from('users')
//   .then((result) => {
//     console.log(result);
//   });

// knex.raw('SELECT * FROM users WHERE id = ?', [1]).then((result) => {
//   console.log(result.rows);
// });

// app.get('/', (req, res) => {
//   knex.raw('SELECT * FROM users WHERE id = ?', [1]).then((result) => {
//     console.log(result.rows);
//     res.send(result.rows);
//   });
// });

const server = app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
