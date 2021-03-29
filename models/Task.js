const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'A Task Must have a Description'],
    minlength: [30, 'Description must be at least 30 characters'],
  },
  budget: Number,
  startAddress: {
    type: String,
    required: [true, 'A Task Must have an Starting Address'],
  },
  endAddress: String,
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
  images: [String],
  estimatedHours: Number,
  vehiclesRequired: [String],
  toolsRequired: [String],
  scheduleTime: Date,
  startTime: Date,
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
  //   proposals: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Proposal',
  //   },
});

taskSchema.pre(/^find/, function (next) {
  // this points to current query
  this.populate({
    path: 'user',
  });
  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
