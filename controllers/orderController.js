const Order = require('../models/orderModel');

const getAllOrders = (req, res) => {
    Order.getAll((err, orders) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(orders);
    });
};

const getOrderById = (req, res) => {
    const { id } = req.params;
    Order.getById(id, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(order);
    });
};

const createOrder = (req, res) => {
    const newOrder = req.body;
    Order.create(newOrder, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(order);
    });
};

const updateOrder = (req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    Order.update(id, updatedOrder, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(order);
    });
};

const deleteOrder = (req, res) => {
    const { id } = req.params;
    Order.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};