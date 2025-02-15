const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { isProduction } = require('./utils');

const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
if (!isProduction()) {
  app.use(morgan('dev')); // logger
}
app.use(express.json()); // to parse json body
app.use(express.static(`${__dirname}/public`)); // to populate static files

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling route not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
