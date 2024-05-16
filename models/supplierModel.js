const connection = require('../config/db');

const Supplier = {
    getAll: (callback) => {
        connection.query('SELECT * FROM suppliers', (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
    getById: (id, callback) => {
        connection.query('SELECT * FROM suppliers WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]);
        });
    },
    create: (supplier, callback) => {
        const { name, contact_name, contact_email, contact_phone, address } = supplier;
        if (!name) {
            return callback(new Error('Missing required fields'));
        }
        const newSupplier = { name, contact_name, contact_email, contact_phone, address };
        connection.query('INSERT INTO suppliers SET ?', newSupplier, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id: results.insertId, ...newSupplier });
        });
    },
    update: (id, supplier, callback) => {
        const { name, contact_name, contact_email, contact_phone, address } = supplier;
        if (!name) {
            return callback(new Error('Missing required fields'));
        }
        const updatedSupplier = { name, contact_name, contact_email, contact_phone, address };
        connection.query('UPDATE suppliers SET ? WHERE id = ?', [updatedSupplier, id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, { id, ...updatedSupplier });
        });
    },
    delete: (id, callback) => {
        connection.query('DELETE FROM suppliers WHERE id = ?', [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = Supplier;