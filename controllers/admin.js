const Product = require('../models/Product')
const User = require('../models/User')
const fs = require('fs')
const {
    UnAuthenticatedError, NotFoundError
} = require('../errors');
const cloudinary = require("../utils/cloudinary")

//fetch all products ............................... 
const getProducts = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    const user = await User.findById(user_id);

    if (!user.isAdmin === true) {
        throw new UnAuthenticatedError("Authorization error...the resource is only for admins")
    }


    const products = await Product.find({});
    res.status(200).json({ products });

}

const saveProduct = async (req, res) => {
    try{

    const product = await Product.create(req.body);
    res.status(201).json({ product });

    }catch(error){
     res.status(501).json({message:error.message})
    }

}

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId })
    if (!product) {
         throw new NotFoundError('the product was not found');
        return;
    }
    const images = product.images;
    //deleting product images................
    if (images.length > 0) {
        
        for (const img of images) {

            await cloudinary.uploader.destroy(img.image_id)

        }
    }
    //deleting the product............ 
    await Product.findOneAndRemove({_id:productId})
    res.status(200).json({ status: 'deleted' })
}

const deleteSingleImage = async (req, res) => {
    const { productId } = req.params;
    const { image_id} = req.body;
    // console.log(image);
    const product = await Product.findOne({ _id: productId })
    if (!product) {
        throw new NotFoundError('the product was not found');
        return;
    }
    
    const images = product.images;
    //deleting product image................
    await cloudinary.uploader.destroy(image_id)

    let newImagesList = images.filter(img => img.image_id !== image_id);
    //updating the product(rm deleted image)............ 
   let updatedProduct = await Product.findOneAndUpdate({ _id: productId },{images:newImagesList},{returnDocument:"after"})
    res.status(200).json({ status: 'updated',product:updatedProduct })
}

const updateProduct = async (req,res)=>{

    const {productId} = req.params;
    const updatedItem = await Product.findOneAndUpdate({_id:productId},req.body,{returnDocument:"after"});
   if (!updatedItem) {
       
       throw new NotFoundError("The product wasn't found")
    }
res.status(200).json({ status: 'updated',product:updatedItem });

 
}
module.exports = {
    getProducts, saveProduct, deleteProduct, deleteSingleImage, updateProduct
}