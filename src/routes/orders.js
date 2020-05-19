const express = require('express');
const router = express.Router();
const { prepareOrders, finishOrder } = require('../controllers/orders');

router.post('/', prepareOrders);

router.post('/finished', finishOrder);

module.exports = router;
