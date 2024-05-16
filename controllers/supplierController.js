const Supplier = require('../models/supplierModel');

const getAllSuppliers = (req, res) => {
    Supplier.getAll((err, suppliers) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(suppliers);
    });
};

const getSupplierById = (req, res) => {
    const { id } = req.params;
    Supplier.getById(id, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(supplier);
    });
};

const createSupplier = (req, res) => {
    const newSupplier = req.body;
    Supplier.create(newSupplier, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(supplier);
    });
};

const updateSupplier = (req, res) => {
    const { id } = req.params;
    const updatedSupplier = req.body;
    Supplier.update(id, updatedSupplier, (err, supplier) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(supplier);
    });
};

const deleteSupplier = (req, res) => {
    const { id } = req.params;
    Supplier.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};