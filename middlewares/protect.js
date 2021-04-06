const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Tasker = require('../models/Tasker');

//  Protecting Routes

const getProfile = async (user) => {
  let profile;
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
  return profile;
};

module.exports = catchAsync(async (req, res, next) => {
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
    return next(new AppError('you are not login ', 401));
  }
  // console.log(`process.env.JWT_SECRET`, process.env.JWT_SECRET);
  // 2- validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3- check user exits
  // console.log(decode)
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError('the user belong to this token does not exists ', 401)
    );
  }

  // console.log(currentUser)

  let newUser;

  if (newUser.role === 'admin' || newUser.role === 'customer care')
    newUser = newUser;
  else newUser = await getProfile(currentUser);

  // console.log(" new user ",newUser)

  // grant access to protected route
  // req.user must be either tasker , customer , admin or a customer care
  req.user = newUser;

  console.log(`req.user`, req.user);
  next();
});
