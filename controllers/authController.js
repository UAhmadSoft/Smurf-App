const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const Tasker = require('../models/Tasker');
// const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, 'abc-ooppqq-ok-secrete-key', {
    // payload + secret + expire time
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// cookie a small piece of text that a server sends to
const creatsendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // converting to milisec
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  // Remove the password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let user = await User.create(req.body);

  if (req.body.role === 'customer') {
    newUser = await Customer.create({
      userInfo: user._id,
    });
  } else if (req.body.role === 'tasker')
    newUser = await Tasker.create({
      userInfo: user._id,
    });
  else return next(new AppError(`Plz provide a valid role`, 400));

  creatsendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    //  check email and password exist
    return next(new AppError(' please proveide email and password ', 400));
  }
  //   if (!password) {                                              //  check email and password exist
  //     return next(new AppError(' please proveide password', 400));
  //   }
  const user = await User.findOne({ email }).select('+password'); // select expiclity password
  console.log(user);
  if (!user)
    return next(new AppError(`No User found against email ${email}`, 404));
  if (
    !user || // check user exist and password correct
    !(await user.correctPassword(password, user.password))
  ) {
    // candinate password,correctpassword
    return next(new AppError('incorrect email or password', 401));
  }

  if (user.activated === false)
    return next(
      new AppError(
        `Plz Activate your email by then Link sent to your email ${user.emil}`,
        401
      )
    );

  let profile = { ...user };
  console.log(`user`, user);
  if (user.role === 'customer') {
    profile = await Customer.findOne({
      userInfo: user._id,
    })
      .populate('userInfo')
      .exec();
  } else if (user.role === 'tasker') {
    profile = await Tasker.findOne({
      userInfo: user._id,
    })
      .populate('userInfo')
      .exec();
  }

  console.log(`profile`, profile);
  // if eveything is ok
  creatsendToken(profile, 200, res);
});

//  Protecting Routes

exports.protect = catchAsync(async (req, res, next) => {
  // 1- get the token check if exist
  //   const token=req.header('Authorization').replace('Bearer ','')
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError(' you are not login ', 401));
  }
  // 2- validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3- check user exits
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError('the user belong to this token does not exists ', 401)
    );
  }

  // grant access to protected route
  req.user = currentUser;
  next();
});

// apply restricting to specific members
exports.restrictTo = (...role) => {
  //  roles is an array like ['admin','lead-guide'] using res-parameter syntax
  return (req, res, next) => {
    console.log(role);
    if (!role.includes(req.user.role)) {
      console.log(role);
      return next(
        new AppError(' you do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
