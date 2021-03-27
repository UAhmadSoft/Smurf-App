const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
    customerinfo: {
        type: String,
        required: [true, 'Please insert your info !'],
    },
    address:{
        type:'string',
        trim:true
    },
    customer:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
})

customerSchema.pre(/^find/, function (next) {
    // this points to current query
    this.populate({
      path: 'customer',
      select: '_id name email role',
    });
    next();
    
});


const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
