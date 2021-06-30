const mongoose = require('mongoose');
const validator = require('validator');

const User = require('./User');

const customerSchema = new mongoose.Schema({
  bio: {
    type: String,
    //   required: [true, 'Please insert your info !'],
  },
  contactNo: {
    type: Number,
    // unique: true,
    // required: false,
    maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  whatsAppNo: {
    type: Number,
    // unique: true,
    // required: false,
    maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  address: {
    type: 'string',
    trim: true,
  },
  tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task' }],
});

const customerModel = User.discriminator('Customer', customerSchema);

module.exports = customerModel;
