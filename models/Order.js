
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    totalAmount: {
        type: Number,
        required: [true, 'Please provide the total amount of this order'],
    
    },
    totalQuantity:{
        type: Number,
        required: [true, 'Please provide the total number of items of this order']
    },
    orderItems:[Object]


}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema)