const express = require('express');
const authController = require('../controllers/authController');
const taskerController = require('../controllers/taskerController');

const reviewRouter = require('./reviewRouter');

const router = express.Router();

router
   .route('/')
   .get(taskerController.getAllTaskers)
   .post(
      authController.protect,
      authController.restrictTo('tasker'),
      taskerController.createTasker
   );

router.use('/:taskerId/reviews', reviewRouter);

router.route('/:id').get(taskerController.getTasker);
// .patch(taskerController.updateTasker)
// .delete(taskerController.deleteTasker);

module.exports = router;
