const axios = require('axios');
const Transaction = require('../model/transaction');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.addTransactions = catchAsync(async (req, res, next) => {
  const { transactions } = req.body;

  const newTransacton = await Transaction.insertMany(transactions);

  res.status(200).send({
    status: 'success',
    data: { transaction: newTransacton }
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Transaction.find(), req.query)
    .month()
    .search()
    .paginate();

  const transactions = await features.query;

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: { transactions }
  });
});

exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const { month } = req.query;

  const stats = await Transaction.aggregate([
    {
      $addFields: {
        selectedMonth: { $month: '$dateOfSale' }
      }
    },
    {
      $match: {
        selectedMonth: Number(month)
      }
    },
    {
      $group: {
        _id: null,
        totalSaleAmount: {
          $sum: {
            $cond: { if: { $eq: ['$sold', true] }, then: '$price', else: 0 }
          }
        },
        totalSoldItems: {
          $sum: {
            $cond: { if: { $eq: ['$sold', true] }, then: 1, else: 0 }
          }
        },
        totalUnsoldItems: {
          $sum: {
            $cond: { if: { $eq: ['$sold', false] }, then: 1, else: 0 }
          }
        }
      }
    }
  ]);

  res.status(200).json({
    message: 'success',
    data: { stats }
  });
});

function categorizeTransactions(transactions) {
  const ranges = [
    { range: '0-100', count: 0 },
    { range: '101-200', count: 0 },
    { range: '201-300', count: 0 },
    { range: '301-400', count: 0 },
    { range: '401-500', count: 0 },
    { range: '501-600', count: 0 },
    { range: '601-700', count: 0 },
    { range: '701-800', count: 0 },
    { range: '801-900', count: 0 },
    { range: '901-above', count: 0 }
  ];

  // Iterate through transactions and categorize them based on price ranges
  transactions.forEach(transaction => {
    const { price } = transaction;
    if (price >= 0 && price <= 100) {
      ranges[0].count += 1;
    } else if (price >= 101 && price <= 200) {
      ranges[1].count += 1;
    } else if (price >= 201 && price <= 300) {
      ranges[2].count += 1;
    } else if (price >= 301 && price <= 400) {
      ranges[3].count += 1;
    } else if (price >= 401 && price <= 500) {
      ranges[4].count += 1;
    } else if (price >= 501 && price <= 600) {
      ranges[5].count += 1;
    } else if (price >= 601 && price <= 700) {
      ranges[6].count += 1;
    } else if (price >= 701 && price <= 800) {
      ranges[7].count += 1;
    } else if (price >= 801 && price <= 900) {
      ranges[8].count += 1;
    } else {
      ranges[9].count += 1;
    }
  });

  return ranges;
}

exports.getPriceRange = catchAsync(async (req, res, next) => {
  const { month } = req.query;

  const monthlySales = await axios.get(
    `${process.env.BASE_URL}/transactions?month=${month}`
  );

  const categorizedTransactions = categorizeTransactions(
    monthlySales.data.data.transactions
  );

  res.status(200).json({
    status: 'success',
    data: { ranges: categorizedTransactions }
  });
});

exports.getByCategory = catchAsync(async (req, res, next) => {
  const { month } = req.query;

  const categories = await Transaction.aggregate([
    {
      $addFields: {
        month: { $month: '$dateOfSale' }
      }
    },
    {
      $match: {
        month: Number(month)
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { categories }
  });
});

async function fetchDataFromRoutes({ month }) {
  try {
    const monthlyStats = await axios.get(
      `${process.env.BASE_URL}/transactions/get-monthly-stats?month=${month}`
    );

    const priceRange = await axios.get(
      `${process.env.BASE_URL}/transactions/get-price-ranges?month=${month}`
    );

    const categories = await axios.get(
      `${process.env.BASE_URL}/transactions/categories?month=${month}`
    );

    // Combine the data from the three routes
    const combinedData = {
      stats: monthlyStats.data.data.stats,
      ranges: priceRange.data.data.itemsRange,
      categories: categories.data.data.categories
    };

    return combinedData;
  } catch (error) {
    throw new Error(`Error fetching data from routes: ${error.message}`);
  }
}

exports.getMonthlyAggregate = catchAsync(async (req, res, next) => {
  const { month } = req.query;
  const { stats, ranges, categories } = await fetchDataFromRoutes({ month });

  console.log(categories);

  res.status(200).json({
    status: 'success',
    data: { monthlyStat: stats, priceRanges: ranges, categories: categories }
  });
});
