const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectUser);

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(authController.protectRoute('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .post(
    authController.protectRoute('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.protectRoute('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
