// const express = require('express');
// const gigController = require('../controllers/gigController');
// const protect = require('../middlewares/protect');
// const restrictTo = require('../middlewares/restrictTo');

// const router = express.Router({ mergeParams: true });     //   nested route with Tasker on tasker can create gig

// router
//   .route('/')
//   .get(gigController.getAllGigs)
//   .post(protect, restrictTo('tasker'), gigController.createGig);

// router.route('/:id')
//   .get(gigController.getGig)
//   .patch(protect, restrictTo('tasker'),gigController.updateGig)
//   .delete(protect, restrictTo('tasker'),gigController.deleteGig)


// module.exports = router;
