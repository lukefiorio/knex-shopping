const express = require('express');
const routerProducts = express.Router();
const knex = require('../database');

routerProducts.route('/').get((req, res) => {
  knex
    .raw('SELECT * FROM products')
    .then((result) => {
      if (result.rows.length === 0) {
        throw err;
      }
      res.send(result.rows);
    })
    .catch((err) => {
      res.send('{ "message": "No products found" }');
    });
});

routerProducts
  .route('/:id')
  .get((req, res) => {
    const id = req.url.slice(1);
    knex
      .raw('SELECT * FROM products WHERE id = ?', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          throw err;
        }
        res.send(result.rows);
      })
      .catch((err) => {
        res.send('{ "message": "Product not found" }');
      });
  })
  .put((req, res) => {
    const id = req.url.slice(1);
    const reqTitle = req.body.title;
    const reqDescription = req.body.description;
    const reqInventory = req.body.inventory;
    const reqPrice = req.body.price;
    const hasKeys = reqTitle && reqDescription && reqInventory && reqPrice;
    knex
      .raw('SELECT * FROM products WHERE id = ?', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          throw '{ "message": "Product not found" }';
        }
        if (!hasKeys) {
          throw '{ "message": "Must post all product fields" }';
        }
        knex
          .raw('UPDATE products SET title = ?, description = ?, inventory = ?, price = ? WHERE id = ?', [
            reqTitle,
            reqDescription,
            reqInventory,
            reqPrice,
            id,
          ])
          .then((result) => {
            res.send(`{ "message": "Product ${id} has been updated" }`);
          });
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    const id = req.url.slice(1);
    knex
      .raw('SELECT * FROM products WHERE id = ?', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          throw `{ "message": "Product id: ${id} not found" }`;
        }
        knex.raw('DELETE FROM products WHERE id = ?', [id]).then((result) => {
          res.send(`{ "message": "Product id: ${id} successfully deleted" }`);
        });
      })
      .catch((err) => {
        res.send(err);
      });
  });

routerProducts.route('/new').post((req, res) => {
  const reqTitle = req.body.title;
  const reqDescription = req.body.description;
  const reqInventory = req.body.inventory;
  const reqPrice = req.body.price;
  const hasKeys = reqTitle && reqDescription && reqInventory && reqPrice;
  knex
    .raw('SELECT * FROM products WHERE title = ?', [reqTitle])
    .then((result) => {
      if (result.rows.length > 0) {
        throw '{ "message": "Product already exists" }';
      }
      if (!hasKeys) {
        throw '{ "message": "Must post all product fields" }';
      }
      knex
        .raw('INSERT INTO products (title, description, inventory, price) values (?, ?, ?, ?) RETURNING *', [
          reqTitle,
          reqDescription,
          reqInventory,
          reqPrice,
        ])
        .then((result) => {
          res.send(result.rows);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = routerProducts;
