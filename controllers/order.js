const Order = require('../models/Order')
const User = require('../models/User')
const Errors = require('../errors')
const fetchOrders = async (req,res)=>{
    const {userId}  = req.user;
    console.log('userId',userId)
    console.log('req.params.ownerId',req.params.ownerId)
    if (userId !== req.params.ownerId) {
        throw new Errors.UnAuthenticatedError('You can only access your orders')
    }
    const orders = await Order.find({owner:req.params.ownerId}).sort('-createdAt').populate('owner');
    res.status(200).json({orders});

}

const fetchAllOrders = async (req,res)=>{
    const {userId} = req.user;
    const user = await User.findById(userId);
    if(!user.isAdmin){
        throw new Errors.UnAuthenticatedError('you need to be the admin to access this point')
    }
    const orders = await Order.find({}).sort('-createdAt').populate('owner');
    res.status(200).json({orders})
}

const saveOrder = async (req,res)=>{
    await Order.create(req.body);
    res.status(200).json({status:'your order was saved successfully'})
}

module.exports = {
    saveOrder,fetchOrders,fetchAllOrders
}   

