const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

const createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;
  const newReview = await Review.create({
    review,
    rating,
    tour: req.params.tourId,
    user: req.user?.id,
  });

  res.status(201).json({
    status: 'success',
    data: newReview,
  });
});

const getAllReview = factory.getAll(Review);
const getReview = factory.getOne(Review);
const updateReview = factory.deleteOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
  createReview,
  getAllReview,
  getReview,
  updateReview,
  deleteReview,
};
