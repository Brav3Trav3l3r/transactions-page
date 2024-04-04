const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
