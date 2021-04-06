const express = require('express');
const bidController = require('../controllers/bidController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, restrictTo('tasker'), bidController.createBid);

module.exports = router;
