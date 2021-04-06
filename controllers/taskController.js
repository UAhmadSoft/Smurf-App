const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task=require('../models/Task');
const { Mongoose } = require('mongoose');
const Bid = require('../models/Bid');


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
    req.user.tasks.unshift(newtask._id);  // add task to customer tasks[_id]

    await req.user.save({runValidators:true});

    res.status(200).json({
       status: 'success',
       data:{
         task: newtask,
       }
    });
 });
 
 exports.getTask = catchAsync(async (req, res, next) => {
   const task = await Task.findById(req.params.id);
   
   console.log(task)
   console.log(req.user)

   if (!task){
      return next( new AppError(`No Task found against id ${req.params.id}`,404))
   }

    res.status(200).json({
       status: 'success',
       data:{
         task
       }
    });

 });

exports.updateTask=catchAsync(async(req,res,next)=>{
   const updateTask=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
   
   if (!updateTask)
    return next(new AppError(`Error updating Task`, 500));

  res.status(200).json({
    status: 'success',
    data:{
       task:updateTask
    }
  });

})


// task deleted after finishing the task task and only customer can deletd the task
 exports.deleteTask=catchAsync(async(req,res,next)=>{
   const task=await Task.findByIdAndDelete(req.params.id)

   if (!task){
      return next( new AppError(`No Task found against id ${req.params.id}`,404))
   }

   res.status(200).json({
      status: 'success',
      task
   });
   

 })


 exports.createbid=catchAsync(async(req,res,next)=>{
    const bid=await Bid.create(req.body)

    res.status(200).json({
      status: 'success',
      bid
   });
   
 })