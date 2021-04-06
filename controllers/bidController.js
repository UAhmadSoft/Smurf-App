const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Bid = require('../models/Bid');

exports.createBid = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  console.log(`taskId`, taskId);
  console.log(`req.user._id`, req.user._id);

  const bid = await Bid.create({
    ...req.body,
    taskId: taskId,
    taskerId: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: bid,
  });
});
