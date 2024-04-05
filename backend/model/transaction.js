const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    required: true,
    type: String
  },
  image: {
    type: String,
    required: true
  },
  sold: {
    type: Boolean,
    required: true
  },
  dateOfSale: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
