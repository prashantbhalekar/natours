const AppError = require('../utils/appError');
const { isProduction } = require('./../utils');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please user another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(' ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () =>
  new AppError('Expired token. Please log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (isProduction()) {
    let error = { ...err, message: err.message };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    if (req.originalUrl.startsWith('/api')) {
      if (error.isOperational) {
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        console.error('ERROR', error);

        res.status(500).json({
          status: 'error',
          message: 'Something Went Wrong!',
        });
      }
    } else {
      if (error.isOperational) {
        res.status(err.statusCode).render('error', {
          title: 'Something went wrong!',
          msg: err.message,
        });
      } else {
        console.error('ERROR', error);

        res.status(err.statusCode).render('error', {
          title: 'Something went wrong!',
          msg: 'Please try again latter',
        });
      }
    }
  } else {
    if (req.originalUrl.startsWith('/api')) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
      });
    } else {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    }
  }
};
