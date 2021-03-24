const mongoose = require('mongoose');
const validator = require('validator');

const profileSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please tell us your name!'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   photo: String,
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
         // This only works on CREATE and SAVE!!!
         validator: function (el) {
            return el === this.password;
         },
         message: 'Passwords are NOT the same!',
      },
   },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
