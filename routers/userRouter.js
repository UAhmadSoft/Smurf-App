const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(protect, userController.createUser);

router
  .route('/me')
  .get(protect, userController.setMe, userController.getUser)
  .patch(protect, userController.setMe, userController.updateUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(protect, userController.updateUser)
  .delete(protect, userController.deleteUser);

module.exports = router;
