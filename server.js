'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });
const PORT = 3000;

const users = require('./routes/users.js');
const products = require('./routes/products.js');
const carts = require('./routes/carts.js');

app.use(urlParser);

app.use('/users', users);
app.use('/products', products);
app.use('/carts', carts);

const server = app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
