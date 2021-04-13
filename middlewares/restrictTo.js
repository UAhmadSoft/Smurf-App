const AppError = require('../utils/appError');

// apply restricting to specific members
module.exports = (...role) => {
  //  roles is an array like ['admin','lead-guide'] using res-parameter syntax
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      console.log(role);
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
