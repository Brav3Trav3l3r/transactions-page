const express = require('express');
const {
  addTransactions,
  getTransactions,
  getMonthlyStats,
  getPriceRange,
  getByCategory,
  getMonthlyAggregate
} = require('../controller/transactionController');

const router = express.Router();

router.post('/add-transactions', addTransactions);

router.route('/').get(getTransactions);
router.get('/get-monthly-stats', getMonthlyStats);
router.get('/get-price-ranges', getPriceRange);
router.get('/categories', getByCategory);
router.get('/aggregate', getMonthlyAggregate);

module.exports = router;
