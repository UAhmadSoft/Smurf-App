const express = require('express');
const authController=require('../controllers/authController')
const customerController=require('../controllers/customerController')


const router = express.Router();


router
   .route('/')
   .get(customerController.getAllCustomers)
   .post(authController.protect,authController.restrictTo('customer'),customerController.createCustomer);


router
   .route('/:id')
   .get(customerController.getCustomer)
   // .patch(taskerController.updateTasker)
   // .delete(taskerController.deleteTasker);    

module.exports = router;
