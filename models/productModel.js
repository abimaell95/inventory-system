const connection = require('../config/db');

const Product = {
    getAll: (callback) => {
        connection.query('SELECT * FROM products', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    create: (product, callback) => {
        connection.query('INSERT INTO products SET ?', product, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: results.insertId, ...product });
        });
    },
    update: (id, product, callback) => {
        connection.query('UPDATE products SET ? WHERE id = ?', [product, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id, ...product });
        });
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = Product;
