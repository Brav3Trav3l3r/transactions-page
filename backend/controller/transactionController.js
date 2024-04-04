const Transaction = require('../model/transaction');
const catchAsync = require('../utils/catchAsync');

class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  paginate() {
    const page = this.queryObj.page || 1;
    const limit = this.queryObj.perPage || 10;
    const skip = (page - 1) * 10;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.addTransactions = catchAsync(async (req, res, next) => {
  const { transactions } = req.body;

  const newTransacton = await Transaction.insertMany(transactions);

  res.status(200).send({
    status: 'success',
    data: { transaction: newTransacton }
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Transaction.find(), req.query).paginate();
  const transactions = await features.query;

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: { transactions }
  });
});
