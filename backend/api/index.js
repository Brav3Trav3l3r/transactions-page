require('dotenv-flow').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

process.on('uncaughtException', err => {
  console.log('Uncaught Exception 💥');
  console.log(err.name);

  process.exit(1);
});

const app = require('../app');

console.log(process.env.MONGODB_URI);
console.log(process.env.NODE_ENV);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to database');
  })
  .catch(err => console.log(err));

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection 💥');
  console.log(err.name, err.message);

  server.close(() => process.exit(1));
});
