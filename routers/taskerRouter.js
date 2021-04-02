const express = require('express');
const taskerController = require('../controllers/taskerController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const reviewRouter = require('./reviewRouter');

const router = express.Router();

router
  .route('/')
  .get(taskerController.getAllTaskers)
  .post(protect, restrictTo('tasker'), taskerController.createTasker);

router.use('/:taskerId/reviews', reviewRouter);

router.route('/:id').get(taskerController.getTasker);
// .patch(taskerController.updateTasker)
// .delete(taskerController.deleteTasker);

module.exports = router;
