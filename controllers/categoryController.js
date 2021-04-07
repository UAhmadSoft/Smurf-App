const SubCategory = require('../models/SubCat');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await SubCategory.find();

  res.status(200).json({
    results: categories.length,
    categories,
  });
});

module.exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await SubCategory.findById(req.params.id);

  if (!category)
    return next(new AppError(`No Category Found against id ${id}`, 404));

  res.status(200).json({
    category,
  });
});

module.exports.deleteCategoryById = catchAsync(async (req, res, next) => {
  const category = await SubCategory.findByIdAndDelete(req.params.id);

  if (!category)
    return next(new AppError(`No Category Found against id ${id}`, 404));

  res.status(200).json({
    categories,
  });
});

module.exports.updateCategoryById = catchAsync(async (req, res, next) => {
  const category = await SubCategory.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    category,
  });
});

module.exports.addNewCategory = catchAsync(async (req, res, next) => {
  const category = await SubCategory.create({
    title: req.body.title,
  });

  res.status(200).json({
    category,
  });
});
