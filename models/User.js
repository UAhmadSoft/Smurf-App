const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      unique: true,
      trim: true,
      maxlength: [20, 'must be less than or equal to 20'],
      minlength: [5, 'must be greater than 5'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   photo: String,
   role: {
      type: String,
      enum: ['customer', 'tasker', 'admin'],
      default: 'customer',

    },
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
         message: 'Passwords are not the same!',
      },
   },
   passwordResetToken: String,
   passwordResetExpires: Date,
});

// Encrpt the password ad Presave it 
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {                     //  only run if password is modified
     return next();
   }
   this.password = await bcrypt.hash(this.password, 12);  // hashing password
   this.passwordConfirm = undefined;                     // delete passwordConfirm field
   next();
 });


// comparing password
userSchema.methods.correctPassword = async function ( candidate_Password,user_Password) {
   console.log(candidate_Password)
 return await bcrypt.compare(candidate_Password, user_Password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
