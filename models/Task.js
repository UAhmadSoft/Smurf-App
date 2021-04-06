const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
  images: [String],
  description: {
    type: String,
    required: [true, 'A Task Must have a Description'],
    minlength: [30, 'Description must be at least 30 characters'],
  },
  budget: Number,
  Address: String,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  subCategories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SubCategory',
    },
  ],
  estimatedHours: Number,
  scheduleTime: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
  tasker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tasker',
  },
  bids: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Bid',
    },
  ],
});

taskSchema.pre(/^find/, function (next) {
  // this points to current query
  this.populate({
    path: 'customer',
  }).populate({
    path: 'bids',
  });

  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
