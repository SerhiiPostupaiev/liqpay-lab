const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  products: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('order', OrderSchema);
