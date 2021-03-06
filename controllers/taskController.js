const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task = require('../models/Task');
const { Mongoose } = require('mongoose');
const Bid = require('../models/Bid');
const Tasker = require('../models/Tasker');
const User = require('../models/User');
const sendMail = require('../utils/email');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

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
  const user = await User.findById(req.user._id);

  // * add task to customer tasks[_id]
  user.tasks.unshift(newtask._id);
  user.tasks = [...new Set(user.tasks)];
  await user.save({ validateBeforeSave: false });

  // * Save customerId in Task
  newtask.customer = user._id;
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

  // //  send message to tasker for accepting a bid
  // client.messages.create({
  //   body: `congrats ${tasker.name} your bid has been accepted kindly contact to ${task.customer.name} thanks`,
  //   from: '+12052930626',
  //   to: `+92${tasker.contactNo}`,
  // }).then(message => console.log(message.sid));

  const message = `congrats ${tasker.name} your bid has been accepted kindly contact to ${task.customer.name} thanks`;
  //  send mail to tasker for accepting a bid
  sendMail({
    email: tasker.email,
    message,
    subject: 'bid accepted',
    tasker,
    template: 'simpleEmail.ejs',
    url: '',
  });
  console.log(tasker.email);

  res.status(200).json({
    status: true,
    task,
  });
});

exports.finishTask = (req, res, next) => {};
