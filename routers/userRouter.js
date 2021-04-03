const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');

const router = express.Router();

router.post('/signUp', authController.signup);
router.post('/login', authController.login);

router.route('/confirmMail/:activationLink').get(authController.confirmMail);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:resetToken').post(authController.resetPassword);

//router.use(protect); //  protect all router which are comming after this middleware

router.patch('/updatePassword',protect,authController.updatePassword);
router.patch('/deactivateAccount',protect,authController.deactivateAccount);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(protect,userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(protect,userController.updateUser)
  .delete(protect,userController.deleteUser);

module.exports = router;
