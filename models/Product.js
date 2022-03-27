const { array } = require('joi');
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the title'],
        minlength: 3,
    },
    description: {
        type: String,
        required: [true, "Please provide description"],
        minlength: 10
    },
    price: {
        type: Number,
        required:[true,"Please provide product price"]
    },
    category: { type: String },
    brand: { type: String },
    tags: {
        type: [String]

    },
    monthlyViews:{
        type: Number,
        default:0
    },
    images:{
        type:[String],
        required:[true,'provide atleast one image for the product']
    }

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema)