const User = require('../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Customer = require('../models/Customer');
const { Mongoose } = require('mongoose');

// const filterObj = (obj, ...allowedFields) => {
//    const newObj = {};
//    Object.keys(obj).forEach((el) => {
//       if (allowedFields.includes(el)) newObj[el] = obj[el];
//    });
//    return newObj;
// };

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: {
      customers,
    },
  });
});

exports.createCustomer = catchAsync(async (req, res, next) => {
  const newcustomer = await Customer.create({
    customerinfo: req.body.customerinfo,
    address: req.body.address,
    customer: req.body.customer,
  });

  res.status(200).json({
    status: 'success',
    data: {
      customer: newcustomer,
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
  const updatedUser1 = await Customer.findById(req.params.id);
  console.log(`updatedUser1`, updatedUser1);

  const updatedUser = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser)
    return next(new AppError(`Error updating User's Profile`, 500));

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).json({
      status: 'failed',
      message: `No User found against id ${req.params.id}`,
    });

  res.status(200).json({
    status: 'success',
    data: {
      customer,
    },
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
