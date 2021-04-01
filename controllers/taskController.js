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
 
    const newtask = await Task.create({
        description:req.body.description,
        price:req.body.price,
        startAddress:req.body.startAddress,
        vehiclesRequired:req.body.vehiclesRequired,
        user:req.body.user
    });
 
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