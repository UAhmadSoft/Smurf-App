const express = require('express');
const userController = require('../controllers/userController');
const authController=require('../controllers/authController')

const router = express.Router();

router.post('/signUp',authController.signup)
router.post('/login',authController.login) 	

router.use(authController.protect); //  protect all router which are comming after this middleware 

router
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser);

router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser);

module.exports = router;
