const connection = require('../config/db');

const Order = {
    getAll: (callback) => {
        connection.query('SELECT * FROM orders', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        connection.query('SELECT * FROM orders WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    create: (order, callback) => {
        const { supplier_id, order_date, total_amount, status } = order;
        if (!supplier_id || !order_date || !total_amount) {
            return callback(new Error('Missing required fields'));
        }
        const newOrder = { supplier_id, order_date, total_amount, status };
        connection.query('INSERT INTO orders SET ?', newOrder, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: results.insertId, ...newOrder });
        });
    },
    update: (id, order, callback) => {
        const { supplier_id, order_date, total_amount, status } = order;
        if (!supplier_id || !order_date || !total_amount) {
            return callback(new Error('Missing required fields'));
        }
        const updatedOrder = { supplier_id, order_date, total_amount, status };
        connection.query('UPDATE orders SET ? WHERE id = ?', [updatedOrder, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id, ...updatedOrder });
        });
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM orders WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = Order;