const mongoose = require('mongoose');
const validator = require('validator');

const taskerSchema = new mongoose.Schema({
  bio: {
    type: String,
  },
  contactNo: {
    type: Number,
    unique:true,
    // required: [true, 'Must have contactNo'],
    // maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  whatsAppNo: {
    type: Number,
    uniqu:true,
    // required: [true, 'Must have contactNo'],
    maxlength: [11, 'must  equal to 11'],
    minlength: [11, 'must  equal to 11'],
  },
  workingLocations: [
    {
      type: String,
      trim: true,
    },
  ],
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
  skills: [String],
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  userInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  age: Number,
  hourlyRate: Number,
  dailyRate: Number,
  experience: {
    type: String,
    enum: ['6-months', '1-Year', , '3-years', '5-Years', '10-Years'],
  },
  education: [
    {
      type: String
    },
  ],
  certificates: [
    {
      type:String
    }
  ],
  cnic:{
    type:Number,
    unique:true,
    maxlength: [13, 'must  equal to 13'],
    minlength: [13, 'must  equal to 13'],
  },
  cnicPic: String,
  isVerified: Boolean,
  isSpended:{
    type:Boolean,
    default:false,
  },
  isBlocked:{
    type:Boolean,
    default:false
  },

  tasks: [{ type: mongoose.Schema.ObjectId, ref: 'Task' }],
});

taskerSchema.pre(/^find/, function (next) {
  // this points to current query
  this.populate({
    path: 'userInfo',
    select: '_id name email role',
  });

  next();
});


const Tasker = mongoose.model('Tasker', taskerSchema);
module.exports = Tasker;
