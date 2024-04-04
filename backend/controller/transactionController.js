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

exports.getPriceRange = catchAsync(async (req, res, next) => {
  const { month } = req.query;

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: 1000 }
  ];

  const itemsRange = await Transaction.aggregate([
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
      $bucket: {
        groupBy: '$price',
        boundaries: priceRanges.map(range => range.min),
        default: 'Other',
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { itemsRange }
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
