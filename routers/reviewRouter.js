const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
   .route('/')
   .get(reviewController.getAllReviews)
   .post(
      authController.protect,
      authController.restrictTo('customer'),
      reviewController.createReview
   );

router.route('/:id').get(reviewController.getReview);

module.exports = router;
