const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Bid=require('../models/Bid');

exports.createBid=catchAsync(async(req,res,next)=>
{
    const bid=await Bid.create(req.body)


    res.status(201).json({
        status:'success',
        data:{
            bid
        }
    })
})