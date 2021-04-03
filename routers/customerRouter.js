const express = require('express');
const customerController = require('../controllers/customerController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();
router.route('/').get(customerController.getAllCustomers);

router
  .route('/:id')
  .get(customerController.getCustomer)
  .patch(protect, restrictTo('customer'), customerController.updateProfile);

module.exports = router;
