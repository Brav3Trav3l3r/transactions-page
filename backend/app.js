const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/AppError');
const transactionRouter = require('./router/transactionRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('Welcome to roxiler sales backend api');
});

app.use('/transactions', transactionRouter);

app.all('*', (req, res, next) => {
  throw new AppError('Route does not exists', 404);
});

app.use(globalErrorHandler);

module.exports = app;
