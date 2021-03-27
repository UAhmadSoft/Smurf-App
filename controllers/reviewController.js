const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task=require('../models/Task');
const Review=require('../models/Review');
const { Mongoose } = require('mongoose');


exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    // SEND RESPONSE
    res.status(200).json({
       status: 'success',
       results: reviews.length,
       data: {
        reviews,
       },
    });
 
});

exports.getAllReviewsofTasker = catchAsync(async (req, res, next) => {
    const reviews = await Review.findById(req.params.id);
    
    if (!reviews)
       return res.status(404).json({
          status: 'failed',
          message: `No review found against id ${req.params.id}`,
       });

    // SEND RESPONSE
    res.status(200).json({
       status: 'success',
       results: reviews.length,
       data: {
        reviews,
       },
    });
 
});


exports.createReview = catchAsync(async (req, res, next) => {
 
    const newReview = await Review.create({
        review:req.body.review,
        rating:req.body.rating,
        customer:req.body.customer,
        tasker:req.body.tasker

    });
 
    res.status(200).json({
       status: 'success',
       data:{
         review: newReview,
       }
    });
 });
 
//  exports.getTask = catchAsync(async (req, res, next) => {
//     const task = await Task.findById(req.params.id);
 
//     if (!task)
//        return res.status(404).json({
//           status: 'failed',
//           message: `No Task found against id ${req.params.id}`,
//        });
 
//     res.status(200).json({
//        status: 'success',
//        data:{
//          task
//        }
//     });
//  });