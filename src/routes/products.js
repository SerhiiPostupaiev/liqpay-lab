const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getAddedProducts,
} = require('../controllers/products');

router.get('/', getAllProducts);

router.post('/', createProduct);

router.post('/added', getAddedProducts);

module.exports = router;
