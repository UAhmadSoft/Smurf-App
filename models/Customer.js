const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
  customerinfo: {
    type: String,
    //   required: [true, 'Please insert your info !'],
  },
  contactNo: {
    type: Number,
    // required: [true, 'Must have contactNo'],
    maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  whatsAppNo: {
    type: Number,
    // required: [true, 'Must have contactNo'],
    maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  address: {
    type: 'string',
    trim: true,
  },
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task' }],
});

customerSchema.pre(/^find/, function (next) {
  // this points to current query
  this.populate({
    path: 'customer',
    select: '_id name email role -__v',
  });
  next();
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
