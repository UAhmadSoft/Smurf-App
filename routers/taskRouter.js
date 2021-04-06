const express = require('express');
const taskController = require('../controllers/taskController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const bidRouter = require('./bidRouter');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(protect, restrictTo('customer'), taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(protect, restrictTo('customer'), taskController.updateTask)
  .delete(protect, restrictTo('customer'), taskController.deleteTask);

router.patch(
  '/:id/finish',
  protect,
  restrictTo('customer'),
  taskController.finishTask
);

router.patch(
  '/:taskId/:taskerId/hire',
  protect,
  restrictTo('customer'),
  taskController.hireTasker
);

router.use('/:taskId/bid', bidRouter);

// router
//   .route('/:id/bid')
//   .post(taskController.createBid)

module.exports = router;
