const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Bid = require('../models/Bid');
const Task = require('../models/Task');

exports.createBid = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  console.log(`taskId`, taskId);
  console.log(`req.user._id`, req.user._id);

  const task = await Task.findById(taskId);
  if (!task)
    return next(new AppError(`No Task found against id ${taskId}`, 404));

  console.log(
    `task.bids.map(el => el.taskerId)`,
    task.bids.map((el) => el.taskerId)
  );

  // * Check if Tasker already made a bid for this task
  const already = task.bids.find(
    (el) => JSON.stringify(el.taskerId) === JSON.stringify(req.user._id)
  );
  if (already)
    return next(new AppError(`You already made bid for this task!`, 400));

  //   * Create Bid
  const bid = await Bid.create({
    ...req.body,
    taskId: taskId,
    taskerId: req.user._id,
  });

  //   * Save bid to Task
  task.bids.unshift(bid._id);
  await task.save();

  res.status(201).json({
    status: 'success',
    bid,
    task,
  });
  
  
});
