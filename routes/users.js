const express = require('express');
const routerUsers = express.Router();
const knex = require('../database');

routerUsers
  .route('/:id')
  .get((req, res) => {
    const id = req.url.slice(1);
    knex
      .raw('SELECT * FROM users WHERE id = ?', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.send(404, '{ "message": "User not found" }');
        }
        res.send(result.rows[0]);
      })
      .catch((err) => {
        res.send(500, err);
      });
  })
  .delete((req, res) => {
    const id = req.url.slice(1);
    knex
      .raw('SELECT * FROM users WHERE id = ?', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.send(404, '{ "message": "User not found" }');
        }
        knex.raw('DELETE FROM users WHERE id = ?', [id]).then((result) => {
          res.send(`{ "message": "User id: ${id} successfully deleted" }`);
        });
      })
      .catch((err) => {
        res.send(500, err);
      });
  });

routerUsers.route('/login').post((req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;
  knex
    .raw('SELECT * FROM users WHERE email = ?', [reqEmail])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.send(404, '{ "message": "User not found" }');
      }
      if (result.rows[0].password !== reqPassword) {
        return res.send(400, '{ "message": "Incorrect password" }');
      }
      res.send(result.rows[0]);
    })
    .catch((err) => {
      res.send(500, err);
    });
});

routerUsers.route('/register').post((req, res) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;
  knex
    .raw('SELECT * FROM users WHERE email = ?', [reqEmail])
    .then((result) => {
      if (result.rows.length > 0) {
        return res.send(400, '{ "message": "User already exists" }');
      }
      knex
        .raw('INSERT INTO users (email, password) values (?, ?) RETURNING *', [reqEmail, reqPassword])
        .then((result) => {
          return res.send(result.rows[0]);
        });
    })
    .catch((err) => {
      res.send(500, err);
    });
});

routerUsers.route('/:id/forgot-password').put((req, res) => {
  const endIndexSlash = req.url.indexOf('/', 1) - 1;
  const id = req.url.substr(1, endIndexSlash);
  const reqPassword = req.body.password;
  knex
    .raw('SELECT * FROM users WHERE id = ?', [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.send(404, '{ "message": "User not found" }');
      }
      knex.raw('UPDATE users SET password = ? WHERE id = ?', [reqPassword, id]).then((result) => {
        return res.send('{ "message": "New password created!" }');
      });
    })
    .catch((err) => {
      res.send(500, err);
    });
});

module.exports = routerUsers;
