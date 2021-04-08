const mongoose = require('mongoose');
const validator = require('validator');

const bidSchema = new mongoose.Schema({
  taskerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasker',
    required: [true, 'must have tasker'],
  },
  application: {
    type: String,
    minlength: [50, ' application data must be greater than 50 characters'],
    trim: true,
  },
  budget: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Must belong to a Task'],
  },
  
});


const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
