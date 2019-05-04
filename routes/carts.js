const express = require('express');
const routerCarts = express.Router();
const knex = require('../database');

routerCarts.route('/:user_id').get((req, res) => {
  const id = req.url.slice(1);
  knex
    .raw('SELECT id FROM users WHERE id = ?', [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.send(404, '{ "message": "User not found" }');
      }
      knex
        .raw(
          'SELECT products.* FROM users INNER JOIN carts ON carts.user_id = users.id INNER JOIN products ON products.id = carts.product_id WHERE users.id = ?',
          [id],
        )
        .then((result) => {
          return res.send(result.rows);
        });
    })
    .catch((err) => {
      res.send(500, err);
    });
});

routerCarts
  .route('/:user_id/:product_id')
  .post((req, res) => {
    const endIndexSlash = req.url.indexOf('/', 1) - 1;
    const reqUserId = req.url.substr(1, endIndexSlash);
    const reqProductId = req.url.substr(endIndexSlash + 2);
    knex
      .raw('SELECT id FROM users WHERE id = ?', [reqUserId])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.send(404, '{ "message": "User does not exist" }');
        }
        knex.raw('SELECT id FROM products WHERE id = ?', [reqProductId]).then((result) => {
          if (result.rows.length === 0) {
            return res.send(404, '{ "message": "Product does not exist" }');
          }
          knex
            .raw('INSERT INTO carts (user_id, product_id) values (?, ?)', [reqUserId, reqProductId])
            .then((result) => {
              return res.send('{ "success": true }');
            });
        });
      })
      .catch((err) => {
        res.send(500, err);
      });
  })
  .delete((req, res) => {
    const endIndexSlash = req.url.indexOf('/', 1) - 1;
    const reqUserId = req.url.substr(1, endIndexSlash);
    const reqProductId = req.url.substr(endIndexSlash + 2);
    knex
      .raw('SELECT id FROM users WHERE id = ?', [reqUserId])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.send(404, '{ "message": "User does not exist" }');
        }
        knex.raw('SELECT id FROM products WHERE id = ?', [reqProductId]).then((result) => {
          if (result.rows.length === 0) {
            return res.send(404, '{ "message": "Product does not exist" }');
          }
          knex
            .raw('DELETE FROM carts WHERE user_id = ? AND product_id = ?', [reqUserId, reqProductId])
            .then((result) => {
              return res.send('{ "success": true }');
            });
        });
      })
      .catch((err) => {
        res.send(500, err);
      });
  });

module.exports = routerCarts;
