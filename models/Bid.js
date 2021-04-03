const mongoose = require('mongoose');
const validator = require('validator');

const bidSchema = new mongoose.Schema({
    tasker_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tasker',
        required:[true,'must have tasker']
    },
    application:{
        type:String,
        minlength:[50,' application data must be greater than 50 characters'],
        trim:true,
    },
    budget:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    },
    task_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'task'
    }
    
})


const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
