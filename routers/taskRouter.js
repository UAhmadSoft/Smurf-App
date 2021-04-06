const express = require('express');
const taskController = require('../controllers/taskController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(protect, restrictTo('customer'), taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(protect,restrictTo('customer'),taskController.updateTask)
  .delete(protect,restrictTo('customer'),taskController.deleteTask);

// router
//   .route('/:id/bid')
//   .post(taskController.createBid)

module.exports = router;
