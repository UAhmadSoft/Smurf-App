const express = require('express');
const categoryController = require('../controllers/categoryController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories);
router.route('/:').get(categoryController.getCategoryById);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').post(categoryController.addNewCategory);

router
  .route('/:')
  .patch(categoryController.updateCategoryById)
  .delete(categoryController.deleteCategoryById);

module.exports = router;
