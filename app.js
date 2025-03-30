const path = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
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
const cookieParser = require('cookie-parser');
const compression = require('compression');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares
app.use(express.static(path.join(__dirname, 'public'))); // to populate static files

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
app.use(cookieParser()); // to parse data from cookie
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize()); // data sanitization against NoSQL query injection

app.use(xss()); // data sanitization against XSS

app.use(compression()); // for compression of data while sending it to client

app.use(
  hpp({ whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'price'] })
); // prevent parameter pollution

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handling route not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
