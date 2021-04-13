const mongoose = require('mongoose');
const validator = require('validator');
const Tasker = require('./Tasker');

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

//  each user can review each tasker only once so applying restriction
//  and means each combination of tasker and customer always unique
reviewSchema.index({ tasker: 1, customer: 1 }, { unique: true });

reviewSchema.statics.cal_averageRatings = async function (taskerId) {
  // id for which the current review belong to
  // using aregation pipeline
  const stats = await this.aggregate([
    {
      $match: { tasker: taskerId },
    },
    {
      $group: {
        _id: '$tasker', // group by tasker  tasker field is defiend in current doc
        nRating: { $sum: 1 }, // add one for each rating e.g  5 review/ratings =  5 no of review/ratings
        avgRating: { $avg: '$rating' }, //  no of the field in current doc
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await Tasker.findByIdAndUpdate(taskerId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tasker.findByIdAndUpdate(taskerId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//  each time new review is created calculate/update the nRating,avdRating
reviewSchema.post('save', function () {
  this.constructor.cal_averageRatings(this.tasker);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
