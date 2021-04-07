const User = require('../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Tasker = require('../models/Tasker');
const { Mongoose } = require('mongoose');

// const filterObj = (obj, ...allowedFields) => {
//    const newObj = {};
//    Object.keys(obj).forEach((el) => {
//       if (allowedFields.includes(el)) newObj[el] = obj[el];
//    });
//    return newObj;
// };


exports.getAllTaskers = catchAsync(async (req, res, next) => {
   const tasker = await Tasker.find();

   // SEND RESPONSE
   res.status(200).json({
      status: 'success',
      results: tasker.length,
      data: {
         tasker,
      },
   });
});



exports.updateProfile = catchAsync(async (req, res, next) => {
   // 1) Create error if user POSTs password data
   if (req.body.password || req.body.passwordConfirm) {
     return next(
       new AppError(
         'This route is not for password updates. Please use /updateMyPassword.',
         400
       )
     );
   }
   // 2) Filtered out unwanted fields names that are not allowed to be updated
   // 3) Update user document
   const updatedUser1 = await Tasker.findById(req.params.id);
   console.log(`updatedUser1`, updatedUser1);
 
   const updatedUser = await Tasker.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true,});
   
   if (!updatedUser)
     return next(new AppError(`Error updating User's Profile`, 500));
 
   res.status(200).json({
     status: 'success',
     data: {
       user: updatedUser,
     },
   });
 });

exports.getTasker = catchAsync(async (req, res, next) => {
   const tasker = await Tasker.findById(req.params.id).populate('reviews')

   if (!tasker)
      return res.status(404).json({
         status: 'failed',
         message: `No tasker found against id ${req.params.id}`,
      });

   res.status(200).json({
      status: 'success',
      data: {
         tasker,
      },
   });
});
