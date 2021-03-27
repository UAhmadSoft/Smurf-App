const express = require('express');
const authController=require('../controllers/authController')
const taskController=require('../controllers/taskController')


const router = express.Router();


router
   .route('/')
   .get(taskController.getAllTasks)
   .post(authController.protect,authController.restrictTo('customer'),taskController.createTask);

// router
   // .route('/:id')
   // .get(taskController.getTask)
   // .patch(taskController.updateTaske)
   // .delete(taskController.deleteTaske);    




module.exports = router;
