const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logger
}
app.use(express.json()); // to parse json body
app.use(express.static(`${__dirname}/public`)); // to populate static files

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
