require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('uncaughtException', (err) => {
  console.error(`Error-${err.name}: ${err.message}`);
  console.log('Unhandled Rejection! Shutting down...');
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(`Error-${err.name}: ${err.message}`);
  console.log('Unhandled Rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
