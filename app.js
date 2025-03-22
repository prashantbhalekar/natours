const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { isProduction } = require('./utils');

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// Global Middlewares
app.use(helmet()); // set security http headers

if (!isProduction()) {
  app.use(morgan('dev')); // logger
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again later',
});

app.use('/api', limiter); // limit each IP calls

app.use(express.json({ limit: '1mb' })); // to parse json body

app.use(mongoSanitize()); // data sanitization against NoSQL query injection

app.use(xss()); // data sanitization against XSS

app.use(
  hpp({ whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'price'] })
); // prevent parameter pollution

app.use(express.static(`${__dirname}/public`)); // to populate static files

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling route not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
