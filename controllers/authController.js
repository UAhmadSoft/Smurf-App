const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const Customer = require('../models/Customer');
const Tasker = require('../models/Tasker');
const sendMail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // payload + secret + expire time
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// cookie a small piece of text that a server sends to
const creatsendToken = (user, statusCode, res) => {
  const token = signToken(user.userInfo._id);
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

  // Generate Account Activation Link
  const activationToken = user.createAccountActivationLink();

  user.save({ validateBeforeSave: false });

  // 4 Send it to Users Email
  const activationURL = `http://localhost:5000/api/v1/users/confirmMail/${activationToken}`;

  // const activationURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/confirmMail/${activationToken}`;

  const message = `GO to this link to activate your Smurf Account : ${activationURL} .`;

  sendMail({
    email: user.email,
    message,
    subject: 'Your Account Activation Link for Smurf App !',
    user,
    template: 'signupEmail.ejs',
    url: activationURL,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });

  // creatsendToken(newUser, 201, res);

});

exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;
  console.log(email);
  
  if (!email || !password) {
    //  check email and password exist
    return next(new AppError(' please proveide email and password ', 400));
  }

  const user = await User.findOne({ email }).select('+password'); // select expiclity password

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
        `Plz Activate your email by the Link sent to your email ${user.emil}`,
        401
      )
    );

  let profile = { ...user };

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

  // if eveything is ok
  creatsendToken(profile, 200, res);
});

exports.confirmMail = catchAsync(async (req, res) => {
  // 1 Hash The Avtivation Link
  // console.log(req.params.activationLink);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.activationLink)
    .digest('hex');

  // console.log(hashedToken);

  const user = await User.findOne({
    activationLink: hashedToken,
  });

  if (!user) return next(new AppError(`Activation Link Invalid or Expired !`));
  // 3 Activate his Account
  user.activated = true;
  user.activationLink = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'Success',
    message: 'Account Activated Successfully !',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 Check if Email Exists
  const { email } = req.body;

  if (!email) return next(new AppError(`Plz provide Email with request`, 400));

  // 2 Check If User Exists with this email
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user)
    return next(new AppError(`No User Found against Email : ${email}`, 400));

  // 3 Create Password Reset Token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 4 Send it to Users Email
  // const resetURL = `localhost:5000/api/v1/users/resetPassword/${resetToken}`;

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot Password . Update your Password at this link ${resetURL} if you actually request it
   . If you did NOT forget it , simply ignore this Email`;

  sendMail({
    email,
    message,
    subject: 'Your Password reset token (will expire in 20 minutes)',
    user,
    template: 'forgotPassword.ejs',
    url: resetURL,
  });

  res.status(200).json({
    status: 'Success',
    message: `Forget password link successfully sent to your email : ${email}`,
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  // 1 Find the  user based on Token

  // console.log(req.params.resetToken);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // 2 Check if user still exists and token is NOT Expired
  if (!user) return next(new AppError(`Activation Link Invalid or Expired !`));

  // 3 Change Password and Log the User in
  const { password, passwordConfirm } = req.body;

  // console.log('passwords are', password, passwordConfirm);

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save({ runValidators: false });

  const token = signToken(user._id);

  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
  });
});
