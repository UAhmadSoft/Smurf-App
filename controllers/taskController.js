const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task = require('../models/Task');
const { Mongoose } = require('mongoose');
const Bid = require('../models/Bid');
const Tasker = require('../models/Tasker');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    tasks,
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const newtask = await Task.create(req.body);

  // * add task to customer tasks[_id]
  req.user.tasks.unshift(newtask._id);
  await req.user.save({ runValidators: true });

  // * Save customerId in Task
  newtask.customer = req.user._id;
  newtask.save();

  res.status(200).json({
    status: 'success',
    task: newtask,
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError(`No Task found against id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    task,
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateTask) return next(new AppError(`Error updating Task`, 500));

  res.status(200).json({
    status: 'success',
    task: updateTask,
  });
});

// task deleted after finishing the task task and only customer can deletd the task
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError(`No Task found against id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    task,
  });
});

exports.createbid = catchAsync(async (req, res, next) => {
  const bid = await Bid.create(req.body);

  res.status(200).json({
    status: 'success',
    bid,
  });
});

exports.hireTasker = catchAsync(async (req, res, next) => {
  const { taskId, taskerId } = req.params;

  const task = await Task.findById(taskId);

  if (!task)
    return next(new AppError(`No Task found against id ${taskId}`, 404));

  console.log(`task.customer._id`, task.customer._id);
  console.log(`req.user._id`, req.user._id);

  if (
    !task.customer ||
    JSON.stringify(task.customer._id) !== JSON.stringify(req.user._id)
  )
    return next(
      new AppError(
        `You Cannot Hire a tasker for Task which you didn't posted`,
        403
      )
    );

  const tasker = await Tasker.findById(taskerId);

  if (!tasker)
    return next(new AppError(`No tasker found against id ${taskerId}`, 404));

  task.tasker = taskerId;
  await task.save();

  res.status(200).json({
    status: true,
    task,
  });
});

exports.finishTask = (req, res, next) => {};
