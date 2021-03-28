const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty'],
    },
    rating:{
        type: Number,
        default: 3,
        min: [1, 'must be greater than 1'], //   validator
        max: [5, 'must be smaller than 5 '], //  validator
    },
    customer:{
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
    },
    tasker:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tasker',
    },
    created_At: {
        type: Date,
        default: Date.now,
      },

})

reviewSchema.pre(/^find/, function (next) {
    // this points to current query
    this.populate({
      path: 'customer',
    });
    
    next();
    
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
