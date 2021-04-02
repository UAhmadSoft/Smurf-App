const express = require('express');
const reviewController = require('../controllers/reviewController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('customer'), reviewController.createReview);

router.route('/:id').get(reviewController.getReview);

module.exports = router;
