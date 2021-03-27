const mongoose = require('mongoose');
const validator = require('validator');

const taskerSchema = new mongoose.Schema({
    taskerinfo: {
        type: String,
    },
    contactNo:{
        type:Number,
        required: [true, 'Must have contactNo'],
        maxlength: [11, 'must  equal to 11'],
        minlength: [11, 'must  equal to 11'],
    },
    address:{   
        type:'string',
        trim:'true'
    },
    tasker:{
           type: mongoose.Schema.ObjectId,
            ref: 'User',
    },
    reviews:[
        {
           type:mongoose.Schema.ObjectId,
           ref:'Review'
        }
     ]
})

taskerSchema.pre(/^find/, function (next) {
    // this points to current query
    this.populate({
      path: 'tasker',
      select: '_id name email role',
    }).populate({
        path:'reviews'
    });
    next();
});



const Tasker = mongoose.model('Tasker', taskerSchema);

module.exports = Tasker;
