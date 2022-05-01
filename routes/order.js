const express = require('express');
const { fetchOrders, fetchAllOrders, saveOrder } = require('../controllers/order');
const router = express.Router();

router.get('/orders/:ownerId',fetchOrders)
router.get('/orders',fetchAllOrders)
router.post('/order',saveOrder)

module.exports = router;