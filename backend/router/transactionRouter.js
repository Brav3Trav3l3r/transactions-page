const express = require('express');
const {
  addTransactions,
  getTransactions
} = require('../controller/transactionController');

const router = express.Router();

router.post('/add-transactions', addTransactions);

router.route('/').get(getTransactions);

module.exports = router;
