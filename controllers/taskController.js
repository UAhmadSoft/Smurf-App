const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task=require('../models/Task');
const { Mongoose } = require('mongoose');


exports.getAllTasks = catchAsync(async (req, res, next) => {
   const tasks = await Task.find();
 
    // SEND RESPONSE
   res.status(200).json({
       status: 'success',
       results: tasks.length,
       data: {
        tasks,
       },
    });
 
 });
 
 exports.createTask = catchAsync(async (req, res, next) => {
 
    const newtask = await Task.create(req.body);
    req.user.tasks.unshift(newtask._id);

    await req.user.save({runValidators:true});

    console.log(newtask)
    console.log(req.user)

    res.status(200).json({
       status: 'success',
       data:{
         task: newtask,
       }
    });
 });
 
 exports.getTask = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
 
    if (!task)
       return res.status(404).json({
          status: 'failed',
          message: `No Task found against id ${req.params.id}`,
       });
 
    res.status(200).json({
       status: 'success',
       data:{
         task
       }
    });
 });