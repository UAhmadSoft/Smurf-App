const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'must be greater than 1'], //   validator
      max: [5, 'must be smaller than 5 '], //  validator
    },
    created_At: {
      type: Date,
      default: Date.now,
    },
    tasker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tasker',
      required: [true, 'Review must belong to a tasker'],
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
      required: [true, 'Review must given by a Customer'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this points to current query
  // this.populate({
  //   path: 'tasker',
  // }).populate({
  //     path:'customer'
  // })

  this.populate({
    path: 'customer',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
