const User = require('../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Tasker=require('../models/Tasker');
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

exports.createTasker = catchAsync(async (req, res, next) => {
   const newtasker = await Tasker.create({
      taskerinfo: req.body.taskerinfo,
      address:req.body.address,
      contactNo:req.body.contactNo,
      tasker:req.body.tasker
   });

   res.status(200).json({
      status: 'success',
      tasker: newtasker,
   });
});

// exports.updateUser = catchAsync(async (req, res, next) => {
//    // 1) Create error if user POSTs password data
//    if (req.body.password || req.body.passwordConfirm) {
//       return next(
//          new AppError(
//             'This route is not for password updates. Please use /updateMyPassword.',
//             400
//          )
//       );
//    }

//    // 2) Filtered out unwanted fields names that are not allowed to be updated
//    const filteredBody = filterObj(req.body, 'name', 'email');

//    // 3) Update user document
//    const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       filteredBody,
//       {
//          new: true,
//          runValidators: true,
//       }
//    );

//    res.status(200).json({
//       status: 'success',
//       data: {
//          user: updatedUser,
//       },
//    });
// });

exports.getTasker = catchAsync(async (req, res, next) => {
   const tasker = await Tasker.findById(req.params.id);

   if (!tasker)
      return res.status(404).json({
         status: 'failed',
         message: `No User found against id ${req.params.id}`,
      });

   res.status(200).json({
      status: 'success',
      data:{
         tasker
      }
   });
});

// exports.deleteUser = catchAsync(async (req, res, next) => {
//    const deletedUser = await User.findByIdAndDelete(req.params.id);

//    if (!deletedUser)
//       return res.status(404).json({
//          status: 'failed',
//          message: `No User found against id ${req.params.id}`,
//       });

//    res.status(200).json({
//       status: 'success',
//       user: deletedUser,
//    });
// });
