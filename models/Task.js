const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
   description: {
      type: String,
      required: [true, 'A Task Must have a Description'],
      minlength: [30, 'Description must be at least 30 characters'],
      price: Number,
      startAddress: {
         type: String,
         required: [true, 'A Task Must have an Starting Address'],
      },
      endAddress: String,
      estimatedHours: Number,
      vehiclesRequired: [String],
      scheduleTime: Date,
      startTime: Date,
      endTime: Date,
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
