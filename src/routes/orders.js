const express = require('express');
const router = express.Router();
const {
  prepareOrders,
  finishOrder,
  getAllOrders,
} = require('../controllers/orders');

router.post('/', prepareOrders);

router.post('/finished', finishOrder);

router.get('/', getAllOrders);

module.exports = router;
