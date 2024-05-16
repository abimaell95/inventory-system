const Product = require('../models/productModel');

const getAllProducts = (req, res) => {
    Product.getAll((err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;
    Product.getById(id, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(product);
    });
};

const createProduct = (req, res) => {
    const newProduct = req.body;
    Product.create(newProduct, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(product);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    Product.update(id, updatedProduct, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(product);
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
