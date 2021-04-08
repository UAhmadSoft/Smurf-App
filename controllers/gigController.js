// const Gig = require('../models/Gig');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');


// module.exports.createGig = catchAsync(async (req, res, next) => {
//   const gig = await Gig.create({
//     title: req.body.title,
//   });

//   res.status(200).json({
//     gig,
//   });
// });


// module.exports.getAllGigs = catchAsync(async (req, res, next) => {
//   const gigs = await Gig.find();

//   res.status(200).json({
//     results: gigs.length,
//     gigs,
//   });
// });

// module.exports.getGig = catchAsync(async (req, res, next) => {
//   const gig = await Gig.findById(req.params.id);

//   if (!gig)
//     return next(new AppError(`No Gig Found against id ${id}`, 404));

//   res.status(200).json({
//     gig,
//   });
// });

// module.exports.updateGig = catchAsync(async (req, res, next) => {
//   const gig = await Gig.findByIdAndUpdate(req.params.id, req.body);

//   res.status(200).json({
//     gig,
//   });
// });

// module.exports.deleteGig = catchAsync(async (req, res, next) => {
//   const gig = await Gig.findByIdAndDelete(req.params.id);

//   if (!gig)
//     return next(new AppError(`No Gig Found against id ${id}`, 404));

//   res.status(200).json({
//     gig,
//   });
// });