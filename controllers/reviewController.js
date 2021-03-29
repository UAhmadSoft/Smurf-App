const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task=require('../models/Task');
const Tasker=require('../models/Tasker');
const Review=require('../models/Review');

const { Mongoose } = require('mongoose');

exports.getAllReviews = catchAsync(async (req, res, next) => {
   let reviews;
   const { taskerId } = req.params;

   if (taskerId)
      reviews = await Review.find({
         tasker: taskerId,
      });
   else reviews = await Review.find();
   // SEND RESPONSE
   res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
         reviews,
      },
   });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const reviews = await Review.findById(req.params.id);
    
    console.log(reviews)
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


exports.getReview = catchAsync(async (req, res, next) => {
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
   let newReview;

   const { taskerId } = req.params;

   if (taskerId)
      newReview = await Review.create({
         review: req.body.review,
         rating: req.body.rating,
         customer: req.body.customer,
         tasker: taskerId,
      });
   else
      newReview = await Review.create({
         review: req.body.review,
         rating: req.body.rating,
         customer: req.body.customer,
         tasker: req.body.tasker,
      });

   res.status(200).json({
      status: 'success',
      data: {
         review: newReview,
      },
   });
});

exports.getTaskerReviews=catchAsync(async (req, res, next) => {  
   const taskerReview=await Tasker.findById({reviews:req.params})
})